// Load analytics, ads and widgets after the page has painted, so they don't block rendering.
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', 'G-FYVQB18KQB');
  var done = false;
  function add(src, attrs) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    for (var k in attrs || {}) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }
  function load() {
    if (done) return; done = true;
    add('https://www.googletagmanager.com/gtag/js?id=G-FYVQB18KQB');
    add('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9024176667555201', { crossorigin: 'anonymous' });
  }
  ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (e) {
    addEventListener(e, load, { once: true, passive: true });
  });
  addEventListener('load', function () { setTimeout(load, 3500); });
})();
