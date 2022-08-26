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

  url.pathname = /\/index\.html$/.test(url.pathname) ? url.pathname.replace(/index\.html$/, 'index.content.html')
    : /\/$/.test(url.pathname) ? `${url.pathname}index.content.html` : `${url.pathname}/index.content.html`;
  let offline = false, writable;
  const top = await caches.match('/index-top.html');
  const bottom = await caches.match('/index-bottom.html');
  const middle = await fetch(url.toString()).catch(() => caches.match('/offline.html'));

  // if (typeof TransformStream === 'function') {
  //   writable = (new TransformStream()).writable;

  //   [top.body, middle.body, bottom.body].reduce(
  //     (a, res, i, arr) => a.then(() => res.pipeTo(writable, {preventClose: (i+1) > arr.length})),
  //     Promise.resolve()
  //   );
  // } else {
    resp = `${await top.text()}${await middle.text()}${await bottom.text()}`
  // }

  if (event.request.destination === 'document' && !offline) {
    return cache.put(event.request, new Response(writable));
  } else {
    return new Response(resp);
  }

  // event.waitUntil();
  // else {
  //   let resp, notOffline = false;
  //   try {
  //     resp = await fetch(request, {redirect: 'follow'});
  //     notOffline = true;
  //   } catch (err) {
  //     resp = await caches.match('/offline.html');
  //   }

  //   if (event.request.destination === 'document' && notOffline) {
  //     cache.put(event.request, resp);
  //     return resp.clone();
  //   } else {
  //     return resp;
  //   }
  // }
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

  if (event.request.mode !== 'navigate') {
    const cache = await caches.open(CACHENAME);
    const cachedResp = await respondFromCache(event, cache);
    if (cachedResp) return cachedResp;

    let resp;
    try {
      resp = await fetch(event.request)
    } catch (err) {
      // event.respondWith(fetch(event.request));
    }

    // if (resp) cache.put(event.request, resp.clone());
    return resp;
  } else {
    debugger;
    // event.waitUntil((async (event) => {
      return await respondHandler(event);
    // })());
    // return await respondHandler(event);
  }
}


async function respondFromCache(event, cache) {
  const cachedReponse = await cache.match(event.request);
  if (cachedReponse) return cachedReponse;
}
