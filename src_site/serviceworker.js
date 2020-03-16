// @TODO add WritableStream support for FF and Safari
// import "@stardazed/streams-polyfill";
// import { createAdaptedFetch, createAdaptedResponse } from "@stardazed/streams-fetch-adapter/dist/";
// import 'web-streams-polyfill/dist/polyfill.es2018';
// import { ReadableStream, WritableStream } from "@stardazed/streams/dist/sd-streams.esm";


const cacheName = `dGrammatiko-${VERSION}`;

// Urls that needs to be cached on installation
const preCached = ['/index-top.html', '/index-bottom.html', '/offline.content.html', '/offline.html', '/manifest.json', '/static/fonts/dgrammatiko.woff2', '/static/js/toggler.esm.js'];

addEventListener('install', (event) => {
    skipWaiting();
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(preCached);
            })
    );
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
    debugger
    const theUrl = new URL(url);
    theUrl.pathname = /\/index\.html$/.test(theUrl.pathname) ? theUrl.pathname.replace(/index.html$/, 'index.content.html') :
    /\/$/.test(theUrl.pathname) ? `${theUrl.pathname}index.content.html` : `${theUrl.pathname}/index.content.html`;

    const parts = [
        caches.match('/index-top.html'),
        fetch(theUrl).catch(() => caches.match('/offline.content.html')),
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
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
    });

    await cache.put(event.request, theStreamedPart.clone());
    return theStreamedPart;
}

addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET') return;

    event.respondWith(async function () {
        // This works only on chromium based UA
        if (url.origin === location.origin && routes.includes(url.pathname) && typeof WritableStream === 'function') {
            return streamArticle(event, url);
        }

        // Full page fetch fallback
        const cachedReponse = await caches.match(event.request);
        if (cachedReponse) return cachedReponse;

        return await fetch(event.request).catch(() => caches.match('/offline.html'));
    }());
});
