const CACHENAME = `dGrammatiko-static-${VERSION}`;
const $$ = `addEventListener`;

// Urls that needs to be cached on installation
const preCached = [
  '/static/fonts/dgrammatiko.woff2',
  '/static/fonts/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_LjQbMZhKSbpUVzEEQ.woff',
  '/static/js/ce-theme-switcher.esm.js',
  '/',
  '/index-top.html',
  '/index-bottom.html',
  '/offline.content.html',
  '/offline.html',
];

self[$$]('install', onInstall);
self[$$]('activate', onActivate);
self[$$]('fetch', onFetch);

async function respondHandler(event) {
  const url = new URL(event.request.url);
  if (event.request.mode !== 'navigate' || !(ROUTES.includes(url.pathname) || url.pathname === '/')) return;

  const cache = await caches.open(CACHENAME);
  const cachedResp = await respondFromCache(event, cache);
  if (cachedResp) return cachedResp;

  let failed = false;
  const resp = await fetch(url.toString()).catch(() => {
    failed = true;
    caches.match('/offline.html');
  });

  if (event.request.destination === 'document' && !failed) {
    return cache.put(event.request, resp);
  }

  return resp;
}

async function onActivate(event) {
  event.waitUntil((async _ => {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => { if (CACHENAME !== key) return caches.delete(key); }));
    // await clients.claim();
  })());
}

async function onInstall(event) {
  skipWaiting();

  event.waitUntil(async function () {
    const cache = await caches.open(CACHENAME);
    await cache.addAll(preCached);
    // await cache.addAll([...new Set([...preCached ,...ROUTES])]);
  }());
}

async function onFetch(event) {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    debugger;
    return await respondHandler(event);
  }

  const cache = await caches.open(CACHENAME);
  const cachedResp = await respondFromCache(event, cache);
  if (cachedResp) return cachedResp;

  return await fetch(event.request).catch(() => {
    failed = true;
    caches.match('/offline.html');
  });
}

async function respondFromCache(event, cache) {
  const cachedReponse = await cache.match(event.request);
  if (cachedReponse) return cachedReponse;
}
