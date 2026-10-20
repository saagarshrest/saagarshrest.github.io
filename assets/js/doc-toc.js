/* Document pages: build the contents list from the headings and mark the active one.
   Works with the .art prose column (legal pages) or with .doc-h2 section
   headings (archive). */
(function () {
    'use strict';
    var nav = document.querySelector('[data-doc-toc]');
    if (!nav) return;

    var art = document.querySelector('.art');
    var heads = art
        ? Array.prototype.slice.call(art.querySelectorAll('h2'))
        : Array.prototype.slice.call(document.querySelectorAll('.doc-h2'));
    if (!heads.length) return;

    var html = '';
    heads.forEach(function (h, i) {
        if (!h.id) h.id = 'section-' + (i + 1);
        html += '<a href="#' + h.id + '">' + h.textContent.trim().replace(/[:.]\s*$/, '') + '</a>';
    });
    nav.innerHTML = html;
    nav.classList.add('has');

    var links = nav.querySelectorAll('a');

    function spy() {
        var y = window.scrollY + (window.innerHeight * 0.28), active = -1;
        heads.forEach(function (h, i) { if (h.getBoundingClientRect().top + window.scrollY <= y) active = i; });
        links.forEach(function (a, i) { a.classList.toggle('on', i === active); });
    }
    var t = null;
    window.addEventListener('scroll', function () {
        if (t) return;
        t = setTimeout(function () { t = null; spy(); }, 120);
    }, { passive: true });
    spy();
})();
