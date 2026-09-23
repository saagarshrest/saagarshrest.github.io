/* =====================================================================
   Design page: one slide per kind of design (title left, grid right)
   + an expanding viewer. Dribbble shots are hotlinked; other work lives in
   /images/Designportfolio/ (a full image plus a smaller -thumb for the grid).
   To add work: add an item to a group below. To add a new kind (brochures...):
   add a group object. `story: true` shows tall 9:16 tiles, four in a row.
   ===================================================================== */
(function () {
    'use strict';
    var PROFILE = 'https://dribbble.com/saagarshrest';
    var U = 'https://cdn.dribbble.com/userupload/';
    var L = '/images/Designportfolio/';

    // item: t = title, img = image, th = thumbnail (local images), s = Dribbble shot path, r = width/height (default 4/3),
    //       long = a full-page design: the thumbnail is its top section and the viewer scrolls through the page
    var GROUPS = [
        {
            id: 'websites', label: 'Websites', title: 'Company <em>websites.</em>',
            text: 'Websites and pages I have designed for home-service companies, a law firm, online stores, startups and community platforms. Here are some of them; open one to scroll through the whole page.',
            items: [
                { t: 'Larson Air Conditioning website', img: L + 'web/larson-air.jpg', th: L + 'web/larson-air-thumb.jpg', r: 0.2178, long: true },
                { t: 'Legacy Roofing website', img: L + 'web/legacy-roofing.jpg', th: L + 'web/legacy-roofing-thumb.jpg', r: 0.2396, long: true },
                { t: 'LocalRoofs website', img: L + 'web/localroofs.jpg', th: L + 'web/localroofs-thumb.jpg', r: 0.1642, long: true },
                { t: 'Frank\'s Repair Plumbing website', img: L + 'web/franks-plumbing.jpg', th: L + 'web/franks-plumbing-thumb.jpg', r: 0.2135, long: true },
                { t: 'TRIO Heating & Air website', img: L + 'web/trio.jpg', th: L + 'web/trio-thumb.jpg', r: 0.2045, long: true },
                { t: 'Ad Leverage agency website', img: L + 'web/ad-leverage.jpg', th: L + 'web/ad-leverage-thumb.jpg', r: 0.2593, long: true },
                { t: 'Call Jacob law firm: Lakers sponsorship page', img: L + 'web/call-jacob.jpg', th: L + 'web/call-jacob-thumb.jpg', r: 0.2527, long: true },
                { t: 'Sheesham furniture and interiors website', img: L + 'web/sheesham.jpg', th: L + 'web/sheesham-thumb.jpg', r: 0.2426, long: true },
                { t: 'Kothari Sons ethnic wear store', img: L + 'web/ethnic-store.jpg', th: L + 'web/ethnic-store-thumb.jpg', r: 0.2114, long: true },
                { t: 'BlackNorth Connect jobs platform', img: L + 'web/blacknorth-connect.jpg', th: L + 'web/blacknorth-connect-thumb.jpg', r: 0.2103, long: true },
                { t: 'BlackNorth B.E.G.I.N. website', img: L + 'web/blacknorth-begin.jpg', th: L + 'web/blacknorth-begin-thumb.jpg', r: 0.3947, long: true },
                { t: 'futurestore AI tools directory', img: L + 'web/futurestore.jpg', th: L + 'web/futurestore-thumb.jpg', r: 0.3071, long: true },
                { t: 'Betting Zone gaming website', img: L + 'web/betting-zone.jpg', th: L + 'web/betting-zone-thumb.jpg', r: 0.4967, long: true }
            ]
        },
        {
            id: 'social', label: 'Social posts & stories', title: 'Social posts <em>&amp; stories.</em>', story: true,
            text: 'Promotional stories for home-service brands: one offer, a bold headline and a call to action that reads at a glance on a phone.',
            items: [
                { t: 'Hansen Super Techs: $50 off story', img: L + 'social/hansen-50-off.jpg', th: L + 'social/hansen-50-off-thumb.jpg', r: 0.5581 },
                { t: 'TRIO: financing special story', img: L + 'social/trio-financing.jpg', th: L + 'social/trio-financing-thumb.jpg', r: 0.5622 },
                { t: 'TRIO: $58 tune-up special story', img: L + 'social/trio-tune-up.jpg', th: L + 'social/trio-tune-up-thumb.jpg', r: 0.5628 },
                { t: 'TRIO: $100 off repairs story', img: L + 'social/trio-repairs.jpg', th: L + 'social/trio-repairs-thumb.jpg', r: 0.5628 }
            ]
        },
        {
            id: 'mobile-apps', label: 'Mobile apps', title: 'Mobile <em>apps.</em>',
            text: 'iOS and Android screens for finance, learning, fitness and food: thumb-friendly layouts and flows that finish in a few taps.',
            items: [
                { t: 'Stock trading app', img: U + '32547485/file/original-34544cb2a6232baecf01f0549e7e2005.png', s: '16062130-Stock-trading-app' },
                { t: 'E-learning app', img: U + '30962191/file/original-bc7f2face669e655624c0bbd40fb5621.png', s: '15278664-E-Learning-App' },
                { t: 'Visitor details pass', img: U + '30757909/file/original-e7ae719f5a83e0ed11657f8012660ae1.png', s: '15178314-Visitors-Detail' },
                { t: 'hmoney crypto wallet', img: U + '30538925/file/original-449d38540e35a9b1d9e5e106fb210e54.png', s: '15068547-hmoney-crypto-wallet' },
                { t: 'Crypto wallet app', img: U + '30234537/file/original-a65d9f088757ed9a82067e052a67b48e.png', s: '14917829-Crypto-Wallet-App-Design' },
                { t: 'Seven minutes workout app', img: U + '27378572/file/original-c7bd3f11fed9ecd8d18fe85a44c5f2ab.png', s: '11604695-Seven-Minutes-Workout-Mobile-App-Design' },
                { t: 'E-learning app design', img: U + '27149314/file/original-b6b11c1b122f4ea68a4aca24cbd23642.png', s: '11350009-Elearning-app-design' },
                { t: 'Food delivery onboarding', img: U + '26798490/file/original-878cd2d648ad2efea31df65257c6ef70.png', s: '11046339-Minimal-Onboard-screen-for-food-delivery-app' },
                { t: 'Restaurant app', img: U + '26638765/file/original-e9f56c95d5919ce946a046ec14aadd31.png', s: '10882464-RESTAURANT-APP', r: 1 },
                { t: 'Amusement park payment app', img: U + '26268220/file/original-8d9743400c9ec5f7f78b0214ac6660e3.png', s: '10513453-Amusement-park' },
                { t: 'Minimal note app', img: U + '23371188/file/original-fa7cb8fafb31ed3f6f8e97853fc02742.jpg', s: '4940637-Minimal-Ui-ux-design-of-note-app' }
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
                { t: 'LocalRoofs: Danville roof replacement page', img: L + 'unbounce/localroofs-danville.jpg', th: L + 'unbounce/localroofs-danville-thumb.jpg', r: 0.166, long: true },
                { t: 'Restorerz: mold remediation page', img: L + 'unbounce/restorerz-mold.jpg', th: L + 'unbounce/restorerz-mold-thumb.jpg', r: 0.1927, long: true },
                { t: 'Construction Unlimited: roof rejuvenation offer', img: L + 'unbounce/construction-unlimited.jpg', th: L + 'unbounce/construction-unlimited-thumb.jpg', r: 0.2636, long: true },
                { t: 'Sam\'s Air Control: A/C installation page', img: L + 'unbounce/sams-air-control.jpg', th: L + 'unbounce/sams-air-control-thumb.jpg', r: 0.237, long: true },
                { t: 'Republic Home Services: heating installation page', img: L + 'unbounce/republic-home.jpg', th: L + 'unbounce/republic-home-thumb.jpg', r: 0.2228, long: true },
                { t: 'Dean\'s Home Services: permanent exterior lighting', img: L + 'unbounce/deans-lighting.jpg', th: L + 'unbounce/deans-lighting-thumb.jpg', r: 0.2695, long: true },
                { t: 'Call Jacob: truck accident case review page', img: L + 'unbounce/call-jacob-truck-accident.jpg', th: L + 'unbounce/call-jacob-truck-accident-thumb.jpg', r: 0.1851, long: true },
                { t: 'Call Jacob: dog bite case review page', img: L + 'unbounce/call-jacob-dog-bite.jpg', th: L + 'unbounce/call-jacob-dog-bite-thumb.jpg', r: 0.4325, long: true },
                { t: 'CHUD Cooling & Heating: oldest HVAC system giveaway', img: L + 'unbounce/chud-giveaway.jpg', th: L + 'unbounce/chud-giveaway-thumb.jpg', r: 0.4995, long: true }
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
    var isDrib = function (src) { return src.indexOf(U) === 0; };
    var src = function (it, w) { return isDrib(it.img) ? it.img + '?format=webp&resize=' + w + 'x' + Math.round(w * 3 / 4) + '&vertical=center' : (w <= 800 && it.th) || it.img; };
    var srcset = function (it) { return isDrib(it.img) ? src(it, 400) + ' 400w, ' + src(it, 800) + ' 800w' : it.th && !it.long ? it.th + ' 480w, ' + it.img + ' 1080w' : ''; };
    var big = function (it) { return isDrib(it.img) ? it.img + '?format=webp&resize=2000x0' : it.img; };
    var ratio = function (it) { return it.r || 4 / 3; };
    var link = function (it) { return it.s ? 'https://dribbble.com/shots/' + it.s : (it.href || PROFILE); };
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
            var set = srcset(it), sizes = g.story ? '(min-width:1024px) 14vw, 46vw' : '(min-width:1280px) 22vw, (min-width:1024px) 20vw, 48vw';
            return '<figure class="dz-tile"><button type="button" class="dz-btn' + (g.story ? ' dz-btn--story' : '') + '" data-g="' + gi + '" data-i="' + ii + '" aria-label="Open design: ' + esc(it.t) + '">' +
                '<img src="' + src(it, 800) + '"' + (set ? ' srcset="' + set + '" sizes="' + sizes + '"' : '') + ' alt="' + esc(it.t) + '" width="' + (g.story ? 480 : 400) + '" height="' + (g.story ? 853 : 300) + '" loading="lazy" decoding="async">' +
                '<span class="dz-cap">' + esc(it.t) + '<span aria-hidden="true">↗</span></span></button></figure>';
        }).join('');
        var onDribbble = g.items.some(function (it) { return it.s; });
        return '<section id="' + g.id + '" class="sx ' + (gi % 2 ? 'sx-light' : 'sx-cream') + ' dz-sec dz-tint-' + (gi % 7) + ' px-6" data-label="' + esc(g.label) + '">' +
            '<div class="max-w-7xl mx-auto dz-row">' +
                '<div class="dz-side"><div class="dz-side__in">' +
                    '<p class="sx-label">' + pad(gi + 1) + ' / ' + pad(GROUPS.length) + ' &nbsp;·&nbsp; ' + g.items.length + ' ' + (g.items.length === 1 ? 'design' : 'designs') + '</p>' +
                    '<h2 class="dz-title">' + g.title + '</h2>' +
                    '<p class="sx-lead dz-text">' + esc(g.text) + '</p>' +
                    (onDribbble ? '<a href="' + PROFILE + '" target="_blank" rel="noopener noreferrer" class="sx-seeall dz-more">More on Dribbble <span>↗</span></a>' : '') +
                '</div></div>' +
                '<div class="dz-grid' + (g.story ? ' dz-grid--story' : g.items.length === 4 ? ' dz-grid--two' : '') + '">' + tiles + '</div>' +
            '</div></section>';
    }).join('');
    host.insertAdjacentHTML('beforebegin', html);
    host.remove();

    Array.prototype.forEach.call(document.querySelectorAll('.dz-btn img'), function (im) {
        var on = function () { im.classList.add('on'); };
        if (im.complete && im.naturalWidth) on(); else { im.addEventListener('load', on); im.addEventListener('error', on); }
    });

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
        '<div class="lb__bar"><div><p class="lb__title"></p><p class="lb__by"></p></div><div class="lb__links"><a class="lb__link" target="_blank" rel="noopener noreferrer">View on Dribbble ↗</a></div></div>';
    document.body.appendChild(lb);
    var q = function (s) { return lb.querySelector(s); };
    var stage = q('.lb__stage'), img = q('.lb__img'), count = q('.lb__count'), title = q('.lb__title'), by = q('.lb__by'), ext = q('.lb__link'), closeBtn = q('.lb__close');
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
            img.src = thumbSrc || src(it, 800);
            var hi = new Image();
            hi.onload = function () { if (curG === g && curI === i) img.src = hi.src; };
            hi.src = big(it);
        }
        count.textContent = grp.label + '  ·  ' + pad(i + 1) + ' / ' + pad(grp.items.length);
        title.textContent = it.t;
        by.textContent = grp.label + ' by Saagar Shrestha' + (it.long ? '  ·  Scroll to see the whole page' : '');
        ext.href = link(it);
        ext.hidden = !(it.s || it.href);
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
