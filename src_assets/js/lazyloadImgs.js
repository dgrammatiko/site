var testWebP = function () {
  var canvas = typeof document === 'object' ? document.createElement('canvas') : {};
  canvas.width = canvas.height = 1;
  return canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;
}

var swapAttr = function (img) {
  var src = img.getAttribute('data-src');
  var srcset = img.getAttribute('data-srcset');

  if (srcset) {
    img.setAttribute('srcset', window.supportsWebp ? srcset.replace(new RegExp('jpeg', 'g'), 'webp').replace(new RegExp('jpg', 'g'), 'webp').replace(new RegExp('png', 'g'), 'webp') : srcset);
  } else {
    img.src = window.supportsWebp ? src.replace(new RegExp('jpeg', 'g'), 'webp').replace(new RegExp('jpg', 'g'), 'webp').replace(new RegExp('png', 'g'), 'webp') : src;
  }
};

var onPolyfillReady = function () {
  var images = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  if (!images.length) return;
  images.forEach(lazyload);
};

var lazyload = function (element) {
  var io = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        swapAttr(entry.target)
        observer.disconnect();
      }
    });
  });

  io.observe(element)
};

document.addEventListener('DOMContentLoaded', function () {
  window.supportsWebp = testWebP();
  var images = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  if (!images.length) return;
  if ('loading' in HTMLImageElement.prototype) {
    images.forEach(swapAttr);
  } else {
    if (!'IntersectionObserver' in window &&
      !'IntersectionObserverEntry' in window &&
      !'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
      // load polyfill now
      document.addEventListener('intersection-observer-loaded', onPolyfillReady)
      var script = document.createElement('script');
      script.src = '/_assets/js/io-polyfill.js';
      document.head.appendChild(script);
    } else {
      images.forEach(lazyload);
    }
  }
});
