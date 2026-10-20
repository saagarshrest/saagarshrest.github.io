/* =====================================================================
   Shared scroll experience: section-by-section pager (desktop)
   - Every top-level <section> / <footer> becomes one slide.
   - Tall slides scroll inside themselves, then move to the next slide.
   - Below 1024px, or with reduced motion, pages scroll normally.
   Opt out on a page with <body data-no-pager>.
   ===================================================================== */
(function () {
    'use strict';
    var root = document.documentElement;
    var nav = document.querySelector('body > nav');

    // keep the nav height available to CSS (sticky offsets, anchors)
    function setNavH() { if (nav) root.style.setProperty('--nav-h', nav.offsetHeight + 'px'); }
    setNavH();
    window.addEventListener('resize', setNavH);

    // ---- transparent nav: adapt text color and fade to whatever is behind it ----
    (function () {
        var navEl = document.querySelector('body > nav.site-nav');
        if (!navEl) return;
        var lastRun = 0, timer = 0;
        function bgAt(x, y) {
            var els = document.elementsFromPoint(x, y);
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                if (navEl.contains(el) || el.id === 'pg-dots' || (el.closest && el.closest('#pg-dots'))) continue;
                var tag = el.tagName;
                var explicit = el.closest && el.closest('[data-nav]');
                if (explicit) return explicit.getAttribute('data-nav') === 'dark' ? [10, 10, 10, 1] : [255, 255, 255, 1];
                if (el.id === 'pager') { var act = document.querySelector('.pg-sec.pg-active'); if (act) { var ac = getComputedStyle(act).backgroundColor.match(/[0-9.]+/g); if (ac && (ac.length < 4 || parseFloat(ac[3]) > 0.5)) return [+ac[0], +ac[1], +ac[2], 1]; } }
                if (tag === 'IMG' || tag === 'VIDEO') continue;
                for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
                    var c = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
                    if (c) { var a = c.length > 3 ? parseFloat(c[3]) : 1; if (a > 0.5) return [+c[0], +c[1], +c[2], a]; }
                }
                return [255, 255, 255, 1];
            }
            return [255, 255, 255, 1];
        }
        function update() {
            var y = Math.max(2, navEl.offsetHeight / 2), w = window.innerWidth;
            var pts = [bgAt(w * 0.12, y), bgAt(w * 0.5, y), bgAt(w * 0.88, y)];
            var lum = 0, r = 0, g = 0, b = 0;
            pts.forEach(function (p) { lum += (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255; r += p[0]; g += p[1]; b += p[2]; });
            lum /= pts.length;
            navEl.classList.toggle('on-dark', lum < 0.45);
            navEl.style.setProperty('--nav-bg', 'rgba(' + Math.round(r / 3) + ',' + Math.round(g / 3) + ',' + Math.round(b / 3) + ',.94)');
        }
        function req() {
            var now = Date.now();
            if (now - lastRun > 60) { lastRun = now; update(); }
            else if (!timer) { timer = setTimeout(function () { timer = 0; lastRun = Date.now(); update(); }, 70); }
        }
        window.addEventListener('scroll', req, { passive: true, capture: true });
        window.addEventListener('resize', req);
        window.addEventListener('load', req);
        document.addEventListener('transitionend', req, true);
        setInterval(req, 400);   // catches slide changes and animated sections
        req();
    })();

    var secs = Array.prototype.slice.call(document.querySelectorAll('body section, body footer'))
        .filter(function (el) { return !el.parentElement.closest('section, footer'); });
    if (!nav || secs.length < 2 || document.body.hasAttribute('data-no-pager')) return;
    nav.id = 'pg-nav';
    root.classList.add('pg-ready');

    // ---- build the stage ----
    var stage = document.createElement('div');
    stage.id = 'pager';
    var oldParents = secs.map(function (s) { return s.parentElement; });
    secs[0].before(stage);
    secs.forEach(function (sec) {
        var inner = document.createElement('div');
        inner.className = 'pg-in';
        while (sec.firstChild) inner.appendChild(sec.firstChild);
        if (sec.classList.contains('ds-sec')) {            // give unwrapped sections a container
            var w = document.createElement('div'); w.className = 'pg-wrap';
            while (inner.firstChild) w.appendChild(inner.firstChild);
            inner.appendChild(w);
        }
        sec.appendChild(inner);
        sec.classList.add('pg-sec');
        var container = inner.querySelector(':scope > *:not(script)');
        if (container) Array.prototype.forEach.call(container.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 6)); });
        stage.appendChild(sec);
    });
    // hide wrappers that were emptied by moving their sections
    oldParents.forEach(function (p) {
        var el = p;
        while (el && el !== document.body) {
            if (!el.contains(stage) && !el.querySelector('.pg-sec')) el.classList.add('pg-leftover');
            el = el.parentElement;
        }
    });

    // ---- dots ----
    var dots = document.createElement('div');
    dots.id = 'pg-dots';
    dots.setAttribute('aria-label', 'Sections');
    var buttons = secs.map(function (sec, i) {
        var h = sec.querySelector('h1, h2');
        var label = sec.dataset.label || (h ? h.textContent.trim().replace(/\s+/g, ' ').slice(0, 32) : (sec.tagName === 'FOOTER' ? 'Contact' : 'Section ' + (i + 1)));
        var b = document.createElement('button');
        b.type = 'button'; b.dataset.label = label; b.setAttribute('aria-label', 'Go to ' + label);
        b.addEventListener('click', function () { go(i); });
        dots.appendChild(b);
        return b;
    });
    document.body.appendChild(dots);

    var cur = 0, locked = false, lastWheel = 0, gestureAtEdge = false, gestureMoved = false;
    var mq = window.matchMedia('(min-width: 1024px)');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var enabled = function () { return mq.matches && !reduce.matches; };
    var menuOpen = function () { var m = document.getElementById('mobile-menu'); return m && !m.classList.contains('translate-x-full'); };

    function isDark(sec) {
        var c = getComputedStyle(sec).backgroundColor.match(/[\d.]+/g);
        if (!c) return false;
        var a = c.length > 3 ? parseFloat(c[3]) : 1;
        if (a < 0.5) return false;
        return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255 < 0.4;
    }
    function render() {
        secs.forEach(function (s, i) { s.classList.toggle('pg-active', i === cur); s.classList.toggle('pg-past', i < cur); });
        buttons.forEach(function (b, i) { b.classList.toggle('on', i === cur); });
        dots.classList.toggle('dark', isDark(secs[cur]));
    }
    function go(i, fromEnd, then) {
        if (i < 0 || i >= secs.length || locked) return;
        var target = secs[i];
        if (i !== cur) {
            target.scrollTop = fromEnd ? target.scrollHeight : 0;
            cur = i; locked = true; render();
            setTimeout(function () { locked = false; if (then) then(); }, 950);
        } else if (then) then();
    }
    var st = function () {
        var s = secs[cur];
        return { s: s, atTop: s.scrollTop <= 1, atBottom: s.scrollTop + s.clientHeight >= s.scrollHeight - 1 };
    };

    function onWheel(e) {
        if (!enabled() || root.classList.contains("lb-open") || e.ctrlKey || menuOpen()) return;
        var now = performance.now();
        var newGesture = now - lastWheel > 130;
        lastWheel = now;
        var dir = Math.sign(e.deltaY);
        if (!dir) return;
        if (newGesture) gestureMoved = false;
        // the rest of a gesture that already changed slides (trackpad momentum) must not scroll
        // the new slide, or it opens part-way down and the next flick skips past it
        if (locked || gestureMoved) { e.preventDefault(); return; }
        var s = st();
        var atEdge = dir > 0 ? s.atBottom : s.atTop;
        if (newGesture) gestureAtEdge = atEdge;
        if (!atEdge) return;
        e.preventDefault();
        if (gestureAtEdge && Math.abs(e.deltaY) > 3) { gestureMoved = true; go(cur + dir, dir < 0); }
    }
    function onKey(e) {
        if (!enabled() || root.classList.contains("lb-open") || /input|textarea|select/i.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;
        var dir = 0;
        if (['ArrowDown', 'PageDown'].indexOf(e.key) > -1 || (e.key === ' ' && !e.shiftKey)) dir = 1;
        else if (['ArrowUp', 'PageUp'].indexOf(e.key) > -1 || (e.key === ' ' && e.shiftKey)) dir = -1;
        else if (e.key === 'Home') { e.preventDefault(); return go(0); }
        else if (e.key === 'End') { e.preventDefault(); return go(secs.length - 1); }
        else return;
        e.preventDefault();
        var s = st();
        if (dir > 0 && !s.atBottom) s.s.scrollBy({ top: s.s.clientHeight * 0.8, behavior: 'smooth' });
        else if (dir < 0 && !s.atTop) s.s.scrollBy({ top: -s.s.clientHeight * 0.8, behavior: 'smooth' });
        else go(cur + dir, dir < 0);
    }
    var ty = 0, tEdge = { top: false, bottom: false };
    function onTouchStart(e) { var s = st(); ty = e.touches[0].clientY; tEdge = { top: s.atTop, bottom: s.atBottom }; }
    function onTouchEnd(e) {
        if (!enabled() || root.classList.contains("lb-open")) return;
        var dy = ty - e.changedTouches[0].clientY;
        if (Math.abs(dy) < 60) return;
        var s = st();
        if (dy > 0 && tEdge.bottom && s.atBottom) go(cur + 1);
        else if (dy < 0 && tEdge.top && s.atTop) go(cur - 1, true);
    }

    // in-page links (#section) jump to the right slide, then scroll inside it
    function jumpTo(id, smooth) {
        var el = document.getElementById(id);
        if (!el) return false;
        var sec = el.closest('.pg-sec');
        if (!sec) return false;
        var i = secs.indexOf(sec);
        var scrollInside = function () {
            var top = 0, n = el;
            while (n && n !== sec) { top += n.offsetTop; n = n.offsetParent; }
            sec.scrollTo({ top: Math.max(0, top - 24), behavior: smooth ? 'smooth' : 'auto' });
        };
        if (i === cur) scrollInside(); else go(i, false, scrollInside);
        return true;
    }
    document.addEventListener('click', function (e) {
        if (!enabled()) return;
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href').length < 2) return;
        if (jumpTo(a.getAttribute('href').slice(1), true)) e.preventDefault();
    });

    function apply() { root.classList.toggle('pager-on', enabled()); setNavH(); }
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', apply);
    if (mq.addEventListener) mq.addEventListener('change', apply);

    window.pgGoTo = function (i) { go(i); };
    var top = document.getElementById('back-to-top');
    if (top) top.addEventListener('click', function () { if (enabled()) go(0); });

    apply(); render();
    if (location.hash.length > 1) setTimeout(function () { if (enabled()) jumpTo(location.hash.slice(1), false); }, 60);
})();
