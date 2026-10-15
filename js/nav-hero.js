/* Nav mascot: the Coin Commando hero idles, walks and shoots the "Available for work"
   button while a mini boss hides behind it. Sprites are copied from Commando.html. */
(function () {
    var cta = document.querySelector('.site-nav .site-cta');
    if (!cta || cta.closest('.cta-wrap')) return;

    var K = '#1b1028';
    function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
    function P(g, col, x, y, w, h) { g.fillStyle = col; g.fillRect(x, y, w || 1, h || 1); }
    function disc(g, cx, cy, r, col) { g.fillStyle = col; for (var y = -r; y <= r; y++) { var w = Math.floor(Math.sqrt(Math.max(0, r * r - y * y + r * 0.6))); g.fillRect(cx - w, cy + y, w * 2 + 1, 1); } }
    function spr(rows, pal) {
        var w = Math.max.apply(null, rows.map(function (r) { return r.length; }));
        var c = mk(w, rows.length), g = c.getContext('2d');
        rows.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var k = row[x]; if (k !== '.' && pal[k]) P(g, pal[k], x, y); } });
        return c;
    }
    function flip(c) { var f = mk(c.width, c.height), g = f.getContext('2d'); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return f; }
    function pair(c) { return { r: c, l: flip(c) }; }

    var HEAD = ["......KKKKK.....", ".....KRRRRRK....", "..KKKRRWRRRRK...", ".KRrKrrrrrrrK...", "....KHHSSSKSK...", "....KHSSSSKSK...", ".....KSSSSSSSK..", ".....KKsSSsKK..."];
    var TORSO = ["....KOOKsssKK...", "...KOOOOKSSSK...", "...KOoOOOKKK....", "...KoOOOOK......"];
    var LEGS = {
        idle: ["....KBBBBBK.....", "....KBBKBBK.....", "...KKbbKKbbK....", "...KDDDK.KDDDK.."],
        r1: ["....KBBBBBK.....", "...KBBK.KBBK....", "..KbbK...KbbK...", ".KDDK.....KDDK.."],
        r2: ["....KBBBBK......", ".....KBBbK......", ".....KKbbK......", "....KDDDDK......"],
        r3: ["....KBBBBBK.....", "....KBBKBBBK....", "...KbbK.KKbbK...", "..KDDK....KDDK.."]
    };
    var PAL = { K: K, R: '#e43b44', r: '#9e2835', W: '#ffffff', H: '#5a3a22', S: '#f6c49a', s: '#c88456', O: '#f77622', o: '#b54a12', B: '#2a5bb8', b: '#1a3478', D: '#3a3446' };
    function body(legs) { return pair(spr(HEAD.concat(TORSO, legs), PAL)); }
    var HERO = { idle: body(LEGS.idle), run: [body(LEGS.r1), body(LEGS.r2), body(LEGS.r3), body(LEGS.r2)] };
    var GUN = pair(spr(["KKKKKKK", "KggggYK", "KDKKKKK"], { K: K, g: '#8b9bb4', Y: '#fee761', D: '#3a3446' }));

    /* ---------- DOM: hero canvas left of the button, boss canvas behind it ---------- */
    var wrap = document.createElement('span'); wrap.className = 'cta-wrap';
    cta.parentNode.insertBefore(wrap, cta);
    var heroC = mk(1, 20); heroC.className = 'cta-hero'; heroC.setAttribute('aria-hidden', 'true');
    var bossC = mk(1, 1); bossC.className = 'cta-boss'; bossC.setAttribute('aria-hidden', 'true');
    wrap.appendChild(heroC); wrap.appendChild(bossC); wrap.appendChild(cta);
    var hg = heroC.getContext('2d'), bg = bossC.getContext('2d');
    cta.addEventListener('animationend', function (e) { if (e.animationName === 'cta-hit') cta.classList.remove('is-hit'); });

    var PEEK = 9;              // boss canvas rows above the button's top edge (each row = 2 css px)
    var cw = 0, maxX = 0, bw = 0, bh = 0, edge = PEEK;
    function size() {
        var links = document.querySelectorAll('.site-nav .site-links a');
        var last = links[links.length - 1];
        var room = last ? cta.getBoundingClientRect().left - last.getBoundingClientRect().right - 12 : 80;
        var css = Math.max(0, Math.min(96, Math.floor(room / 2) * 2));
        heroC.hidden = css < 36;
        cw = css / 2; heroC.width = Math.max(1, cw); heroC.style.width = css + 'px';
        maxX = Math.max(0, cw - 16 - 8);
        if (H.x > maxX) H.x = maxX;
        bw = Math.floor(cta.offsetWidth / 2); bh = PEEK + Math.ceil(cta.offsetHeight / 2);
        bossC.width = bw; bossC.height = bh; bossC.style.width = bw * 2 + 'px'; bossC.style.height = bh * 2 + 'px';
        edge = PEEK;
        if (B.x > bw - 24) B.x = Math.max(0, bw - 24);
    }

    /* ---------- hero: idle / walk / shoot ---------- */
    var H = { x: 0, face: 1, st: 'idle', t: 0, dur: 50, tx: 0, anim: 0, shots: 0, cool: 0, flash: 0, recoil: 0 };
    var bullets = [], sparks = [];
    function nextHero() {
        var r = Math.random();
        H.t = 0;
        if (H.st !== 'shoot' && r < 0.45) { H.st = 'shoot'; H.shots = 1 + (Math.random() * 3 | 0); H.cool = 18; H.face = 1; }
        else if (H.st !== 'walk' && r < 0.8 && maxX > 3) {
            H.st = 'walk'; H.tx = Math.round(Math.random() * maxX);
            if (Math.abs(H.tx - H.x) < 4) H.tx = H.x > maxX / 2 ? 0 : maxX;
            H.face = H.tx > H.x ? 1 : -1;
        } else { H.st = 'idle'; H.dur = 70 + Math.random() * 110; }
    }
    function hit(y) {
        for (var i = 0; i < 6; i++) sparks.push({ x: cw - 2, y: y, vx: -0.4 - Math.random() * 1.2, vy: (Math.random() - 0.5) * 1.6, life: 10 + (Math.random() * 8 | 0), c: i % 2 ? '#fee761' : '#ffffff' });
        cta.classList.remove('is-hit'); void cta.offsetWidth; cta.classList.add('is-hit');
        if (B.st === 'peek' || B.st === 'run') { B.st = 'duck'; }
    }
    function updateHero() {
        H.t++;
        if (H.flash) H.flash--;
        if (H.recoil) H.recoil--;
        if (H.st === 'idle') { if (H.t >= H.dur) nextHero(); }
        else if (H.st === 'walk') {
            H.x += 0.35 * H.face; H.anim++;
            if ((H.face > 0 && H.x >= H.tx) || (H.face < 0 && H.x <= H.tx)) { H.x = H.tx; H.face = 1; nextHero(); }
        } else if (H.st === 'shoot') {
            if (H.shots > 0 && --H.cool <= 0) {
                bullets.push({ x: Math.round(H.x) + 17, y: 4 + 10 });
                H.flash = 4; H.recoil = 3; H.shots--; H.cool = 22;
            }
            if (H.shots === 0 && !bullets.length && H.t > 10) nextHero();
        }
        for (var i = bullets.length - 1; i >= 0; i--) {
            bullets[i].x += 3;
            if (bullets[i].x >= cw - 1) { hit(bullets[i].y); bullets.splice(i, 1); }
        }
        for (var j = sparks.length - 1; j >= 0; j--) {
            var s = sparks[j]; s.x += s.vx; s.y += s.vy; s.vy += 0.1;
            if (--s.life <= 0) sparks.splice(j, 1);
        }
    }
    function drawHero() {
        hg.clearRect(0, 0, heroC.width, heroC.height);
        var side = H.face > 0 ? 'r' : 'l';
        var fr = H.st === 'walk' ? HERO.run[((H.anim / 6) | 0) % 4] : HERO.idle;
        var dx = Math.round(H.x) - (H.recoil ? 1 : 0), dy = 4;
        hg.drawImage(fr[side], dx, dy);
        hg.drawImage(GUN[side], H.face > 0 ? dx + 9 : dx, dy + 9);
        if (H.flash) { var mx = dx + 17, my = dy + 10; P(hg, '#ffffff', mx - 1, my - 1, 3, 3); P(hg, '#fee761', mx - 2, my, 5, 1); }
        bullets.forEach(function (b) { P(hg, '#fee761', b.x - 2, b.y - 1, 4, 2); P(hg, '#fee761', b.x - 1, b.y - 2, 2, 4); P(hg, '#ffffff', b.x - 1, b.y - 1, 2, 2); });
        sparks.forEach(function (s) { P(hg, s.c, Math.round(s.x), Math.round(s.y), 1, 1); });
    }

    /* ---------- mini boss: hides behind the button, peeks, runs ---------- */
    var B = { x: 20, y: 0, face: -1, st: 'hide', t: 0, dur: 150, ty: 0, tx: 0, looks: 0, step: 0 };
    function hideY() { return edge + 2; }
    function nextBoss() {
        B.t = 0;
        var lo = 10, hi = Math.max(lo, bw - 34);
        if (B.st !== 'hide') { B.st = 'hide'; B.dur = 120 + Math.random() * 240; return; }
        if (Math.random() < 0.55) { B.st = 'peek'; B.x = lo + Math.round(Math.random() * (hi - lo)); B.looks = 2 + (Math.random() * 3 | 0); B.face = Math.random() < 0.5 ? 1 : -1; }
        else { B.st = 'run'; var fromLeft = Math.random() < 0.5; B.x = fromLeft ? lo : hi; B.tx = fromLeft ? hi : lo; B.face = fromLeft ? 1 : -1; }
    }
    function updateBoss() {
        B.t++;
        var hy = hideY();
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
    window.addEventListener('resize', size);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
    if (reduce) { drawHero(); return; }
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
