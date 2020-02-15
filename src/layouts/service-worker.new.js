const cacheName = `dGrammatiko-${VERSION}`;
//   CACHE_KEYS = {
//   PRE_CACHE: `precache-${VERSION}`,
//   RUNTIME: `runtime-${VERSION}`
// };

// URLS that we don’t want to end up in the cache
const EXCLUDED_URLS = [
  'admin',
  '.netlify',
  'https://identity.netlify.com/v1/netlify-identity-widget.js',
  'https://unpkg.com/netlify-cms@^2.9.3/dist/netlify-cms.js'
];

// URLS that we want to be cached when the worker is installed
const PRE_CACHE_URLS = ['/_assets/tmpl_starchaser/fonts/dgrammatiko.woff2', ...preCached];

// You might want to bypass a certain host
const IGNORED_HOSTS = ['localhost', 'unpkg.com',];

addEventListener('install', event => {
  skipWaiting();

  event.waitUntil(async function () {
    const cache = await caches.open(cacheName);
    await cache.addAll(PRE_CACHE_URLS);
  }());
});

addEventListener('activate', event => {
  event.waitUntil(async function () {
    const keys = await caches.keys();
    await Promise.all(
      keys.map(key => {
        if (key !== cacheName) return caches.delete(key);
      })
    );
  }());
});

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
  const includeUrl = new URL(url);
  includeUrl.pathname += 'index.content.html';

  const parts = [
    caches.match('/index-top.html'),
    fetch(includeUrl).catch(() => caches.match('/offline.content.html')),
    caches.match('/index-bottom.html')
  ];

  const identity = new IdentityStream();

  event.waitUntil(async function () {
    for (const responsePromise of parts) {
      const response = await responsePromise;
      await response.body.pipeTo(identity.writable, { preventClose: true });
    }
    identity.writable.getWriter().close();
  }());

  const cache = await caches.open(cacheName);
  const theStreamedPart = new Response(identity.readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });

  // await cache.put(event.request, theStreamedPart.clone());
  return theStreamedPart;
}

addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' ||
    EXCLUDED_URLS.includes(url)) return;

  event.respondWith(async function () {
    if (url.origin === location.origin && /^\/blog\/$/.test(url.pathname)) {
      return streamArticle(event, url);
    }

    const cachedReponse = await caches.match(event.request);
    if (cachedReponse) return cachedReponse;

    return await fetch(event.request);
  }());
});
