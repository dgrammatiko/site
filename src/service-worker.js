import { precache } from 'workbox-precaching';
import { cacheNames } from 'workbox-core';
import { getCacheKeyForURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { strategy as composeStrategies } from 'workbox-streams';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precache(preCached);

const shellStrategy = new CacheFirst({ cacheName: cacheNames.precache });
const contentStrategy = new CacheFirst({
  // cacheName: 'content',
  cacheName: cacheNames.content,
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
});

const navigationHandler = ({ url }) => {
  let nUrl;
  if (!/\/|\/index.html$/.test(url.href)) {
    return fetch(url);
  }
  if (/\/$/.test(url.href)) {
    nUrl = `${url.href}index.content.html`
  }
  if (/\/index.html$/.test(url.href)) {
    nUrl = `${url.href.replace(/\/index.html$/, '/index.content.html')}index.content.html`
  }
}

composeStrategies([
  () => shellStrategy.handle({
    request: new Request(getCacheKeyForURL('/index-top.html')),
  }),
  ({ nUrl }) => {
    contentStrategy.handle({
      request: new Request(nUrl),
    })
  },
  () => shellStrategy.handle({
    request: new Request(getCacheKeyForURL('/index-bottom.html')),
  }),
]);

registerRoute(({ request }) => request.mode === 'navigate', navigationHandler);
