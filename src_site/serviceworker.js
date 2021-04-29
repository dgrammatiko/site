const CACHENAME = `dGrammatiko-${VERSION}`;

// Urls that needs to be cached on installation
const preCached = [
  "/",
  "/index-top.html",
  "/index-bottom.html",
  "/offline.content.html",
  "/offline.html",
  "/manifest.json",
  "/static/fonts/dgrammatiko.woff2",
  "/static/fonts/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_LjQbMZhKSbpUVzEEQ.woff",
  "/static/js/ce-theme-switcher.esm.js",
];

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil((async function () {
    await clients.claim();
    const cacheNames = await caches.keys()


    await Promise.all(
      cacheNames.filter((key) => {
        const deleteThisCache = CACHENAME !== key

        return deleteThisCache
      }).map(oldCache => caches.delete(oldCache))
    );

    const cache = await caches.open(CACHENAME);
    preCached.filter((key) => !(key in cache)).map(async (non) =>  cache.put(non, await fetch(non)) )
  })())
});

self.onfetch = async (event) => {
  const { request } = event;
  // Prevent Chrome Developer Tools error:
  // Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': 'only-if-cached' can be set only with 'same-origin' mode
  //
  // See also https://stackoverflow.com/a/49719964/1217468
  //(request.cache === 'only-if-cached' && request.mode !== 'same-origin')
  if (request.method !== "GET") {
    return;
  }

  if (request.mode !== "navigate") {
    event.respondWith((async function() {
      const cache = await caches.open(CACHENAME);
      const cachedReponse = await cache.match(request);
      if (cachedReponse) {
        return cachedReponse;
      }

      let resp;
      try {
        resp = await fetch(request)
      } catch (err) {
        return resp;
      }

      if (resp) {
        cache.put(request, resp.clone());
      }
      return resp;
    })())
    return;
  }

  event.respondWith((async function(event) {
    const url = new URL(request.url);

    const cache = await caches.open(CACHENAME);
    const cachedReponse = await cache.match(request);
    if (cachedReponse) {
      return cachedReponse;
    }

    if (url.pathname in routes || url.pathname === '/') {
      if (/\/index\.html$/.test(url.pathname)) {
        url.pathname = url.pathname.replace(/index\.html$/, "index.content.html")
      } else {
        url.pathname = /\/$/.test(url.pathname) ? `${url.pathname}index.content.html` : `${url.pathname}/index.content.html`;
      }


      event.waitUntil(async function(event) {
        const storeToCache = true;
        let responseF;
        let resp;
        let contentTmp;
        const top = await (await caches.match("/index-top.html")).body;
        const bottom = await (await caches.match("/index-bottom.html")).body;
        try {
          contentTmp = await fetch(url, {redirect: 'follow'});
        } catch (err) {
          return new Response(await caches.match("/offline.content.html"), {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        }

        const content = await contentTmp.body;
        if (typeof TransformStream === 'function') {
          let {writable} = new TransformStream

          resp = [top, content, bottom].reduce(
            (a, res, i, arr) => a.then(() => res.pipeTo(writable, {preventClose: (i+1) !== arr.length})),
            Promise.resolve()
          )
        } else {
          resp = `${top.text()}${content.text()}${bottom.text()}`
        }

        responseF = new Response(resp, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });

        return cache.put(event.request, responseF);
      }(event));
    } else {
      let resp;
      let cacheIt = false;
      try {
        resp = await fetch(request, {redirect: 'follow'});
        cacheIt = true
      } catch (err) {
        resp = await caches.match("/offline.html");
      }

      if (resp && cacheIt) {
        cache.put(request, resp.clone());
      }
      return resp;
    }
  })(event));
};
