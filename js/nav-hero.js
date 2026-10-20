/* Nav mascot: a green pixel-art dragon flies beside the "Available for work" button,
   breathes fire at it and now and then lies down on top of it, while a mini boss
   hides behind the button. Every so often it leaves the nav to roam the page, perching
   only on top of components, only where it covers nothing but bare background.
   Rubbing it with the mouse sends it home. Palette echoes Commando.html. */
(function () {
    var cta = document.querySelector('.site-nav .site-cta');
    if (!cta || cta.closest('.cta-wrap')) return;

    var K = '#1b1028';
    function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
    function P(g, col, x, y, w, h) { g.fillStyle = col; g.fillRect(x, y, w || 1, h || 1); }
    function disc(g, cx, cy, r, col) { g.fillStyle = col; for (var y = -r; y <= r; y++) { var w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y + r * 0.6))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
    function ell(g, cx, cy, rx, ry, col) { g.fillStyle = col; for (var y = -ry; y <= ry; y++) { var w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / ((ry + 0.5) * (ry + 0.5))))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
    function line(g, col, x0, y0, x1, y1, s) {
        s = s || 1; var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx - dy;
        for (;;) { P(g, col, x0, y0, s, s); if (x0 === x1 && y0 === y1) break; var e2 = 2 * e; if (e2 > -dy) { e -= dy; x0 += sx; } if (e2 < dx) { e += dx; y0 += sy; } }
    }
    function poly(g, col, pts) {
        var y0 = Infinity, y1 = -Infinity, i;
        for (i = 0; i < pts.length; i++) { y0 = Math.min(y0, pts[i][1]); y1 = Math.max(y1, pts[i][1]); }
        for (var y = y0; y <= y1; y++) {
            var yc = y + 0.5, xs = [];
            for (i = 0; i < pts.length; i++) {
                var a = pts[i], b = pts[(i + 1) % pts.length];
                if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
            }
            xs.sort(function (p, q) { return p - q; });
            for (var k = 0; k + 1 < xs.length; k += 2) { var xa = Math.round(xs[k]), xb = Math.round(xs[k + 1]); if (xb > xa) P(g, col, xa, y, xb - xa, 1); }
        }
    }
    function flip(c) { var f = mk(c.width, c.height), g = f.getContext('2d'); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return f; }
    function pair(c) { return { r: c, l: flip(c) }; }
    // paint in colour, then wrap the silhouette in a 1px dark outline
    function outlined(w, h, paint) {
        var c = mk(w, h); paint(c.getContext('2d'));
        var s = mk(w, h), sg = s.getContext('2d'); sg.drawImage(c, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = OUT; sg.fillRect(0, 0, w, h);
        var o = mk(w, h), og = o.getContext('2d');
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) { og.drawImage(s, d[0], d[1]); });
        og.drawImage(c, 0, 0);
        return o;
    }

    /* ---------- green dragon sprites ---------- */
    var OUT = '#0b120d', G = '#1e8a3c', GD = '#0f5a26', GL = '#3fb556', BELLY = '#6cc46a',
        WING = '#f19a85', FAR = '#0c4a1f', EYE = '#feae34', HORN = '#e9e2c0', MOUTH = '#e43b44', TOOTH = '#ffffff';
    var FW = 36, FH = 21, RW = 36, RH = 10, MOUTH_X = 34, MOUTH_Y = 9, NOSE_X = 34, NOSE_Y = 5;

    function paintFly(g, wing, jaw) {
        if (wing === 0) poly(g, FAR, [[22, 11], [24, 4], [28, 1], [28, 5], [25, 11]]);
        if (wing === 1) poly(g, FAR, [[22, 11], [26, 6], [30, 5], [26, 11]]);
        // tail curling down and back, arrowhead tip
        line(g, G, 11, 14, 7, 16, 2); line(g, G, 7, 16, 3, 15, 2); line(g, G, 3, 15, 2, 12, 1); line(g, G, 2, 12, 3, 8, 1);
        poly(g, G, [[1, 9], [3, 4], [6, 8], [3, 9]]);
        // body
        ell(g, 17, 13, 8, 3, G); P(g, GL, 12, 11, 10, 1); P(g, BELLY, 11, 15, 12, 1); P(g, GD, 10, 14, 1, 1);
        for (var x = 11; x <= 23; x += 3) P(g, G, x, 9, 1, 1);
        P(g, G, 12, 16, 3, 2); P(g, HORN, 12, 18); P(g, HORN, 14, 18);
        P(g, G, 21, 16, 3, 2); P(g, HORN, 21, 18); P(g, HORN, 23, 18);
        // neck and head
        line(g, G, 23, 12, 28, 8, 3);
        P(g, G, 27, 6, 6, 4); P(g, G, 32, 7, 2, 2); P(g, GD, 27, 9, 6, 1);
        if (jaw) { P(g, MOUTH, 30, 9, 4, 1); P(g, TOOTH, 31, 9); P(g, G, 28, 10, 5, 1); }
        P(g, OUT, 29, 6, 2, 1); P(g, EYE, 30, 7); P(g, OUT, 33, 7);
        line(g, HORN, 28, 6, 25, 3); line(g, HORN, 30, 6, 29, 3);
        // near wing: salmon membrane, green bones
        // wing up: swept high and back to a point, like a raised bat wing
        if (wing === 0) {
            poly(g, WING, [[21, 11], [19, 3], [15, 1], [7, 1], [9, 4], [10, 7], [13, 11]]);
            line(g, G, 20, 10, 19, 3, 2); line(g, G, 19, 3, 15, 1, 2); line(g, G, 15, 1, 7, 1);
            line(g, GD, 18, 4, 10, 4); line(g, GD, 18, 5, 12, 9);
        }
        // wing level: stretched back, tip slightly raised
        if (wing === 1) {
            poly(g, WING, [[21, 11], [15, 5], [4, 3], [5, 6], [8, 8], [13, 11]]);
            line(g, G, 20, 10, 15, 5, 2); line(g, G, 15, 5, 4, 3);
            line(g, GD, 15, 6, 7, 6); line(g, GD, 16, 7, 11, 10);
        }
        // wing down: downstroke below the body
        if (wing === 2) {
            poly(g, WING, [[22, 12], [16, 13], [9, 17], [8, 19], [14, 19], [19, 16], [22, 14]]);
            line(g, G, 21, 12, 15, 14, 2); line(g, G, 15, 14, 8, 18);
            line(g, GD, 19, 14, 12, 18);
        }
    }
    function paintRest(g, blink, flick) {
        // tail lying along the button, tip curled up
        line(g, G, 11, 7, 5, 7, 2); line(g, G, 5, 7, 2, 6); line(g, G, 2, 6, 2, 4 - flick);
        poly(g, G, [[0, 5 - flick], [2, 1 - flick + 1], [4, 5 - flick]]);
        // body
        ell(g, 17, 6, 8, 2, G); P(g, GL, 12, 5, 9, 1); P(g, BELLY, 11, 8, 12, 1);
        P(g, G, 10, 3); P(g, G, 24, 3);
        P(g, G, 10, 7, 4, 2); P(g, HORN, 10, 8); P(g, HORN, 12, 8);
        // folded wing
        poly(g, WING, [[12, 5], [16, 2], [23, 3], [21, 5]]); line(g, G, 16, 2, 23, 3); line(g, GD, 22, 4, 15, 4);
        // neck, head resting on its paws
        line(g, G, 24, 6, 27, 5, 2);
        P(g, G, 27, 4, 5, 4); P(g, G, 31, 5, 3, 2); P(g, GD, 28, 7, 5, 1);
        P(g, G, 24, 8, 8, 1); P(g, HORN, 32, 8); P(g, HORN, 30, 8);
        P(g, OUT, 29, 4, 2, 1); if (blink) P(g, GD, 29, 5, 2, 1); else P(g, EYE, 30, 5);
        P(g, OUT, 33, 5);
        line(g, HORN, 28, 4, 25, 2); line(g, HORN, 30, 4, 29, 2);
    }
    var FLY = [0, 1, 2, 1].map(function (w) { return [pair(outlined(FW, FH, function (g) { paintFly(g, w, false); })), pair(outlined(FW, FH, function (g) { paintFly(g, w, true); }))]; });
    var REST = [[0, 0], [1, 0], [0, 1]].map(function (v) { return outlined(RW, RH, function (g) { paintRest(g, v[0], v[1]); }); });
    var RESTV = REST.map(pair);
    var FIRE = ['#ffffff', '#fff4c2', '#fee761', '#feae34', '#f77622', '#e43b44'];

    /* ---------- DOM: dragon canvas spans left of + over the button, boss canvas behind it ---------- */
    var wrap = document.createElement('span'); wrap.className = 'cta-wrap';
    cta.parentNode.insertBefore(wrap, cta);
    var heroC = mk(1, 1); heroC.className = 'cta-hero'; heroC.setAttribute('aria-hidden', 'true');
    var bossC = mk(1, 1); bossC.className = 'cta-boss'; bossC.setAttribute('aria-hidden', 'true');
    wrap.appendChild(heroC); wrap.appendChild(bossC); wrap.appendChild(cta);
    var hg = heroC.getContext('2d'), bg = bossC.getContext('2d');
    cta.addEventListener('animationend', function (e) { if (e.animationName === 'cta-hit') cta.classList.remove('is-hit'); });

    var PEEK = 9;              // canvas rows above the button's top edge (each row = 2 css px)
    var heroU = 0, cw = 0, ch = 0, maxX = 0, flyY = 0, canFly = false, perchLo = 0, perchHi = 0;
    var bw = 0, bh = 0, edge = PEEK;
    function size() {
        var links = document.querySelectorAll('.site-nav .site-links a');
        var last = links[links.length - 1];
        var room = last ? cta.getBoundingClientRect().left - last.getBoundingClientRect().right - 12 : 80;
        var css = Math.max(0, Math.min(140, Math.floor(room / 2) * 2));
        heroU = css / 2;
        bw = Math.floor(cta.offsetWidth / 2); bh = PEEK + Math.ceil(cta.offsetHeight / 2);
        cw = heroU + bw; ch = bh + 1;
        heroC.width = Math.max(1, cw); heroC.height = ch;
        heroC.style.width = cw * 2 + 'px'; heroC.style.height = ch * 2 + 'px';
        heroC.style.left = -css + 'px'; heroC.style.top = -PEEK * 2 + 'px';
        flyY = Math.max(0, ch - FH - 1);
        canFly = heroU >= FW + 8;
        maxX = Math.max(0, heroU - FW - 6);
        perchLo = heroU + 2; perchHi = Math.max(perchLo, heroU + bw - RW - 2);
        if (!canFly && D.st !== 'rest' && D.st !== 'away') rest(1e9);
        if (canFly && /fly|windup|breathe/.test(D.st) && D.x > maxX) D.x = maxX;
        if (D.st === 'rest') D.x = Math.min(Math.max(D.x, perchLo), perchHi);
        bossC.width = bw; bossC.height = bh; bossC.style.width = bw * 2 + 'px'; bossC.style.height = bh * 2 + 'px';
        edge = PEEK;
        if (B.x > bw - 24) B.x = Math.max(0, bw - 24);
    }

    /* ---------- dragon: fly / breathe fire / perch on the button ---------- */
    var D = { x: 0, y: 0, face: 1, st: 'fly', t: 0, dur: 80, tx: 0, ty: 0, flap: 0, burned: false };
    var flames = [], sparks = [], smoke = [];
    function onButton() { return D.st === 'toPerch' || D.st === 'rest' || D.st === 'fromPerch'; }
    function bob() { return D.st === 'rest' ? 0 : Math.round(Math.sin(D.flap / 14)); }
    function rest(dur) { D.st = 'rest'; D.t = 0; D.dur = dur; D.face = 1; if (D.x < perchLo || D.x > perchHi) D.x = perchLo + ((perchHi - perchLo) / 2 | 0); }
    function flyTo() { D.st = 'fly'; D.t = 0; D.dur = 60 + Math.random() * 100; D.tx = Math.round(Math.random() * maxX); D.face = D.tx >= D.x ? 1 : -1; }
    function nextDragon() {
        var r = Math.random();
        if (r < 0.45) { D.st = 'windup'; D.t = 0; D.face = 1; }
        else if (r < 0.75) { D.st = 'toPerch'; D.t = 0; D.face = 1; D.tx = perchLo + Math.round(Math.random() * (perchHi - perchLo)); D.ty = 0; }
        else flyTo();
    }
    function hit(y) {
        for (var i = 0; i < 7; i++) sparks.push({ x: heroU - 1, y: y, vx: -0.3 - Math.random() * 0.9, vy: -0.4 - Math.random() * 0.9, life: 12 + (Math.random() * 10 | 0), c: FIRE[2 + (i % 4)] });
        cta.classList.remove('is-hit'); void cta.offsetWidth; cta.classList.add('is-hit');
        if (B.st === 'peek' || B.st === 'run') B.st = 'duck';
    }
    function approach(v, target, step) { return Math.abs(target - v) <= step ? target : v + step * (target > v ? 1 : -1); }
    function updateHero() {
        D.t++; D.flap += D.st === 'breathe' ? 0.6 : 1;
        if (D.st === 'fly') {
            D.y = approach(D.y, flyY, 0.3);
            if (Math.abs(D.tx - D.x) > 0.4) D.x = approach(D.x, D.tx, 0.4);
            else if (D.t >= D.dur) { D.face = 1; nextDragon(); }
        } else if (D.st === 'windup') {
            if (D.x > 0) D.x -= 0.15;
            if (D.t >= 14) { D.st = 'breathe'; D.t = 0; D.burned = false; }
        } else if (D.st === 'breathe') {
            if (D.t <= 42) for (var k = 0; k < 2; k++) flames.push({ x: D.x + MOUTH_X, y: D.y + bob() + MOUTH_Y + (Math.random() - 0.5), vx: 2.1 + Math.random() * 0.6, vy: (Math.random() - 0.5) * 0.4, age: 0 });
            if (D.t > 42 && !flames.length) flyTo();
        } else if (D.st === 'toPerch') {
            D.x = approach(D.x, D.tx, 0.9); D.y = approach(D.y, D.ty, 0.2);
            if (D.x === D.tx && D.y === D.ty) rest(300 + Math.random() * 300);
        } else if (D.st === 'rest') {
            if (D.t % 110 === 60) for (var m = 0; m < 3; m++) smoke.push({ x: D.x + NOSE_X + m * 0.6, y: NOSE_Y - m * 0.8, vx: 0.12, vy: -0.18, life: 34 });
            if (canFly && D.t >= D.dur) { D.st = 'fromPerch'; D.t = 0; D.face = -1; D.y = 0; D.tx = Math.round(Math.random() * maxX); }
        } else if (D.st === 'fromPerch') {
            D.x = approach(D.x, D.tx, 0.9); D.y = approach(D.y, flyY, 0.2);
            if (D.x === D.tx) flyTo();
        }
        for (var i = flames.length - 1; i >= 0; i--) {
            var f = flames[i]; f.x += f.vx; f.y += f.vy; f.age++;
            if (f.x >= heroU - 1) { if (!D.burned) { D.burned = true; hit(f.y); } flames.splice(i, 1); }
        }
        for (var j = sparks.length - 1; j >= 0; j--) {
            var s = sparks[j]; s.x += s.vx; s.y += s.vy; s.vy += 0.06;
            if (--s.life <= 0) sparks.splice(j, 1);
        }
        for (var n = smoke.length - 1; n >= 0; n--) {
            var p = smoke[n]; p.x += p.vx; p.y += p.vy;
            if (--p.life <= 0 || p.y < 0) smoke.splice(n, 1);
        }
    }
    function drawHero() {
        hg.clearRect(0, 0, heroC.width, heroC.height);
        if (D.st === 'away') {
            // out roaming the page; drawn on its own canvas
        } else if (D.st === 'rest') {
            var blink = D.t % 170 > 162, flick = !blink && D.t % 95 > 80;
            hg.drawImage(REST[blink ? 1 : flick ? 2 : 0], Math.round(D.x), 0);
        } else {
            var fr = FLY[((D.flap / 6) | 0) % 4][D.st === 'breathe' ? 1 : 0][D.face > 0 ? 'r' : 'l'];
            hg.drawImage(fr, Math.round(D.x), Math.round(D.y) + bob());
        }
        flames.forEach(function (f) { var sz = f.age < 9 ? 2 : 1; P(hg, FIRE[Math.min(FIRE.length - 1, (f.age / 3) | 0)], Math.round(f.x), Math.round(f.y) - (sz >> 1), sz, sz); });
        sparks.forEach(function (s) { P(hg, s.c, Math.round(s.x), Math.round(s.y)); });
        smoke.forEach(function (p) { P(hg, p.life > 18 ? '#c9d0c9' : '#9aa39a', Math.round(p.x), Math.round(p.y)); });
    }

    /* ---------- mini boss: hides behind the button, peeks, runs ---------- */
    var B = { x: 20, y: 0, face: -1, st: 'hide', t: 0, dur: 150, ty: 0, tx: 0, looks: 0, step: 0 };
    function hideY() { return edge + 2; }
    function nextBoss() {
        B.t = 0;
        var lo = 10, hi = Math.max(lo, bw - 34);
        if (B.st !== 'hide' || onButton()) { B.st = 'hide'; B.dur = 120 + Math.random() * 240; return; }
        if (Math.random() < 0.55) { B.st = 'peek'; B.x = lo + Math.round(Math.random() * (hi - lo)); B.looks = 2 + (Math.random() * 3 | 0); B.face = Math.random() < 0.5 ? 1 : -1; }
        else { B.st = 'run'; var fromLeft = Math.random() < 0.5; B.x = fromLeft ? lo : hi; B.tx = fromLeft ? hi : lo; B.face = fromLeft ? 1 : -1; }
    }
    function updateBoss() {
        B.t++;
        var hy = hideY();
        if ((B.st === 'peek' || B.st === 'run') && onButton()) B.st = 'duck';
        if (B.st === 'hide') { B.y = Math.min(hy, B.y + 1); if (B.t >= B.dur) nextBoss(); }
        else if (B.st === 'duck') { B.y = Math.min(hy, B.y + 2); if (B.y >= hy) { B.st = 'x'; nextBoss(); } }
        else if (B.st === 'peek') {
            var top = edge - 6;
            if (B.y > top) B.y -= 0.5;
            else if (B.t % 40 === 0) { B.face = -B.face; if (--B.looks <= 0) { B.st = 'x'; nextBoss(); } }
        } else if (B.st === 'run') {
            var ry = edge - 5;
            if (B.y > ry) B.y -= 0.75;
            else { B.x += 0.9 * B.face; B.step++; if ((B.face > 0 && B.x >= B.tx) || (B.face < 0 && B.x <= B.tx)) { B.st = 'x'; nextBoss(); } }
        }
    }
    function drawBoss() {
        bg.clearRect(0, 0, bw, bh);
        var x = Math.round(B.x), y = Math.round(B.y) - (B.st === 'run' && B.y <= edge - 5 && (B.step >> 3) % 2 ? 1 : 0);
        var f = B.face, eye = (Date.now() >> 9) % 4 ? '#ff6a6a' : '#e43b44';
        disc(bg, x + 12, y + 5, 5, K); disc(bg, x + 12, y + 5, 4, '#262b44'); disc(bg, x + 12, y + 5, 3, '#3a4466');
        P(bg, '#9ef3ff', f > 0 ? x + 8 : x + 14, y + 1, 2, 1);
        P(bg, K, x + 10 + f * 2, y + 2, 4, 3); P(bg, eye, x + 11 + f * 2, y + 3, 2, 1);
        P(bg, K, x + 1, y + 9, 22, 8); P(bg, '#e43b44', x + 2, y + 10, 20, 6); P(bg, '#ff8a8a', x + 2, y + 10, 20, 1); P(bg, '#9e2835', x + 2, y + 15, 20, 1);
        P(bg, K, f > 0 ? x + 22 : x - 3, y + 11, 5, 3); P(bg, '#8b9bb4', f > 0 ? x + 23 : x - 2, y + 12, 3, 1);
    }

    /* ---------- roaming: perch on page components, fly home when rubbed ---------- */
    var RS = 2, PAD = 8;       // css px per sprite unit; canvas margin (units) for smoke and hearts
    var roamC = mk(FW + PAD * 2, RW + PAD * 2); roamC.className = 'cta-roam'; roamC.setAttribute('aria-hidden', 'true');
    roamC.style.width = roamC.width * RS + 'px'; roamC.style.height = roamC.height * RS + 'px'; roamC.style.display = 'none';
    document.body.appendChild(roamC);
    var rg = roamC.getContext('2d');
    var R = { on: false, st: 'fly', x: 0, y: 0, vx: 0, vy: 0, face: 1, flap: 0, t: 0, dur: 0, spot: null, homeX: 0, rub: 0, rubbed: false, box: null };
    var puffs = [], hearts = [];
    var homeT = 60 * (6 + Math.random() * 6);
    var SEL = 'h1,h2,h3,h4,p,img,picture,video,button,a,li,figure,article,blockquote,input,textarea,select,' +
        '[class*="card"],[class*="btn"],[class*="case"],[class*="shot"],[class*="tile"]';
    var navEl = document.querySelector('.site-nav');
    function navBottom() { return navEl ? navEl.getBoundingClientRect().bottom : 0; }
    // where the resting sprite sits, in viewport px: lying along the component's top edge
    function spotBox(s) {
        var r = s.el.getBoundingClientRect();
        return { x: r.left + s.off, y: r.top - RH * RS, w: RW * RS, h: RH * RS };
    }
    function overlaps(b, r, m) { return b.x - m < r.right && b.x + b.w + m > r.left && b.y - m < r.bottom && b.y + b.h + m > r.top; }
    // a spot is clear when every pixel under the dragon is bare background: the page, or a box that
    // merely wraps the target, with no loose text or media of its own there
    function clear(s) {
        var el = s.el;
        if (!el.isConnected) return false;
        if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
        var b = spotBox(s);
        if (b.x < 6 || b.y < navBottom() + 6 || b.x + b.w > innerWidth - 6 || b.y + b.h > innerHeight - 6) return false;
        var r = el.getBoundingClientRect();
        var under = document.elementFromPoint(Math.min(Math.max(b.x + b.w / 2, r.left + 1), r.right - 1), Math.min(r.top + 2, r.bottom - 1));
        if (!under || !el.contains(under)) return false;   // target is covered by something else
        var anc = [], hits = [], i, j;
        for (var p = el.parentElement; p; p = p.parentElement) anc.push(p);
        var nx = Math.max(2, Math.ceil(b.w / 14)), ny = Math.max(2, Math.ceil(b.h / 14));
        for (i = 0; i < nx; i++) for (j = 0; j < ny; j++) {
            var e = document.elementFromPoint(b.x + 1 + (b.w - 2) * i / (nx - 1), b.y + 1 + (b.h - 2) * j / (ny - 1));
            if (!e || anc.indexOf(e) < 0) return false;
            if (hits.indexOf(e) < 0) hits.push(e);
        }
        var range = document.createRange();
        for (i = 0; i < hits.length; i++) {
            var kids = hits[i].childNodes;
            for (j = 0; j < kids.length; j++) {
                if (kids[j].nodeType !== 3 || !/\S/.test(kids[j].data)) continue;
                range.selectNodeContents(kids[j]);
                var rects = range.getClientRects();
                for (var k = 0; k < rects.length; k++) if (overlaps(b, rects[k], 3)) return false;
            }
        }
        // media with pointer-events: none is invisible to elementFromPoint, so check it by box
        var media = document.querySelectorAll('img,svg,video,canvas,iframe');
        for (i = 0; i < media.length; i++) {
            var m = media[i];
            if (m === roamC || m === heroC || m === bossC) continue;
            var mr = m.getBoundingClientRect();
            if (mr.width && mr.height && overlaps(b, mr, 0) && (!m.checkVisibility || m.checkVisibility({ opacityProperty: true, visibilityProperty: true }))) return false;
        }
        return true;
    }
    function pickSpot(avoid) {
        var nb = navBottom(), list = [], all = document.querySelectorAll(SEL), i;
        for (i = 0; i < all.length; i++) {
            var el = all[i];
            if (el === avoid || (navEl && navEl.contains(el))) continue;
            var r = el.getBoundingClientRect();
            if (r.width < 40 || r.height < 16 || r.bottom < nb + 30 || r.top > innerHeight - 30 || r.right < 0 || r.left > innerWidth) continue;
            list.push(el);
        }
        for (i = list.length - 1; i > 0; i--) { var q = Math.random() * (i + 1) | 0, t = list[i]; list[i] = list[q]; list[q] = t; }
        // only ever on top of a component, never beside one
        for (i = 0; i < list.length && i < 160; i++) {
            var room = list[i].getBoundingClientRect().width - RW * RS;
            if (room < 0) continue;
            var s = { el: list[i], off: Math.random() * room, face: Math.random() < 0.5 ? 1 : -1 };
            if (clear(s)) return s;
        }
        return null;
    }
    // flying-sprite position for touching down on a spot, and for slotting back into the nav
    function landAt(s) { var b = spotBox(s); return { x: b.x, y: b.y + b.h - FH * RS }; }
    function homeAt() {
        var hr = heroC.getBoundingClientRect();
        if (canFly) return { x: hr.left + R.homeX * RS, y: hr.top + flyY * RS };
        return { x: hr.left + (perchLo + ((perchHi - perchLo) / 2 | 0)) * RS, y: hr.top + (RH - FH) * RS };
    }
    function steer(T) {
        var dx = T.x - R.x, dy = T.y - R.y, d = Math.hypot(dx, dy);
        if (d < 1.5) { R.x = T.x; R.y = T.y; R.vx = R.vy = 0; return true; }
        if (d < 8) { R.x += dx * 0.3; R.y += dy * 0.3; return false; }
        var sp = Math.min(7, 1.5 + d / 14);
        R.vx += (dx / d * sp - R.vx) * 0.1; R.vy += (dy / d * sp - R.vy) * 0.1;
        R.x += R.vx; R.y += R.vy;
        if (Math.abs(R.vx) > 0.4) R.face = R.vx > 0 ? 1 : -1;
        return false;
    }
    function leaveNav() {
        if (--homeT > 0 || !(D.st === 'fly' || (D.st === 'rest' && !canFly))) return;
        var s = pickSpot(null);
        if (!s) { homeT = 300; return; }
        var hr = heroC.getBoundingClientRect();
        R.x = hr.left + D.x * RS;
        R.y = D.st === 'rest' ? hr.top + (RH - FH) * RS : hr.top + (D.y + bob()) * RS;
        R.vx = 0; R.vy = -3; R.face = D.face; R.flap = D.flap; R.rub = 0; R.rubbed = false;
        R.on = true; R.st = 'fly'; R.t = 0; R.spot = s;
        D.st = 'away';
    }
    function goHome() { R.st = 'home'; R.t = 0; R.spot = null; R.homeX = Math.round(Math.random() * maxX); }
    function hop(forced) {
        var s = pickSpot(R.spot.el);
        if (s) { R.st = 'fly'; R.t = 0; R.spot = s; }
        else if (forced) goHome();
        else R.dur += 120;
    }
    function updateRoam() {
        R.t++; R.rub *= 0.99;
        if (R.st === 'fly') {
            R.flap += 1.4;
            if (R.t % 30 === 0 && !clear(R.spot)) { var s = pickSpot(R.spot.el); if (s) R.spot = s; else goHome(); }
            if (R.st === 'fly' && steer(landAt(R.spot))) { R.st = 'perch'; R.t = 0; R.dur = 60 * (6 + Math.random() * 8); }
        } else if (R.st === 'perch') {
            var at = landAt(R.spot); R.x = at.x; R.y = at.y;
            if (R.t % 20 === 0 && !clear(R.spot)) hop(true);
            else if (R.t >= R.dur && R.rub < 30) hop(false);
            if (R.st === 'perch' && R.t % 110 === 60) {
                var f = R.spot.face, nx = f > 0 ? NOSE_X : RW - 1 - NOSE_X;
                for (var m = 0; m < 3; m++) puffs.push({ x: nx + m * 0.6 * f, y: NOSE_Y - m * 0.8, vx: 0.12 * f, vy: -0.18, life: 34 });
            }
            if (R.rub > 40 && R.t % 9 === 0) addHeart();
        } else if (R.st === 'home') {
            R.flap += 1.4;
            if (steer(homeAt())) {
                R.on = false; roamC.style.display = 'none'; puffs.length = hearts.length = 0;
                if (canFly) { D.st = 'fly'; D.t = 0; D.dur = 60 + Math.random() * 100; D.x = D.tx = R.homeX; D.y = flyY; D.face = R.face; D.flap = R.flap; }
                else rest(1e9);
                homeT = 60 * (R.rubbed ? 25 + Math.random() * 20 : 10);
            }
        }
        for (var i = puffs.length - 1; i >= 0; i--) { var p = puffs[i]; p.x += p.vx; p.y += p.vy; if (--p.life <= 0) puffs.splice(i, 1); }
        for (var j = hearts.length - 1; j >= 0; j--) { var h = hearts[j]; h.x += h.vx; h.y += h.vy; if (--h.life <= 0) hearts.splice(j, 1); }
    }
    function addHeart() { hearts.push({ x: (R.box ? R.box.w / RS : RW) / 2 + (Math.random() - 0.5) * 12, y: 2, vx: (Math.random() - 0.5) * 0.2, vy: -0.3, life: 30 }); }
    function heart(g, x, y) { P(g, '#ff5d8f', x + 1, y); P(g, '#ff5d8f', x + 3, y); P(g, '#ff5d8f', x, y + 1, 5, 1); P(g, '#ff5d8f', x + 1, y + 2, 3, 1); P(g, '#ff5d8f', x + 2, y + 3); }
    function drawRoam() {
        rg.clearRect(0, 0, roamC.width, roamC.height);
        var spr, bx, by;
        if (R.st === 'perch') {
            var s = R.spot, b = spotBox(s);
            var blink = R.rub > 40 || R.t % 170 > 162, flick = !blink && R.t % 95 > 80;
            var v = RESTV[blink ? 1 : flick ? 2 : 0];
            spr = v[s.face > 0 ? 'r' : 'l'];
            bx = b.x; by = b.y;
        } else {
            spr = FLY[((R.flap / 6) | 0) % 4][0][R.face > 0 ? 'r' : 'l'];
            bx = R.x; by = R.y + Math.round(Math.sin(R.flap / 9) * 2);
        }
        rg.drawImage(spr, PAD, PAD);
        puffs.forEach(function (p) { P(rg, p.life > 18 ? '#c9d0c9' : '#9aa39a', PAD + Math.round(p.x), PAD + Math.round(p.y)); });
        hearts.forEach(function (h) { heart(rg, PAD + Math.round(h.x) - 2, PAD + Math.round(h.y) - 4); });
        roamC.style.transform = 'translate(' + Math.round(bx - PAD * RS) + 'px,' + Math.round(by - PAD * RS) + 'px)';
        R.box = { x: bx, y: by, w: spr.width * RS, h: spr.height * RS };
    }
    // rubbing: mouse movement over the dragon adds up; enough of it and it flies home happy
    var lastPX = null, lastPY = 0;
    document.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var x = e.clientX, y = e.clientY, px = lastPX, py = lastPY;
        lastPX = x; lastPY = y;
        if (!R.on || R.st === 'home' || !R.box || px === null) return;
        var b = R.box;
        if (x < b.x - 10 || x > b.x + b.w + 10 || y < b.y - 10 || y > b.y + b.h + 10) return;
        R.rub += Math.hypot(x - px, y - py);
        if (R.rub > 220) { R.rubbed = true; for (var i = 0; i < 4; i++) addHeart(); goHome(); }
    }, { passive: true });

    /* ---------- hand-off: lets another script borrow the dragon (used by 404.html) ----------
       origin() is where the flying sprite is now, in viewport px (null when the mascot is hidden);
       hold() takes it out of the nav; home() is where to bring it back; release() puts it back. */
    var held = false, heldX = 0;
    window.navHero = {
        sprites: { FLY: FLY, FW: FW, FH: FH, MOUTH_X: MOUTH_X, MOUTH_Y: MOUTH_Y, FIRE: FIRE, scale: RS },
        origin: function () {
            if (wrap.offsetParent === null) return null;
            if (R.on) return { x: R.x, y: R.y, face: R.face };
            var hr = heroC.getBoundingClientRect();
            if (D.st === 'rest' || D.st === 'toPerch' || D.st === 'fromPerch') return { x: hr.left + D.x * RS, y: hr.top + (RH - FH) * RS, face: 1 };
            return { x: hr.left + D.x * RS, y: hr.top + (D.y + bob()) * RS, face: D.face };
        },
        hold: function () {
            held = true;
            if (R.on) { R.on = false; roamC.style.display = 'none'; puffs.length = hearts.length = 0; }
            D.st = 'away'; flames.length = sparks.length = smoke.length = 0;
            hg.clearRect(0, 0, heroC.width, heroC.height);
            heldX = Math.round(Math.random() * maxX);
        },
        home: function () {
            if (wrap.offsetParent === null) return null;
            var hr = heroC.getBoundingClientRect();
            return canFly ? { x: hr.left + heldX * RS, y: hr.top + flyY * RS } : { x: hr.left + (perchLo + ((perchHi - perchLo) / 2 | 0)) * RS, y: hr.top + (RH - FH) * RS };
        },
        release: function (face) {
            held = false; homeT = 60 * 20;
            if (canFly) { D.st = 'fly'; D.t = 0; D.dur = 60 + Math.random() * 100; D.x = D.tx = heldX; D.y = flyY; D.face = face || 1; }
            else rest(1e9);
        }
    };

    /* ---------- loop ---------- */
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    B.y = hideY();
    size();
    D.y = flyY;
    window.addEventListener('resize', size);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
    if (reduce) { rest(1e9); drawHero(); return; }
    var acc = 0, last = performance.now(), STEP = 1000 / 60;
    function loop(now) {
        acc += Math.min(100, now - last); last = now;
        var shown = wrap.offsetParent !== null;
        if (shown) {
            var n = 0;
            while (acc >= STEP && n < 4) { if (!held) updateHero(); updateBoss(); if (R.on) updateRoam(); else if (!held) leaveNav(); acc -= STEP; n++; }
            drawHero(); drawBoss();
            if (R.on) drawRoam();
        }
        roamC.style.display = shown && R.on ? '' : 'none';
        acc %= STEP;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();
