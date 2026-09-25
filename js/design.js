/* =====================================================================
   Design page: one slide per kind of design (title left, grid right)
   + an expanding viewer. Dribbble shots are hotlinked; other work lives in /images/Designportfolio/
   as name.png (the untouched original, "View original" in the viewer), name.webp (90% quality,
   max 2200px wide, what the viewer shows) and name-thumb.webp (90% quality, the grid tile).
   Each section's images load only when that section is opened.
   To add work: add an item to a group below. To add a new kind (brochures...):
   add a group object. `story: true` shows tall 9:16 tiles, four in a row.
   ===================================================================== */
(function () {
    'use strict';
    var U = 'https://cdn.dribbble.com/userupload/';
    var L = '/images/Designportfolio/';

    // item: t = title, img = image, th = thumbnail (local images), s = Dribbble shot id (kept for reference, not linked), r = width/height (default 4/3),
    //       long = a full-page design: the thumbnail is its top section and the viewer scrolls through the page
    var GROUPS = [
        {
            id: 'websites', label: 'Websites', title: 'Company <em>websites.</em>',
            text: 'Websites and pages I have designed for home-service companies, a law firm, online stores, startups and community platforms. Here are some of them; open one to scroll through the whole page.',
            items: [
                { t: 'Larson Air Conditioning website', img: L + 'web/larson-air.webp', th: L + 'web/larson-air-thumb.webp', orig: L + 'web/larson-air.png', r: 0.2178, long: true },
                { t: 'Legacy Roofing website', img: L + 'web/legacy-roofing.webp', th: L + 'web/legacy-roofing-thumb.webp', orig: L + 'web/legacy-roofing.png', r: 0.2396, long: true },
                { t: 'LocalRoofs website', img: L + 'web/localroofs.webp', th: L + 'web/localroofs-thumb.webp', orig: L + 'web/localroofs.png', r: 0.1642, long: true },
                { t: 'Frank\'s Repair Plumbing website', img: L + 'web/franks-plumbing.webp', th: L + 'web/franks-plumbing-thumb.webp', orig: L + 'web/franks-plumbing.png', r: 0.2135, long: true },
                { t: 'TRIO Heating & Air website', img: L + 'web/trio.webp', th: L + 'web/trio-thumb.webp', orig: L + 'web/trio.png', r: 0.2045, long: true },
                { t: 'Ad Leverage agency website', img: L + 'web/ad-leverage.webp', th: L + 'web/ad-leverage-thumb.webp', orig: L + 'web/ad-leverage.png', r: 0.2593, long: true },
                { t: 'Call Jacob law firm: Lakers sponsorship page', img: L + 'web/call-jacob.webp', th: L + 'web/call-jacob-thumb.webp', orig: L + 'web/call-jacob.png', r: 0.2527, long: true },
                { t: 'Sheesham furniture and interiors website', img: L + 'web/sheesham.webp', th: L + 'web/sheesham-thumb.webp', orig: L + 'web/sheesham.png', r: 0.2426, long: true },
                { t: 'Kothari Sons ethnic wear store', img: L + 'web/ethnic-store.webp', th: L + 'web/ethnic-store-thumb.webp', orig: L + 'web/ethnic-store.png', r: 0.2114, long: true },
                { t: 'BlackNorth Connect jobs platform', img: L + 'web/blacknorth-connect.webp', th: L + 'web/blacknorth-connect-thumb.webp', orig: L + 'web/blacknorth-connect.png', r: 0.2103, long: true },
                { t: 'BlackNorth B.E.G.I.N. website', img: L + 'web/blacknorth-begin.webp', th: L + 'web/blacknorth-begin-thumb.webp', orig: L + 'web/blacknorth-begin.png', r: 0.3947, long: true },
                { t: 'futurestore AI tools directory', img: L + 'web/futurestore.webp', th: L + 'web/futurestore-thumb.webp', orig: L + 'web/futurestore.png', r: 0.3071, long: true },
                { t: 'Betting Zone gaming website', img: L + 'web/betting-zone.webp', th: L + 'web/betting-zone-thumb.webp', orig: L + 'web/betting-zone.png', r: 0.4967, long: true }
            ]
        },
        {
            id: 'social', label: 'Social posts & stories', title: 'Social posts <em>&amp; stories.</em>', story: true,
            text: 'Promotional stories for home-service brands: one offer, a bold headline and a call to action that reads at a glance on a phone.',
            items: [
                { t: 'Hansen Super Techs: $50 off story', img: L + 'social/hansen-50-off.webp', th: L + 'social/hansen-50-off-thumb.webp', orig: L + 'social/hansen-50-off.png', r: 0.5581 },
                { t: 'Hansen Super Techs: $50 off plumbing repair story', img: L + 'social/hansen-plumbing-repair.webp', th: L + 'social/hansen-plumbing-repair-thumb.webp', orig: L + 'social/hansen-plumbing-repair.png', r: 0.5622 },
                { t: 'Hansen Super Techs: free surge protector story', img: L + 'social/hansen-surge-protector.webp', th: L + 'social/hansen-surge-protector-thumb.webp', orig: L + 'social/hansen-surge-protector.png', r: 0.5622 },
                { t: 'TRIO: financing special story', img: L + 'social/trio-financing.webp', th: L + 'social/trio-financing-thumb.webp', orig: L + 'social/trio-financing.png', r: 0.5622 },
                { t: 'TRIO: $58 tune-up special story', img: L + 'social/trio-tune-up.webp', th: L + 'social/trio-tune-up-thumb.webp', orig: L + 'social/trio-tune-up.png', r: 0.5628 },
                { t: 'TRIO: $100 off repairs story', img: L + 'social/trio-repairs.webp', th: L + 'social/trio-repairs-thumb.webp', orig: L + 'social/trio-repairs.png', r: 0.5628 }
            ]
        },
        {
            id: 'mobile-apps', label: 'Mobile apps', title: 'Mobile <em>apps.</em>',
            text: 'iOS and Android screens for home care, motor parts, workspaces, fashion and crypto: thumb-friendly layouts and flows that finish in a few taps.',
            items: [
                { t: 'ShiftCare caregiver app', img: L + 'mobile/shift-care.webp', th: L + 'mobile/shift-care-thumb.webp', orig: L + 'mobile/shift-care.png' },
                { t: 'RamroParts motor parts app', img: L + 'mobile/ramro-parts.webp', th: L + 'mobile/ramro-parts-thumb.webp', orig: L + 'mobile/ramro-parts.png' },
                { t: 'Officiti flexible workspace app', img: L + 'mobile/officiti.webp', th: L + 'mobile/officiti-thumb.webp', orig: L + 'mobile/officiti.png' },
                { t: 'Camaieu fashion shopping app', img: L + 'mobile/camaieu.webp', th: L + 'mobile/camaieu-thumb.webp', orig: L + 'mobile/camaieu.png' },
                { t: 'Latido leather jacket store app', img: L + 'mobile/latido.webp', th: L + 'mobile/latido-thumb.webp', orig: L + 'mobile/latido.png' },
                { t: 'Harmony crypto wallet app', img: L + 'mobile/harmony.webp', th: L + 'mobile/harmony-thumb.webp', orig: L + 'mobile/harmony.png' }
            ]
        },
        {
            id: 'dashboards', label: 'Dashboards', title: 'Dashboards <em>&amp; wearables.</em>',
            text: 'Data-heavy screens made scannable: the numbers that matter first, everything else one click or glance away.',
            items: [
                { t: 'Old age homecare dashboard', img: U + '36024287/file/original-a5123dffa508668cc2a30e3457ec9893.png', s: '17754406-Old-Age-Homecare-Service-App-Dashboard' },
                { t: 'Food app dashboard', img: U + '26723366/file/original-388717fd47e8cf879e1dee9986b95adc.png', s: '10981298-Dashboard-for-food-app' },
                { t: 'Music and fitness for Apple Watch', img: U + '27151337/file/original-ec80dfccc30771614a9200408d18a912.jpg', s: '11351359-Music-and-fitness-meter-design-for-apple-watch', r: 1.5 }
            ]
        },
        {
            id: 'unbounce', label: 'Unbounce pages', title: 'Unbounce <em>pages.</em>',
            text: 'Landing pages built in Unbounce for ad campaigns: one offer, a short form and a clear call to action, refined through A/B testing.',
            items: [
                { t: 'LocalRoofs: Danville roof replacement page', img: L + 'unbounce/localroofs-danville.webp', th: L + 'unbounce/localroofs-danville-thumb.webp', orig: L + 'unbounce/localroofs-danville.png', r: 0.166, long: true },
                { t: 'Restorerz: mold remediation page', img: L + 'unbounce/restorerz-mold.webp', th: L + 'unbounce/restorerz-mold-thumb.webp', orig: L + 'unbounce/restorerz-mold.png', r: 0.1927, long: true },
                { t: 'Construction Unlimited: roof rejuvenation offer', img: L + 'unbounce/construction-unlimited.webp', th: L + 'unbounce/construction-unlimited-thumb.webp', orig: L + 'unbounce/construction-unlimited.png', r: 0.2636, long: true },
                { t: 'Sam\'s Air Control: A/C installation page', img: L + 'unbounce/sams-air-control.webp', th: L + 'unbounce/sams-air-control-thumb.webp', orig: L + 'unbounce/sams-air-control.png', r: 0.237, long: true },
                { t: 'Republic Home Services: heating installation page', img: L + 'unbounce/republic-home.webp', th: L + 'unbounce/republic-home-thumb.webp', orig: L + 'unbounce/republic-home.png', r: 0.2228, long: true },
                { t: 'Dean\'s Home Services: permanent exterior lighting', img: L + 'unbounce/deans-lighting.webp', th: L + 'unbounce/deans-lighting-thumb.webp', orig: L + 'unbounce/deans-lighting.png', r: 0.2695, long: true },
                { t: 'Call Jacob: truck accident case review page', img: L + 'unbounce/call-jacob-truck-accident.webp', th: L + 'unbounce/call-jacob-truck-accident-thumb.webp', orig: L + 'unbounce/call-jacob-truck-accident.png', r: 0.1851, long: true },
                { t: 'Call Jacob: dog bite case review page', img: L + 'unbounce/call-jacob-dog-bite.webp', th: L + 'unbounce/call-jacob-dog-bite-thumb.webp', orig: L + 'unbounce/call-jacob-dog-bite.png', r: 0.4325, long: true },
                { t: 'CHUD Cooling & Heating: oldest HVAC system giveaway', img: L + 'unbounce/chud-giveaway.webp', th: L + 'unbounce/chud-giveaway-thumb.webp', orig: L + 'unbounce/chud-giveaway.png', r: 0.4995, long: true }
            ]
        },
        {
            id: 'illustration', label: 'Illustration', title: 'Illustration <em>&amp; art.</em>',
            text: 'Vector portraits, cultural figures and scene recreations, drawn with bold shapes and rich color.',
            items: [
                { t: 'Man staring at a firefly', img: U + '27152231/file/original-cec0d235d636b7eef8de8b9789700b35.png', s: '11351898-INDIAN-MAN-STARING-FIREFLY' },
                { t: 'That Girl', img: U + '26942842/file/original-15c411c74cb6369851a87a7a25a3c7be.png', s: '11144995-That-Girl' },
                { t: 'Meera, after Madhavi Sandur', img: U + '26929995/file/original-af4f79810b82bb4ee907808a900d1f66.png', s: '11135147-Vector-art-of-painting-MEERA-by-Madhavi-Sandur' },
                { t: 'NatGeo animation scene', img: U + '26676887/file/original-e6fea025cd7c1cf2b18b7c97fead9dec.png', s: '10946300-A-recreated-scene-from-natgeo-animation' },
                { t: 'NatGeo scene recreated', img: U + '26676243/file/original-3ae06de155f684fefdc57e5752d20989.png', s: '10945949-a-NATGEO-scene-recreated' },
                { t: 'Kumari, the living goddess', img: U + '26197574/file/original-e3876f366a59c943e38a5b76ac1ded0a.png', s: '10381460-Kumari-The-Living-Goddess' },
                { t: 'Lion King', img: U + '24640930/file/original-e20458859f3b2bcc7bbd89317f44016f.png', s: '7044406-LION-KING' },
                { t: 'Lakhe', img: U + '24571477/file/original-085d818881732ceb85e8aa29f2d9d15f.png', s: '6998295-Lakhe' },
                { t: 'Thor helmet', img: U + '24385970/file/original-00a76a9963cb9b0fba0c4678d5374b92.jpg', s: '6124479-Thor-Helmet' }
            ]
        },
        {
            id: 'games', label: 'Games & stickers', title: 'Games <em>&amp; stickers.</em>',
            text: 'Playful work for kids and chat apps: bright, simple shapes that read at any size.',
            items: [
                { t: 'Kids number system game', img: U + '26676433/file/original-1a5807c1f8a5de15772f9b3cb9e6da35.png', s: '10946046-Educational-kids-Number-system-game' },
                { t: 'Educational kids games', img: U + '26676367/file/original-420b0f916769ca5a78f4aef4458e32c8.png', s: '10946027-Educational-kids-games' },
                { t: 'Telegram sticker set', img: U + '24385997/file/original-c0cfec4ef42ef35c1c85c9e7250edf45.png', s: '6124459-Telegram-Sticker-Design' }
            ]
        }
    ];

    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); };
    // grid: local 90% WebP thumbnail, or Dribbble's lossless 800x600 PNG resize (its WebP is too lossy)
    var src = function (it) { return it.th || it.img + '?resize=800x600&vertical=center'; };
    var big = function (it) { return it.img; };                  // viewer
    var orig = function (it) { return it.orig || it.img; };      // "View original": the untouched file
    var ratio = function (it) { return it.r || 4 / 3; };
    var pad = function (n) { return String(n).padStart(2, '0'); };

    var host = document.getElementById('dz-groups');
    if (!host) return;
    var root = document.documentElement;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var total = GROUPS.reduce(function (n, g) { return n + g.items.length; }, 0);

    // ---------------- hero index + counts ----------------
    var idx = document.getElementById('dz-index');
    if (idx) idx.innerHTML = GROUPS.map(function (g, gi) {
        return '<li><a href="#' + g.id + '" class="dz-idx"><span class="sx-num">' + pad(gi + 1) + '</span><span class="dz-idx__name">' + esc(g.label) + '</span><span class="dz-idx__n">' + g.items.length + '</span><span class="dz-idx__arr" aria-hidden="true">↓</span></a></li>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('[data-dz-total]'), function (el) { el.textContent = total; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-dz-kinds]'), function (el) { el.textContent = GROUPS.length; });

    // ---------------- one section per group, alternating backgrounds ----------------
    var html = GROUPS.map(function (g, gi) {
        var tiles = g.items.map(function (it, ii) {
            return '<figure class="dz-tile"><button type="button" class="dz-btn' + (g.story ? ' dz-btn--story' : '') + '" data-g="' + gi + '" data-i="' + ii + '" aria-label="Open design: ' + esc(it.t) + '">' +
                '<img data-src="' + src(it) + '" alt="' + esc(it.t) + '" width="' + (g.story ? 480 : 400) + '" height="' + (g.story ? 853 : 300) + '" loading="lazy" decoding="async">' +
                '<span class="dz-cap">' + esc(it.t) + '<span aria-hidden="true">↗</span></span></button></figure>';
        }).join('');
        return '<section id="' + g.id + '" class="sx ' + (gi % 2 ? 'sx-light' : 'sx-cream') + ' dz-sec dz-tint-' + (gi % 7) + ' px-6" data-label="' + esc(g.label) + '">' +
            '<div class="max-w-7xl mx-auto dz-row">' +
                '<div class="dz-side"><div class="dz-side__in">' +
                    '<p class="sx-label">' + pad(gi + 1) + ' / ' + pad(GROUPS.length) + ' &nbsp;·&nbsp; ' + g.items.length + ' ' + (g.items.length === 1 ? 'design' : 'designs') + '</p>' +
                    '<h2 class="dz-title">' + g.title + '</h2>' +
                    '<p class="sx-lead dz-text">' + esc(g.text) + '</p>' +
                '</div></div>' +
                '<div class="dz-grid' + (g.story ? ' dz-grid--story' : g.items.length === 4 ? ' dz-grid--two' : '') + '">' + tiles + '</div>' +
            '</div></section>';
    }).join('');
    host.insertAdjacentHTML('beforebegin', html);
    host.remove();

    Array.prototype.forEach.call(document.querySelectorAll('.dz-btn img'), function (im) {
        var on = function () { im.classList.add('on'); };
        im.addEventListener('load', on); im.addEventListener('error', on);
    });

    // ---------------- load a section's images only when it is opened ----------------
    // The pager stacks every section in the same screen area, so the browser's own lazy loading would
    // fetch all of them at once. Tiles load when their section becomes the active slide (plus the next
    // one, ready for the scroll), or, without the pager (phones), as the section nears the viewport.
    var secs = Array.prototype.slice.call(document.querySelectorAll('.dz-sec'));
    var pagerOn = function () { return root.classList.contains('pager-on'); };
    function loadSec(sec) {
        if (!sec || sec.dataset.loaded) return;
        sec.dataset.loaded = '1';
        Array.prototype.forEach.call(sec.querySelectorAll('img[data-src]'), function (im) { im.src = im.dataset.src; im.removeAttribute('data-src'); });
    }
    function loadNear() {
        if (pagerOn()) { secs.forEach(function (s, i) { if (s.classList.contains('pg-active')) { loadSec(s); loadSec(secs[i + 1]); } }); return; }
        secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top < innerHeight + 600 && r.bottom > -600) loadSec(s); });
    }
    var watch = new MutationObserver(loadNear);                     // the pager marks the open slide with .pg-active
    secs.forEach(function (s) { watch.observe(s, { attributes: true, attributeFilter: ['class'] }); });
    window.addEventListener('scroll', function () { if (!pagerOn()) loadNear(); }, { passive: true });
    window.addEventListener('resize', loadNear);
    window.addEventListener('load', function () { loadNear(); loadSec(secs[0]); });   // first section, ready for the first scroll

    // ---------------- viewer (styles shared with the Photos page) ----------------
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Design viewer');
    lb.innerHTML =
        '<div class="lb__bg"></div>' +
        '<div class="lb__top"><span class="lb__count"></span><button type="button" class="lb__btn lb__close" aria-label="Close viewer">✕</button></div>' +
        '<figure class="lb__stage"><img class="lb__img" alt=""></figure>' +
        '<button type="button" class="lb__btn lb__nav lb__prev" aria-label="Previous design">←</button>' +
        '<button type="button" class="lb__btn lb__nav lb__next" aria-label="Next design">→</button>' +
        '<div class="lb__bar"><div><p class="lb__title"></p><p class="lb__by"></p></div><div class="lb__links"><a class="lb__link lb__orig" target="_blank" rel="noopener">View original ↗</a></div></div>';
    document.body.appendChild(lb);
    var q = function (s) { return lb.querySelector(s); };
    var stage = q('.lb__stage'), img = q('.lb__img'), count = q('.lb__count'), title = q('.lb__title'), by = q('.lb__by'), origLink = q('.lb__orig'), closeBtn = q('.lb__close');
    var curG = -1, curI = -1, busy = false, dur = reduce ? 0 : 520;

    var btnOf = function (g, i) { return document.querySelector('.dz-btn[data-g="' + g + '"][data-i="' + i + '"]'); };
    var isLong = function () { return curG > -1 && !!GROUPS[curG].items[curI].long; };
    function fit(it) {
        var r = stage.getBoundingClientRect();
        var w = it.long ? Math.min(r.width, 1100) : Math.min(r.width, r.height * ratio(it));   // full pages: readable width, scroll down
        return { w: Math.round(w), h: Math.round(w / ratio(it)) };
    }
    function size() { var f = fit(GROUPS[curG].items[curI]); img.style.width = f.w + 'px'; img.style.height = f.h + 'px'; }
    function show(g, i, thumbSrc) {
        var grp = GROUPS[g], it = grp.items[i]; curG = g; curI = i;
        stage.classList.toggle('is-scroll', !!it.long);
        stage.scrollTop = 0;
        size();
        img.alt = it.t;
        if (it.long) {                                  // the thumbnail is only the top of the page: show it there while the page loads
            img.removeAttribute('src');
            img.style.background = 'url("' + it.th + '") top / 100% auto no-repeat #1c1c1c';
            img.src = big(it);
        } else {
            img.style.background = '';
            img.src = thumbSrc || src(it);
            var hi = new Image();
            hi.onload = function () { if (curG === g && curI === i) img.src = hi.src; };
            hi.src = big(it);
        }
        count.textContent = grp.label + '  ·  ' + pad(i + 1) + ' / ' + pad(grp.items.length);
        title.textContent = it.t;
        by.textContent = grp.label + ' by Saagar Shrestha' + (it.long ? '  ·  Scroll to see the whole page' : '');
        origLink.href = orig(it);
        [i - 1, i + 1].forEach(function (n) { if (grp.items[n]) { var pre = new Image(); pre.src = big(grp.items[n]); } });
    }
    function morph(fromRect, ease) {
        var to = img.getBoundingClientRect();
        if (isLong()) {                                 // grow from the thumbnail, which matches the top of the page (origin: top left)
            return { ease: ease, t: 'translate(' + (fromRect.left - to.left) + 'px,' + (fromRect.top - to.top) + 'px) scale(' + (fromRect.width / to.width) + ')' };
        }
        var dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2), dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
        return { ease: ease, t: 'translate(' + dx + 'px,' + dy + 'px) scale(' + (fromRect.width / to.width) + ',' + (fromRect.height / to.height) + ')' };
    }
    function open(g, i) {
        if (busy) return;
        var b = btnOf(g, i), t = b.querySelector('img'), rect = t.getBoundingClientRect();
        busy = true; lb.hidden = false; root.classList.add('lb-open');
        show(g, i, t.currentSrc || t.src);
        var m = morph(rect);
        img.style.transition = 'none'; img.style.transform = m.t; img.style.opacity = '1';
        img.getBoundingClientRect();
        requestAnimationFrame(function () {
            lb.classList.add('open');
            img.style.transition = 'transform ' + dur + 'ms cubic-bezier(.16,1,.3,1)';
            img.style.transform = 'none';
            setTimeout(function () { busy = false; closeBtn.focus({ preventScroll: true }); }, dur);
        });
    }
    function close() {
        if (busy || lb.hidden) return;
        busy = true; lb.classList.remove('open');
        var b = btnOf(curG, curI), r = b && b.getBoundingClientRect();
        var vis = r && r.bottom > 0 && r.top < window.innerHeight && !(isLong() && stage.scrollTop > 0);   // scrolled pages fade out instead
        var done = function () {
            lb.hidden = true; root.classList.remove('lb-open'); img.style.transform = 'none'; img.style.opacity = '1'; busy = false;
            if (b) b.focus({ preventScroll: true });
        };
        if (vis && !reduce) {
            img.style.transition = 'transform ' + dur + 'ms cubic-bezier(.65,0,.35,1)';
            img.style.transform = morph(r).t;
            setTimeout(done, dur);
        } else { img.style.transition = 'opacity .3s ease'; img.style.opacity = '0'; setTimeout(done, 320); }
    }
    function step(d) {
        var n = curI + d;
        if (busy || n < 0 || n >= GROUPS[curG].items.length) return;
        busy = true;
        img.style.transition = 'opacity .18s ease'; img.style.opacity = '0';
        setTimeout(function () {
            show(curG, n);
            var b = btnOf(curG, n); if (b) b.scrollIntoView({ block: 'nearest' });
            img.style.opacity = '1'; busy = false;
        }, 190);
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.dz-btn'); if (b) open(+b.dataset.g, +b.dataset.i);
    });
    closeBtn.addEventListener('click', close);
    q('.lb__bg').addEventListener('click', close);
    stage.addEventListener('click', function (e) { if (e.target === stage) close(); });
    q('.lb__prev').addEventListener('click', function () { step(-1); });
    q('.lb__next').addEventListener('click', function () { step(1); });
    document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        else if (isLong() && /^(ArrowDown|ArrowUp|PageDown|PageUp| |Home|End)$/.test(e.key)) {
            e.preventDefault();
            var page = stage.clientHeight * 0.85, dy = { ArrowDown: 80, ArrowUp: -80, PageDown: page, PageUp: -page, ' ': e.shiftKey ? -page : page }[e.key];
            if (e.key === 'Home') stage.scrollTo({ top: 0, behavior: 'smooth' });
            else if (e.key === 'End') stage.scrollTo({ top: stage.scrollHeight, behavior: 'smooth' });
            else stage.scrollBy({ top: dy, behavior: 'smooth' });
        }
        else if (e.key === 'Tab') {
            var f = Array.prototype.filter.call(lb.querySelectorAll('button, a[href]'), function (el) { return !el.hidden; });
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    lb.addEventListener('wheel', function (e) {
        if (isLong() && stage.contains(e.target)) return;          // let full pages scroll
        e.preventDefault();
        if (isLong()) stage.scrollTop += e.deltaY;                   // wheel over the dark area still scrolls the page
    }, { passive: false });
    var tx = 0, ty = 0;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
        var d = e.changedTouches[0].clientX - tx, v = e.changedTouches[0].clientY - ty;
        if (Math.abs(d) > 50 && Math.abs(d) > Math.abs(v) * 1.5) step(d < 0 ? 1 : -1);   // sideways swipe only, so scrolling a page doesn't switch
    }, { passive: true });
    window.addEventListener('resize', function () { if (!lb.hidden && curG > -1) size(); });
})();
