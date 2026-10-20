/* 404 page: "404 PAGE NOT FOUND" in pixel type, in an endless loop.
   1. The nav mascot (js/nav-hero.js) leaves the nav, swoops down and breathes fire;
      every pixel glows, chars and falls into a heap of ash. Then it flies home.
   2. A builder in a hard hat walks in, scoops up the ash and tosses the bricks back
      into place, row by row from the bottom, then walks off.
   3. A few seconds later the dragon comes back for it.
   On screens where the nav mascot is hidden, the dragon flies in from off-screen.
   prefers-reduced-motion: the text simply stays. */
(function () {
    var text = document.getElementById('px404');
    if (!text || !text.getContext) return;
    var tg = text.getContext('2d');

    /* ------------------------------------------------------------ pixel type */
    var FONT = {
        '4': ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
        '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
        'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
        'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
        'G': ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
        'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
        'N': ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
        'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
        'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
        'F': ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
        'U': ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
        'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
        ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000']
    };
    var BIG = 4, BIG_GAP = 8, LINE_GAP = 7, ASH_ROOM = 11, PAD = 2;
    var bigW = 3 * 5 * BIG + 2 * BIG_GAP, small = 'PAGE NOT FOUND', smallW = small.length * 6 - 1;
    var GW = Math.max(bigW, smallW) + PAD * 2 + 8, GH = 7 * BIG + LINE_GAP + 7 + ASH_ROOM + PAD;
    text.width = GW; text.height = GH;
    var FLOOR = GH - 1;

    var INK = '#0A0A0A';
    var BURN = ['#ffffff', '#fff4c2', '#fee761', '#feae34', '#f77622', '#e43b44', '#7a2a2a', '#2a1a1a'];
    var ASH = ['#8e8e8e', '#a7a7a7', '#6f6f6f', '#bdbdbd'];

    // cells: one per pixel of the type. bricks: the groups the builder throws back
    // (a 4x4 block of a big digit, or one row of a small letter).
    var cells = [], bricks = [], grid = {};
    (function layout() {
        var bx = Math.floor((GW - bigW) / 2);
        '404'.split('').forEach(function (ch, i) {
            FONT[ch].forEach(function (row, ry) { for (var rx = 0; rx < 5; rx++) if (row[rx] === '1') {
                var b = { cells: [] };
                for (var sy = 0; sy < BIG; sy++) for (var sx = 0; sx < BIG; sx++)
                    b.cells.push({ x: bx + i * (5 * BIG + BIG_GAP) + rx * BIG + sx, y: PAD + ry * BIG + sy, st: 0, t: 0 });
                bricks.push(b);
            } });
        });
        var sx0 = Math.floor((GW - smallW) / 2), sy0 = PAD + 7 * BIG + LINE_GAP;
        small.split('').forEach(function (ch, i) {
            FONT[ch].forEach(function (row, ry) {
                var b = { cells: [] };
                for (var rx = 0; rx < 5; rx++) if (row[rx] === '1') b.cells.push({ x: sx0 + i * 6 + rx, y: sy0 + ry, st: 0, t: 0 });
                if (b.cells.length) bricks.push(b);
            });
        });
        bricks.forEach(function (b) {
            var xs = b.cells.map(function (c) { return c.x; }), ys = b.cells.map(function (c) { return c.y; });
            b.x = Math.min.apply(null, xs); b.y = Math.min.apply(null, ys);
            b.w = Math.max.apply(null, xs) - b.x + 1; b.h = Math.max.apply(null, ys) - b.y + 1;
            b.cells.forEach(function (c) { cells.push(c); grid[c.x + ',' + c.y] = c; });
        });
    })();

    var ash = [], heap = new Array(GW).fill(0), smoke = [], dust = [], flying = [];
    var builder = null;

    function drawBuilder(b) {
        // 7 x 10 cells, facing right; mirrored when facing left
        var f = b.face, x0 = Math.round(b.x), y0 = FLOOR - 9 - Math.round(b.hop);
        function B(col, px, py, w, h) { tg.fillStyle = col; tg.fillRect(f > 0 ? x0 + px : x0 + 6 - px - (w || 1) + 1, y0 + py, w || 1, h || 1); }
        B('#f2c14e', 1, 0, 5, 1); B('#f2c14e', 0, 1, 7, 1); B('#c99a2e', 0, 1, 1, 1);          // hard hat
        B('#f2c299', 2, 2, 4, 2); B(INK, 4, 2); B('#e98f80', 5, 3);                             // face
        B('#f77622', 1, 4, 5, 3); B('#fff4c2', 1, 5, 5, 1);                                     // hi-vis vest
        if (b.throwing > 0) B('#f2c299', 5, 1, 1, 3);                                           // arm up
        else B('#f2c299', 6, 5, 1, 2);
        B('#2b6cb0', 1, 7, 5, 1);                                                               // jeans
        if (b.step) { B('#2b6cb0', 1, 8, 2, 1); B('#2b6cb0', 4, 8, 2, 1); B('#3a2a1c', 0, 9, 2, 1); B('#3a2a1c', 5, 9, 2, 1); }
        else { B('#2b6cb0', 2, 8, 3, 1); B('#3a2a1c', 2, 9, 3, 1); }
    }

    function drawText() {
        tg.clearRect(0, 0, GW, GH);
        cells.forEach(function (c) {
            if (c.st === 2) return;
            tg.fillStyle = c.st === 0 ? INK : BURN[Math.min(BURN.length - 1, (c.t / 5) | 0)];
            tg.fillRect(c.x, c.y, 1, 1);
        });
        for (var x = 0; x < GW; x++) for (var h = 0; h < heap[x]; h++) { tg.fillStyle = ASH[(x * 7 + h * 13 + (x * h) % 5) % ASH.length]; tg.fillRect(x, FLOOR - h, 1, 1); }
        ash.forEach(function (a) { tg.fillStyle = a.c; tg.fillRect(Math.round(a.x), Math.round(a.y), 1, 1); });
        smoke.forEach(function (s) { tg.fillStyle = s.life > 20 ? 'rgba(120,120,120,.55)' : 'rgba(150,150,150,.3)'; tg.fillRect(Math.round(s.x), Math.round(s.y), 1, 1); });
        dust.forEach(function (d) { tg.fillStyle = d.life > 6 ? '#bdbdbd' : '#dedede'; tg.fillRect(Math.round(d.x), Math.round(d.y), 1, 1); });
        flying.forEach(function (f) { tg.fillStyle = INK; tg.fillRect(Math.round(f.x), Math.round(f.y), f.b.w, f.b.h); });
        if (builder) drawBuilder(builder);
    }
    drawText();

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    /* --------------------------------------------------------------- burning */
    function ignite(c) { if (c && c.st === 0) { c.st = 1; c.t = 0; } }
    function count(st) { var n = 0; for (var i = 0; i < cells.length; i++) if (cells[i].st === st) n++; return n; }
    function updateParticles(spread) {
        cells.forEach(function (c) {
            if (c.st !== 1) return;
            c.t++;
            if (c.t > 4 && Math.random() < spread) ignite(grid[(c.x + (Math.random() < 0.5 ? 1 : -1)) + ',' + c.y]);
            if (c.t > 4 && Math.random() < spread * 0.6) ignite(grid[c.x + ',' + (c.y + (Math.random() < 0.5 ? 1 : -1))]);
            if (c.t >= BURN.length * 5) {
                c.st = 2;
                if (Math.random() < 0.2) smoke.push({ x: c.x, y: c.y, vx: (Math.random() - 0.3) * 0.15, vy: -0.12 - Math.random() * 0.1, life: 30 + Math.random() * 20 });
                else ash.push({ x: c.x, y: c.y, vx: (Math.random() - 0.5) * 0.12, vy: -0.05, c: ASH[(Math.random() * ASH.length) | 0] });
            }
        });
        for (var i = ash.length - 1; i >= 0; i--) {
            var a = ash[i]; a.vy = Math.min(0.6, a.vy + 0.025); a.x += a.vx + Math.sin((a.y + i) * 0.7) * 0.05; a.y += a.vy;
            var col = Math.max(0, Math.min(GW - 1, Math.round(a.x)));
            if (a.y >= FLOOR - heap[col]) {
                // ash slides downhill until it rests, so the heap forms soft mounds
                for (var slide = 0; slide < 12; slide++) {
                    var l = col > 0 ? heap[col - 1] : 99, r = col < GW - 1 ? heap[col + 1] : 99;
                    if (l < heap[col] && l <= r) col--; else if (r < heap[col]) col++; else break;
                }
                if (heap[col] < ASH_ROOM - 3 && Math.random() < 0.5) heap[col]++;
                ash.splice(i, 1);
            }
        }
        for (var j = smoke.length - 1; j >= 0; j--) { var s = smoke[j]; s.x += s.vx; s.y += s.vy; if (--s.life <= 0 || s.y < 0) smoke.splice(j, 1); }
        for (var k = dust.length - 1; k >= 0; k--) { var d = dust[k]; d.x += d.vx; d.y += d.vy; d.vy += 0.03; if (--d.life <= 0) dust.splice(k, 1); }
    }

    /* --------------------------------------------------------------- builder */
    var queue = [];
    function startBuild() {
        // bottom rows first, alternating direction each row so the builder sweeps back and forth
        var rows = {};
        bricks.forEach(function (b) { (rows[b.y + b.h] = rows[b.y + b.h] || []).push(b); });
        var keys = Object.keys(rows).map(Number).sort(function (a, b) { return b - a; });
        queue = [];
        keys.forEach(function (k, i) { rows[k].sort(function (a, b) { return i % 2 ? b.x - a.x : a.x - b.x; }); queue = queue.concat(rows[k]); });
        builder = { x: -8, face: 1, step: 0, t: 0, hop: 0, throwing: 0, cool: 0, done: 0 };
    }
    // each brick uses up some ash from the heap nearest the builder
    function scoop(near, amount) {
        for (var n = 0; n < amount; n++) {
            var best = -1;
            for (var d = 0; d < GW && best < 0; d++) {
                if (heap[near - d] > 0) best = near - d; else if (heap[near + d] > 0) best = near + d;
            }
            if (best < 0) return;
            heap[best]--;
        }
    }
    function updateBuilder() {
        var b = builder;
        b.t++;
        if (b.throwing > 0) b.throwing--;
        if (b.hop > 0) b.hop = Math.max(0, b.hop - 0.25);
        if (queue.length) {
            var next = queue[0], target = Math.max(0, Math.min(GW - 7, next.x + next.w / 2 - 3));
            if (Math.abs(target - b.x) > 20) {
                b.face = target > b.x ? 1 : -1; b.x += b.face * 0.8;
                if (b.t % 5 === 0) b.step = 1 - b.step;
            } else if (--b.cool <= 0) {
                queue.shift();
                b.face = next.x + next.w / 2 >= b.x + 3 ? 1 : -1; b.throwing = 5; b.cool = next.w >= 4 && next.h > 1 ? 6 : 2; b.step = 0;
                scoop(Math.round(b.x + 3), next.w >= 4 ? 3 : 1);
                var hx = b.x + (b.face > 0 ? 5 : 1), hy = FLOOR - 9;
                flying.push({ b: next, sx: hx, sy: hy, x: hx, y: hy, t: 0, T: 14 + Math.round(Math.hypot(next.x - hx, next.y - hy) / 4) });
            }
        } else if (!flying.length) {
            // finished: a little celebration hop, then off to the right
            b.done++;
            if (b.done === 1 || b.done === 14) b.hop = 3;
            if (b.done > 30) {
                b.face = 1; b.x += 0.6; if (b.t % 5 === 0) b.step = 1 - b.step;
                for (var i = 0; i < 2; i++) { var c = (Math.random() * GW) | 0; if (heap[c] > 0) heap[c]--; }   // the wind takes the last ash
            }
            if (b.x > GW + 2) { builder = null; heap.fill(0); }
        }
        for (var j = flying.length - 1; j >= 0; j--) {
            var f = flying[j]; f.t++;
            var k = Math.min(1, f.t / f.T);
            f.x = f.sx + (f.b.x - f.sx) * k; f.y = f.sy + (f.b.y - f.sy) * k - Math.sin(k * Math.PI) * 12;
            if (k >= 1) {
                f.b.cells.forEach(function (c) { c.st = 0; c.t = 0; });
                for (var m = 0; m < 3; m++) dust.push({ x: f.b.x + Math.random() * f.b.w, y: f.b.y + f.b.h, vx: (Math.random() - 0.5) * 0.4, vy: -0.2, life: 10 });
                flying.splice(j, 1);
            }
        }
    }

    /* ---------------------------------------------------------------- dragon */
    var NH = null, SP = null, FIRE = BURN;
    var over = document.createElement('canvas');
    over.setAttribute('aria-hidden', 'true');
    over.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:70';
    document.body.appendChild(over);
    var og = over.getContext('2d');
    function fitOverlay() {
        var r = window.devicePixelRatio || 1;
        over.width = Math.round(innerWidth * r); over.height = Math.round(innerHeight * r);
        og.setTransform(r, 0, 0, r, 0, 0); og.imageSmoothingEnabled = false;
    }
    fitOverlay();
    window.addEventListener('resize', fitOverlay);

    var Dg = { x: 0, y: 0, sc: 2, targetSc: 3, face: 1, flap: 0, st: 'off', t: 0, from: null, fromSc: 2, to: null };
    var flames = [];

    function cellPx() { var r = text.getBoundingClientRect(); return { r: r, u: r.width / GW }; }
    function hoverSpot(phase) {
        var m = cellPx(), sc = Dg.targetSc, w = SP.FW * sc;
        var x = Math.max(6, m.r.left + (Math.floor((GW - smallW) / 2) - 2) * m.u - w * 0.75);
        var lo = m.r.top + PAD * m.u - SP.MOUTH_Y * sc, hi = m.r.top + (PAD + 7 * BIG + LINE_GAP + 6) * m.u - SP.MOUTH_Y * sc;
        return { x: x, y: lo + (hi - lo) * phase };
    }
    function offscreen() { return { x: innerWidth + 40, y: -80 }; }
    function lerp(a, b, k) { return a + (b - a) * k; }
    function ease(k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }

    function summon() {
        var o = NH.origin();
        Dg.targetSc = innerWidth < 640 ? 2 : 3;
        if (o) { NH.hold(); Dg.from = { x: o.x, y: o.y }; Dg.fromSc = SP.scale; Dg.face = o.face; }
        else { Dg.from = offscreen(); Dg.fromSc = Dg.targetSc; Dg.face = -1; }
        Dg.x = Dg.from.x; Dg.y = Dg.from.y; Dg.sc = Dg.fromSc;
        Dg.st = 'swoop'; Dg.t = 0;
    }
    function updateDragon() {
        Dg.t++; Dg.flap += Dg.st === 'breathe' ? 0.6 : 1.3;
        if (Dg.st === 'swoop') {
            var T = 80, k = ease(Math.min(1, Dg.t / T)), to = hoverSpot(0);
            Dg.x = lerp(Dg.from.x, to.x, k); Dg.y = lerp(Dg.from.y, to.y, k) - Math.sin(k * Math.PI) * 40;
            Dg.sc = lerp(Dg.fromSc, Dg.targetSc, k);
            Dg.face = to.x >= Dg.from.x ? 1 : -1;
            if (Dg.t >= T) { Dg.face = 1; Dg.st = 'windup'; Dg.t = 0; }
        } else if (Dg.st === 'windup') {
            var h0 = hoverSpot(0); Dg.x = h0.x - Math.min(Dg.t, 10) * 0.6; Dg.y = h0.y;
            if (Dg.t >= 16) { Dg.st = 'breathe'; Dg.t = 0; }
        } else if (Dg.st === 'breathe') {
            var B = 170, ph = 0.5 - 0.5 * Math.cos(Math.min(1, Dg.t / B) * Math.PI * 2);   // sweep down and back up
            var hs = hoverSpot(ph); Dg.x = hs.x; Dg.y = hs.y;
            if (Dg.t <= B) for (var n = 0; n < 3; n++) flames.push({ x: Dg.x + SP.MOUTH_X * Dg.sc, y: Dg.y + (SP.MOUTH_Y + (Math.random() - 0.5) * 1.5) * Dg.sc, vx: (2.6 + Math.random() * 1.2) * Dg.sc, vy: (Math.random() - 0.5) * 0.35 * Dg.sc, age: 0, heat: 3 });
            if (Dg.t > B + 25) { Dg.st = 'admire'; Dg.t = 0; }
        } else if (Dg.st === 'admire') {
            var ha = hoverSpot(0.5); Dg.x = ha.x; Dg.y = lerp(Dg.y, ha.y, 0.05);
            if (Dg.t % 40 === 20) for (var m = 0; m < 3; m++) flames.push({ x: Dg.x + SP.MOUTH_X * Dg.sc, y: Dg.y + 5 * Dg.sc, vx: 0.3, vy: -0.6, age: 14, heat: 0, puff: true });
            if (Dg.t > 70 && !count(0)) { Dg.st = 'home'; Dg.t = 0; Dg.from = { x: Dg.x, y: Dg.y }; Dg.fromSc = Dg.sc; Dg.to = NH.home() || offscreen(); }
        } else if (Dg.st === 'home') {
            var T2 = 90, k3 = ease(Math.min(1, Dg.t / T2)), home = NH.home(), to2 = home || Dg.to;
            Dg.x = lerp(Dg.from.x, to2.x, k3); Dg.y = lerp(Dg.from.y, to2.y, k3) - Math.sin(k3 * Math.PI) * 30;
            Dg.sc = lerp(Dg.fromSc, home ? SP.scale : Dg.targetSc, k3);
            Dg.face = to2.x >= Dg.from.x ? 1 : -1;
            if (Dg.t >= T2) { Dg.st = 'off'; if (home) NH.release(Dg.face); }
        }
        // flames travel, ignite what they touch, and burn out
        var px = cellPx();
        for (var i = flames.length - 1; i >= 0; i--) {
            var f = flames[i]; f.x += f.vx; f.y += f.vy; f.age++;
            if (!f.puff) {
                var cx = Math.floor((f.x - px.r.left) / px.u), cy = Math.floor((f.y - px.r.top) / px.u);
                for (var dy = -1; dy <= 1 && f.heat > 0; dy++) { var c = grid[cx + ',' + (cy + dy)]; if (c && c.st === 0) { ignite(c); f.heat--; } }
            }
            if (f.age > (f.puff ? 40 : 52) || (f.heat <= 0 && Math.random() < 0.3)) flames.splice(i, 1);
        }
    }
    function drawDragon() {
        og.clearRect(0, 0, innerWidth, innerHeight);
        flames.forEach(function (f) {
            var sz = Math.max(1, Math.round((f.age < 20 ? 2 : 1) * Dg.sc));
            og.fillStyle = f.puff ? (f.age > 28 ? '#9aa39a' : '#c9d0c9') : FIRE[Math.min(FIRE.length - 1, (f.age / 9) | 0)];
            og.fillRect(Math.round(f.x), Math.round(f.y), sz, sz);
        });
        if (Dg.st === 'off') return;
        var jaw = Dg.st === 'breathe' && Dg.t <= 170 ? 1 : 0;
        var spr = SP.FLY[((Dg.flap / 6) | 0) % 4][jaw][Dg.face > 0 ? 'r' : 'l'];
        var bob = Math.round(Math.sin(Dg.flap / 9) * Dg.sc);
        og.drawImage(spr, Math.round(Dg.x), Math.round(Dg.y) + bob, Math.round(SP.FW * Dg.sc), Math.round(SP.FH * Dg.sc));
    }

    /* ----------------------------------------------------------------- cycle */
    // intact -> burn (dragon) -> settle (ash falls) -> build (builder) -> intact ...
    var phase = 'intact', phaseT = 0, INTACT_FIRST = 90, INTACT = 240;
    var first = true;
    function setPhase(p) { phase = p; phaseT = 0; }
    function step() {
        phaseT++;
        var after = Dg.st === 'admire' || Dg.st === 'home' || Dg.st === 'off';
        if (phase === 'intact') {
            if (phaseT >= (first ? INTACT_FIRST : INTACT)) { first = false; summon(); setPhase('burn'); }
        } else if (phase === 'burn') {
            // once the breath has passed, the fire spreads through whatever is left
            if (after && Math.random() < 0.15) { var rest = cells.filter(function (c) { return c.st === 0; }); if (rest.length) ignite(rest[(Math.random() * rest.length) | 0]); }
            if (Dg.st === 'off' && !flames.length && !count(1) && !ash.length) setPhase('settle');
        } else if (phase === 'settle') {
            if (phaseT >= 45) { startBuild(); setPhase('build'); }
        } else if (phase === 'build') {
            if (!builder) setPhase('intact');
        }
        if (Dg.st !== 'off' || flames.length) updateDragon();
        if (builder) updateBuilder();
        updateParticles(phase === 'burn' && after ? 0.09 : 0.035);
    }

    var last = 0, acc = 0, STEP = 1000 / 60;
    function frame(now) {
        acc += Math.min(100, now - last); last = now;
        while (acc >= STEP) { acc -= STEP; step(); }
        drawText(); drawDragon();
        requestAnimationFrame(frame);
    }

    // nav-hero.js loads after this script; start once it exists
    window.addEventListener('load', function () {
        NH = window.navHero; SP = NH && NH.sprites;
        if (!SP) return;
        FIRE = SP.FIRE;
        last = performance.now();
        requestAnimationFrame(frame);
    });
})();
