const t=`dGrammatiko-${VERSION}`,e=["/index-top.html","/index-bottom.html","/offline.content.html","/offline.html","/manifest.json","/static/fonts/dgrammatiko.woff2","/static/js/toggler.esm.js"];addEventListener("install",n=>{skipWaiting(),n.waitUntil(caches.open(t).then(t=>t.addAll(e)))}),addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(t!==e)return caches.delete(e)}))))});class n{constructor(){let t,e;this.readable=new ReadableStream({start(e){t=e},cancel(t){e.error(t)}}),this.writable=new WritableStream({start(t){e=t},write(e){t.enqueue(e)},close(){t.close()},abort(e){t.error(e)}})}}addEventListener("fetch",e=>{const a=new URL(e.request.url);"GET"===e.request.method&&e.respondWith(async function(){if("function"==typeof WritableStream&&a.origin===location.origin&&routes.includes(a.pathname))return async function(e,a){const c=new URL(a);c.pathname=/\/index\.html$/.test(c.pathname)?c.pathname.replace(/index.html$/,"index.content.html"):/\/$/.test(c.pathname)?`${c.pathname}index.content.html`:`${c.pathname}/index.content.html`;const i=[caches.match("/index-top.html"),fetch(c).catch(()=>caches.match("/offline.content.html")),caches.match("/index-bottom.html")],o=new n;e.waitUntil(async function(){for(const t of i){const e=await t;await e.body.pipeTo(o.writable,{preventClose:!0})}o.writable.getWriter().close()}());const s=await caches.open(t),r=new Response(o.readable,{headers:{"Content-Type":"text/html; charset=UTF-8"}});return await s.put(e.request,r.clone()),r}(e,a);const c=await caches.match(e.request);return c||await fetch(e.request).catch(()=>caches.match("/offline.html"))}())});
