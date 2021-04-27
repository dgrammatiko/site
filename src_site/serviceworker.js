// @TODO add WritableStream support for FF and Safari
// import "@stardazed/streams-polyfill";
// import { createAdaptedFetch, createAdaptedResponse } from "@stardazed/streams-fetch-adapter/dist/";
// import 'web-streams-polyfill/dist/polyfill.es2018';
// import { ReadableStream, WritableStream } from "@stardazed/streams/dist/sd-streams.esm";
const cacheName = `dGrammatiko-${VERSION}`;

// Urls that needs to be cached on installation
const preCached = [
  "/index-top.html",
  "/index-bottom.html",
  "/offline.content.html",
  "/offline.html",
  "/manifest.json",
  "/static/fonts/dgrammatiko.woff2",
  "/static/fonts/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_LjQbMZhKSbpUVzEEQ.woff",
  "/static/js/ce-theme-switcher.esm.js",
];

addEventListener("install", (event) => {
  skipWaiting();

  event.waitUntil(
    (async function () {
      const cache = await caches.open(cacheName);
      await cache.addAll(preCached);
    })()
  );
});

addEventListener("activate", (event) => {
  event.waitUntil(
    (async function () {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== cacheName) return caches.delete(key);
        })
      );
    })()
  );
});

const checkUrl = (url) => {
  let isValid = false;
  for (const xu in routes) {
    if (xu.length > 1 && xu.slice(0, 1) === url) {
      isValid = true;
    }

    if (xu.length === 1 && url.length === 1) {
      isValid = true;
    }
  }
  return isValid;
}
class IdentityStream {
  constructor() {
    let readableController;
    let writableController;

    this.readable = new ReadableStream({
      start(controller) {
        readableController = controller;
      },
      cancel(reason) {
        writableController.error(reason);
      }
    });

    this.writable = new WritableStream({
      start(controller) {
        writableController = controller;
      },
      write(chunk) {
        readableController.enqueue(chunk);
      },
      close() {
        readableController.close();
      },
      abort(reason) {
        readableController.error(reason);
      }
    });
  }
}

async function streamArticle(event, url) {
  url.pathname = /\/index\.html$/.test(url.pathname)
    ? url.pathname.replace(/index.html$/, "index.content.html")
    : /\/$/.test(url.pathname)
    ? `${url.pathname}index.content.html`
    : `${url.pathname}/index.content.html`;

    console.log(url.pathname)
  const parts = [
    caches.match("/index-top.html"),
    fetch(url).catch(() => caches.match("/offline.content.html")),
    caches.match("/index-bottom.html"),
  ];

  const identity = new IdentityStream();

  event.waitUntil(async function() {
    for (const responsePromise of parts) {
      const response = await responsePromise;
      await response.body.pipeTo(identity.writable, { preventClose: true });
    }
    identity.writable.getWriter().close();
  }());

  const cache = await caches.open(cacheName);
  const theStreamedPart = new Response(identity.readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  await cache.put(event.request, theStreamedPart.clone());
  return theStreamedPart;
}

addEventListener("fetch", (event) => {
  const { request } = event;

  // Prevent Chrome Developer Tools error:
  // Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
  //
  // See also https://stackoverflow.com/a/49719964/1217468
  if ((request.cache === 'only-if-cached' && request.mode !== 'same-origin')
    || request.method !== "GET" || request.mode !== "navigate") {
    return;
  }

  event.respondWith(
    (async function () {
      const cache = await caches.open(cacheName)
      const url = new URL(request.url);

      // Full page fetch fallback
      const cachedReponse = await cache.match(request);
      if (cachedReponse) return cachedReponse;

      // This works only on chromium based UA
      if (checkUrl(url.pathname) && typeof WritableStream === "function") {
        return streamArticle(event, url);
      }

      fetch(request).then((response) => {
        cache.put(request, response.clone());
        return response;
      }).catch(() => {
          return caches.match("/offline.html");
      })
    })()
  );
});
