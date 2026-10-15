/* Nav mascot: a green pixel-art dragon flies beside the "Available for work" button,
   breathes fire at it and now and then lies down on top of it, while a mini boss
   hides behind the button. Palette echoes Commando.html. */
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
        if (!canFly && D.st !== 'rest') rest(1e9);
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
        if (D.st === 'rest') {
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
        if (wrap.offsetParent !== null) {
            var n = 0;
            while (acc >= STEP && n < 4) { updateHero(); updateBoss(); acc -= STEP; n++; }
            drawHero(); drawBoss();
        }
        acc %= STEP;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();
