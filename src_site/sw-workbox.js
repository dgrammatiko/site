
import { strategy as composeStrategies } from 'workbox-streams';
import { CacheFirst, StaleWhileRevalidate, } from 'workbox-strategies'
import { precache, getCacheKeyForURL } from 'workbox-precaching';

const cacheName = `dGrammatiko-${VERSION}`;

const shellStrategy = new CacheFirst({ cacheName: cacheName });
const contentStrategy = new StaleWhileRevalidate({ cacheName: cacheName });

// Urls that needs to be cached on installation
const preCached = ['/index-top.html', '/index-bottom.html', '/offline.content.html', '/offline.html', '/_assets/tmpl_starchaser/fonts/dgrammatiko.woff2', '/_assets/tmpl_starchaser/manifest.json', '/_assets/js/toggler.esm.js'];

addEventListener('install', (event) => {
    skipWaiting();

    precache(preCached)
});

addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName_) => {
                if (cacheName !== cacheName_) {
                    return caches.delete(cacheName_);
                }
            })
        );
    })
    );
});

async function streamArticle(event, url) {
    const theUrl = new URL(url);
    theUrl.pathname = /\/index\.html$/.test(theUrl.pathname) ? theUrl.pathname.replace('index.html', 'index.content.html') : `${theUrl.pathname}index.content.html`;

    const response = composeStrategies([
        () => shellStrategy.handle({
            event: event,
            request: new Request(getCacheKeyForURL('/index-top.html')),
        }),
        () => contentStrategy.handle({
            event: event,
            request: new Request(theUrl.pathname),
        }),
        () => shellStrategy.handle({
            event: event,
            request: new Request(getCacheKeyForURL('/index-bottom.html')),
        }),
    ])(event, theUrl);

    caches.open(cacheName).then(
        (cache) => { cache.put(event.request, response) }
    );

    return response
}

addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET') return;

    event.respondWith(async function () {
        // This works only on chromium based UA
        if (typeof WritableStream === 'function') {
            if (url.origin === location.origin && routes.includes(url.pathname)) {
                return streamArticle(event, url);
            }
        }

        // Full page fetch fallback
        const cachedReponse = await caches.match(event.request);
        if (cachedReponse) return cachedReponse;

        return await fetch(event.request).catch(() => caches.match('/offline.html'));
    }());
});
