// Serviceworkers file. This code gets installed in users browsers and runs code before the request is made.
const staticCacheName = `dGrammatiko-${VERSION}`;
const expectedCaches = [
  staticCacheName
];

// Urls that needs to be cached on installation
const preCached =
self.addEventListener('install', event => {
  self.skipWaiting();

  // Populate initial serviceworker cache.
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll([
        '/index-top.html',
        '/index-bottom.html',
        '/offline.content.html',
        '/offline.html',
        // '/manifest.json',
        '/static/fonts/dgrammatiko.woff2',
        // '/static/js/ce-theme-switcher.esm.js',
      ]))
  );
});

// remove caches that aren't in expectedCaches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) return caches.delete(key);
      })
    ))
  );
});

// Create a composed streamed webpage with shell and core content
function createPageStream(request) {
  const stream = new ReadableStream({
    start(controller) {
      Promise.all([caches.match('/index-top.html'), caches.match('/index-bottom.html')])
        .then((cachedShellMatches) => {
          const cachedShellTop = cachedShellMatches[0];
          const cachedShellBottom = cachedShellMatches[1];
          if (!cachedShellTop || !cachedShellBottom) { // return if shell isn't cached.
            return
          }
          // the body url is the request url plus 'include'
          const url = new URL(request.url);
          url.pathname = /\/index\.html$/.test(url.pathname) ? url.pathname.replace(/index.html$/, 'index.content.html') :
          /\/$/.test(url.pathname) ? `${url.pathname}index.content.html` : `${url.pathname}/index.content.html`;
          // const url = new URL(request.url); //.replace('index.html', 'index.content.html')
          const startFetch = Promise.resolve(cachedShellTop);
          const endFetch = Promise.resolve(cachedShellBottom);
          const middleFetch = fetch(url).then(response => {
            if (!response.ok && response.status === 404) {
              return caches.match('/404.html');
            }
            // if (!response.ok && response.status != 404) {
            //   return caches.match('/500.html');
            // }
            return response;
          }).catch(err => caches.match('/offline.html'));

          function pushStream(stream) {
            const reader = stream.getReader();
            return reader.read().then(function process(result) {
              if (result.done) return;
              controller.enqueue(result.value);
              return reader.read().then(process);
            });
          }
          startFetch
            .then(response => pushStream(response.body))
            .then(() => middleFetch)
            .then(response => pushStream(response.body))
            .then(() => endFetch)
            .then(response => pushStream(response.body))
            .then(() => controller.close());
        })

    }
  });

  return new Response(stream, {
    headers: {'Content-Type': 'text/html; charset=utf-8'}
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  url.pathname = /\/index\.html$/.test(url.pathname) ? url.pathname.replace(/index.html$/, 'index.content.html') :
  /\/$/.test(url.pathname) ? `${url.pathname}index.content.html` : `${url.pathname}/index.content.html`;

  // const url = new URL(event.request.url);
  if (/iPhone|CriOS|iPad/i.test(navigator.userAgent) && event.request.referrer.includes('t.co')) {
     // Twitter on iOS seems to cause problems
     return;
  }
  if (url.origin === location.origin) {
    if (event.clientId === "" && // Not fetched via AJAX after page load.
      event.request.method == "GET" && // Don't fetch on POST, DELETE, etc.

      !url.href.includes('.css') && // Don't run on CSS.
      !url.href.includes('.js') && // Don't run on JS.

      caches.match('/shell_top') && // Ensure shell_top is in the cache.
      caches.match('/shell_bottom')) { // Ensure shell_bottom is in the cache.
      event.respondWith(createPageStream(event.request)); // Respond with the stream

      // Ping version endpoint to see if we should fetch new shell.
      // if (!caches.match('/async_info/shell_version')) { // Check if we have a cached shell version
      //   caches.open(staticCacheName)
      //   .then(cache => cache.addAll([
      //     "/async_info/shell_version",
      //   ]));
      //   return;
      // }

      // fetch('/async_info/shell_version').then(response => response.json()).then(json => {
      //   caches.match('/async_info/shell_version').then(cachedResponse => cachedResponse.json()).then(cacheJson => {
      //     if (cacheJson['version'] != json['version']) {
      //       caches.open(staticCacheName)
      //       .then(cache => cache.addAll([
      //         "/shell_top",
      //         "/shell_bottom",
      //         "/async_info/shell_version"
      //       ]));
      //     }
      //   })
      // })
      return;
    }

    // Fetch new shell upon events that signify change in session.
    // if (event.clientId === "" &&
    //   (event.request.referrer.includes('/signout_confirm') || url.href.includes('?signin') || url.href.includes('/onboarding'))) {
    //   caches.open(staticCacheName)
    //   .then(cache => cache.addAll([
    //     "/shell_top",
    //     "/shell_bottom",
    //   ]));
    // }
  }
});
