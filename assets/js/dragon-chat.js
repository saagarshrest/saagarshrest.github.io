/* Dragon chat: click the nav dragon to ask about the site.
 * No language model. Replies come from
 *   1. assets/data/dragon-answers.json  hand-written answers, matched by example questions + keywords
 *   2. assets/data/dragon-index.json    every page's text (tools/build-dragon-index.py), searched with BM25
 *   3. a polite fallback for anything else.
 * Both files load on first open only. */
(function () {
    'use strict';
    var EMAIL = 'saagarshrest@gmail.com';
    var WA = 'https://wa.me/9779860332656';
    var STORE = 'dragon-chat-v1';

    var STOP = new Set(('a an the and or but if of to in on at for from by with about into over as is are was were be been being am ' +
        'do does did doing have has had can could would should will shall may might must i me my we our us your yours ' +
        'he him his she her they them their it its this that these those there here what which whom whose ' +
        'please tell show give know want need like just also any some much many more most very really get got let ' +
        'saagar saagars shrestha s t im ive id dont doesnt isnt whats hows wheres not no yes so than then too').split(' '));
    STOP.delete('shrestha');

    function stem(w) {
        if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
        if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
        if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
        if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
        return w;
    }
    function words(s) {
        return String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9$]+/g, ' ').trim().split(' ').filter(Boolean);
    }
    function tokens(s) {
        return words(s).filter(function (w) { return !STOP.has(w); }).map(stem);
    }
    function lev1(a, b) {               // true when edit distance <= 1
        if (Math.abs(a.length - b.length) > 1) return false;
        var i = 0, j = 0, e = 0;
        while (i < a.length && j < b.length) {
            if (a[i] === b[j]) { i++; j++; continue; }
            if (++e > 1) return false;
            if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
        }
        return e + (a.length - i) + (b.length - j) <= 1;
    }
    function same(a, b) { return a === b || (a.length >= 5 && b.length >= 5 && lev1(a, b)); }
    function has(list, t) { for (var i = 0; i < list.length; i++) if (same(list[i], t)) return true; return false; }

    /* ---------------- knowledge ---------------- */
    var data = null, loading = null;
    function load() {
        if (loading) return loading;
        loading = Promise.all([
            fetch('/assets/data/dragon-answers.json').then(function (r) { return r.json(); }),
            fetch('/assets/data/dragon-index.json').then(function (r) { return r.json(); })
        ]).then(function (res) {
            var A = res[0], docs = res[1];
            A.intents.forEach(function (it) {
                it._q = (it.q || []).map(tokens).filter(function (t) { return t.length; });
                it._k = (it.k || []).map(function (k) { return k.indexOf(' ') > -1 ? { phrase: ' ' + words(k).join(' ') + ' ' } : { t: stem(words(k)[0] || '') }; });
            });
            var df = Object.create(null), pages = Object.create(null), total = 0;
            docs.forEach(function (d) {
                // file names carry aliases the page text may not ("Casedetailhvac" -> hvac)
                var file = d.url.split('#')[0].replace(/\.html$/, '').replace(/casedetail|case(?=|$)/gi, ' ');
                var head = tokens(d.page + ' ' + d.h + ' ' + file), body = tokens(d.t);
                d._tf = Object.create(null);
                head.forEach(function (t) { d._tf[t] = (d._tf[t] || 0) + 2; });
                body.forEach(function (t) { d._tf[t] = (d._tf[t] || 0) + 1; });
                d._len = head.length * 2 + body.length;
                total += d._len;
                var pg = d.url.split('#')[0];
                Object.keys(d._tf).forEach(function (t) {
                    df[t] = (df[t] || 0) + 1;
                    (pages[t] || (pages[t] = Object.create(null)))[pg] = 1;
                });
            });
            var pdf = Object.create(null);
            Object.keys(pages).forEach(function (t) { pdf[t] = Object.keys(pages[t]).length; });
            data = { A: A, docs: docs, df: df, pdf: pdf, avg: total / Math.max(1, docs.length), terms: Object.keys(df) };
            return data;
        }).catch(function (e) { loading = null; throw e; });
        return loading;
    }

    function matchIntent(q) {
        var qt = tokens(q), flat = ' ' + words(q).join(' ') + ' ';
        if (!qt.length) qt = words(q).map(stem);
        if (!qt.length) return null;
        var best = null, bestScore = 0;
        data.A.intents.forEach(function (it) {
            var ex = 0;
            it._q.forEach(function (et) {
                var hit = 0;
                et.forEach(function (t) { if (has(qt, t)) hit++; });
                var qhit = 0;
                qt.forEach(function (t) { if (has(et, t)) qhit++; });
                ex = Math.max(ex, 0.5 * hit / et.length + 0.5 * qhit / qt.length);
            });
            var kw = 0;
            it._k.forEach(function (k) {
                if (k.phrase ? flat.indexOf(k.phrase) > -1 : (k.t && has(qt, k.t))) kw++;
            });
            var score = ex + 0.35 * Math.min(kw, 2);
            if (it.id === 'hello' || it.id === 'thanks') score *= qt.length > 2 ? 0.5 : 0.85;
            if (score > bestScore) { bestScore = score; best = it; }
        });
        return bestScore >= 0.7 ? best : null;
    }

    function search(q) {
        var qt = Array.from(new Set(Array.isArray(q) ? q : tokens(q)));
        if (!qt.length) return [];
        // let near-miss spellings ("availble") count as the indexed word
        var terms = qt.map(function (t) {
            if (data.df[t]) return t;
            if (t.length < 5) return t;
            for (var i = 0; i < data.terms.length; i++) if (lev1(t, data.terms[i])) return data.terms[i];
            return t;
        });
        var N = data.docs.length, k1 = 1.2, b = 0.75, res = [];
        data.docs.forEach(function (d) {
            var s = 0, hit = 0;
            terms.forEach(function (t) {
                var f = d._tf[t];
                if (!f) return;
                hit++;
                var idf = Math.log(1 + (N - data.df[t] + 0.5) / (data.df[t] + 0.5));
                s += idf * f * (k1 + 1) / (f + k1 * (1 - b + b * d._len / data.avg));
            });
            if (hit && hit >= Math.ceil(terms.length * 0.6)) res.push({ d: d, s: s, terms: terms });
        });
        res.sort(function (x, y) { return y.s - x.s; });
        return res[0] && res[0].s > 2.2 ? res : [];
    }

    function snippet(text, terms) {
        var low = text.toLowerCase(), at = -1;
        terms.forEach(function (t) { var i = low.indexOf(t); if (i > -1 && (at < 0 || i < at)) at = i; });
        if (at < 120 || text.length <= 240) return text.length > 240 ? text.slice(0, 240).replace(/\s+\S*$/, '') + '…' : text;
        var start = text.lastIndexOf('. ', at - 1);
        start = start > at - 160 && start > -1 ? start + 2 : Math.max(0, at - 80);
        var s = text.slice(start, start + 240).replace(/\s+\S*$/, '');
        return (start > 0 ? '…' : '') + s + '…';
    }

    // rare words the intent doesn't know about ("hvac", "accessibility") mean the visitor wants a specific page
    function specific(q, it) {
        var vocab = [];
        it._q.forEach(function (t) { vocab = vocab.concat(t); });
        it._k.forEach(function (k) { if (k.t) vocab.push(k.t); });
        return tokens(q).filter(function (t) {
            return t.length >= 4 && !has(vocab, t) && data.pdf[t] && data.pdf[t] <= 3;
        });
    }
    function short(title) { return title.split(/:| — | \| /)[0].trim(); }

    function answer(q) {
        var it = matchIntent(q);
        var hits = search(q);
        if (it) {
            var rare = specific(q, it);
            if (rare.length) hits = search(rare);
            if (!rare.length || !hits.length) return { text: it.a, links: it.links || [] };
        }
        if (hits.length) {
            var top = hits[0].d, seen = {}, links = [];
            hits.forEach(function (h) {
                var page = h.d.url.split('#')[0];
                if (seen[page] || links.length >= 3) return;
                seen[page] = 1;
                links.push({ label: links.length ? short(h.d.page) : 'Open ' + short(top.page), href: h.d.url });
            });
            // a hero line like "Case study · Mobile app · 2020" says little; use a fuller section of the same page
            var pick = hits[0];
            if (top.t.length < 120) data.docs.some(function (d) {
                if (d.url.split('#')[0] === top.url.split('#')[0] && d.t.length >= 120) { pick = { d: d, terms: hits[0].terms }; return true; }
            });
            var lead = short(top.page) + (pick.d.h && pick.d.h !== pick.d.page ? ' · ' + pick.d.h : '');
            return { text: 'From ' + lead + ':\n\n' + snippet(pick.d.t, pick.terms), links: links };
        }
        return { text: data.A.fallback, links: data.A.fallbackLinks || [] };
    }

    /* ---------------- UI ---------------- */
    var css = '' +
        '#dgc{position:fixed;inset:0;z-index:2147483646;display:none;font-family:"Inter Tight",Inter,system-ui,sans-serif;color:#0A0A0A}' +
        '#dgc.open{display:block}' +
        '#dgc .dgc-scrim{position:absolute;inset:0;background:rgba(10,10,10,.35)}' +
        '#dgc .dgc-card{position:absolute;left:0;right:0;bottom:0;height:min(78vh,620px);background:#fff;border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;border:1.5px solid #0A0A0A;border-bottom:0;animation:dgc-in .28s cubic-bezier(.16,1,.3,1)}' +
        '@media (min-width:640px){#dgc{inset:auto;top:0;right:0;width:0;height:0}#dgc .dgc-scrim{display:none}' +
        '#dgc .dgc-card{position:fixed;left:auto;bottom:auto;top:88px;right:24px;width:400px;height:min(600px,calc(100vh - 112px));border-radius:20px;border-bottom:1.5px solid #0A0A0A}}' +
        '@keyframes dgc-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
        '#dgc .dgc-head{display:flex;align-items:center;gap:12px;padding:16px 16px 14px 18px;border-bottom:1px solid rgba(10,10,10,.12)}' +
        '#dgc .dgc-av{width:54px;height:32px;image-rendering:pixelated;flex:none}' +
        '#dgc .dgc-title{font-size:1.25rem;font-weight:600;letter-spacing:-.02em;line-height:1.1}' +
        '#dgc .dgc-title em{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;font-size:1.4rem}' +
        '#dgc .dgc-sub{font-size:.75rem;color:rgba(10,10,10,.55);margin-top:2px}' +
        '#dgc .dgc-x{margin-left:auto;width:36px;height:36px;border:0;background:none;font-size:1.6rem;line-height:1;cursor:pointer;color:#0A0A0A;border-radius:10px}' +
        '#dgc .dgc-x:hover{background:#F2F2F2}' +
        '#dgc .dgc-log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:18px;display:flex;flex-direction:column;gap:12px}' +
        '#dgc .dgc-m{max-width:88%;font-size:.95rem;line-height:1.55;white-space:pre-line;padding:11px 14px;border-radius:14px}' +
        '#dgc .dgc-m.bot{align-self:flex-start;background:#F2F2F2;border-top-left-radius:4px}' +
        '#dgc .dgc-m.you{align-self:flex-end;background:#0A0A0A;color:#fff;border-top-right-radius:4px}' +
        '#dgc .dgc-acts{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;white-space:normal}' +
        '#dgc .dgc-act{font:inherit;font-size:.88rem;font-weight:600;color:#0A0A0A;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}' +
        '#dgc .dgc-act:hover{text-decoration-thickness:2px}' +
        '#dgc .dgc-sugs{align-self:stretch;display:flex;flex-direction:column;border-top:1px solid rgba(10,10,10,.12)}' +
        '#dgc .dgc-sug{font:inherit;font-size:.9rem;text-align:left;background:none;border:0;border-bottom:1px solid rgba(10,10,10,.12);padding:10px 2px;cursor:pointer;color:#0A0A0A;display:flex;justify-content:space-between}' +
        '#dgc .dgc-sug::after{content:"\\2192";opacity:.5}' +
        '#dgc .dgc-sug:hover::after{opacity:1}' +
        '#dgc .dgc-dots{align-self:flex-start;padding:11px 14px;background:#F2F2F2;border-radius:4px 14px 14px 14px;letter-spacing:3px;font-weight:700;animation:dgc-blink 1s infinite}' +
        '@keyframes dgc-blink{50%{opacity:.35}}' +
        '#dgc form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(10,10,10,.12)}' +
        '#dgc input{flex:1;min-width:0;font:inherit;font-size:16px;padding:11px 14px;border:1.5px solid rgba(10,10,10,.2);border-radius:12px;outline:none;color:#0A0A0A;background:#fff}' +
        '#dgc input:focus{border-color:#0A0A0A}' +
        '#dgc .dgc-send{font:inherit;font-weight:600;font-size:.9rem;padding:0 18px;border-radius:12px;border:1.5px solid #0A0A0A;background:#0A0A0A;color:#fff;cursor:pointer}' +
        '#dgc .dgc-send:hover{background:#fff;color:#0A0A0A}' +
        '';

    var root, log, input, history = [], built = false;

    function save() { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-30))); } catch (e) { } }
    function restore() { try { return JSON.parse(sessionStorage.getItem(STORE) || '[]') || []; } catch (e) { return []; } }

    function avatar() {
        try {
            var c = window.navHero && window.navHero.sprites && window.navHero.sprites.FLY[0][0].r;
            if (c) return '<img class="dgc-av" alt="" src="' + c.toDataURL() + '">';
        } catch (e) { }
        return '';
    }

    function build() {
        if (built) return;
        built = true;
        var st = document.createElement('style');
        st.textContent = css;
        document.head.appendChild(st);
        root = document.createElement('div');
        root.id = 'dgc';
        root.innerHTML =
            '<div class="dgc-scrim"></div>' +
            '<section class="dgc-card" role="dialog" aria-modal="true" aria-labelledby="dgc-t">' +
            '<header class="dgc-head">' + avatar() +
            '<div><div class="dgc-title" id="dgc-t">Ask the <em>dragon</em></div><div class="dgc-sub">Answers come only from this site</div></div>' +
            '<button class="dgc-x" type="button" aria-label="Close chat">&times;</button></header>' +
            '<div class="dgc-log" aria-live="polite"></div>' +
            '<form autocomplete="off"><label for="dgc-in" class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Your question</label>' +
            '<input id="dgc-in" type="text" maxlength="200" placeholder="Ask about work, rates, contact…">' +
            '<button class="dgc-send" type="submit">Send</button></form>' +
            '</section>';
        document.body.appendChild(root);
        log = root.querySelector('.dgc-log');
        input = root.querySelector('input');
        var card = root.querySelector('.dgc-card');
        // pager.js listens on window; keep scrolling and typing in here from flipping slides
        ['wheel', 'touchstart', 'touchmove', 'touchend', 'keydown'].forEach(function (ev) {
            root.addEventListener(ev, function (e) {
                if (ev === 'keydown' && e.key === 'Escape') { close(); return; }
                e.stopPropagation();
            }, { passive: true });
        });
        root.querySelector('.dgc-x').addEventListener('click', close);
        root.querySelector('.dgc-scrim').addEventListener('click', close);
        root.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault();
            ask(input.value);
        });
        card.addEventListener('click', function (e) {
            var b = e.target.closest('[data-act]');
            if (b) act(b);
        });
        document.addEventListener('mousedown', function (e) {
            if (root.classList.contains('open') && !card.contains(e.target) && !onDragon(e.clientX, e.clientY)) close();
        });

        history = restore();
        if (history.length) history.forEach(function (m) { render(m, true); });
        else greet();
    }

    function greet() {
        var g = { who: 'bot', text: 'Rawr, hello! I\'m Saagar\'s dragon. Ask me about his work, services, rates or how to reach him.' };
        load().then(function (d) {
            if (d.A.greeting) g.text = d.A.greeting;
            render(g); history.push(g); save();
            sugs(d.A.suggestions || []);
        }, function () { render(g); });
    }

    function sugs(list) {
        var box = document.createElement('div');
        box.className = 'dgc-sugs';
        list.forEach(function (s) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'dgc-sug'; b.textContent = s;
            b.addEventListener('click', function () { box.remove(); ask(s); });
            box.appendChild(b);
        });
        log.appendChild(box);
        log.scrollTop = log.scrollHeight;
    }

    function render(m, instant) {
        var el = document.createElement('div');
        el.className = 'dgc-m ' + m.who;
        el.textContent = m.text;
        if (m.links && m.links.length) {
            var acts = document.createElement('div');
            acts.className = 'dgc-acts';
            m.links.forEach(function (l) {
                var a;
                if (l.href) {
                    a = document.createElement('a');
                    a.href = l.href;
                    a.textContent = l.label + ' →';
                } else {
                    a = document.createElement('button');
                    a.type = 'button';
                    a.textContent = l.label;
                }
                a.className = 'dgc-act';
                a.setAttribute('data-act', l.action || 'link');
                acts.appendChild(a);
            });
            el.appendChild(acts);
        }
        if (!instant) el.style.animation = 'dgc-in .25s ease-out';
        log.appendChild(el);
        log.scrollTop = log.scrollHeight;
    }

    function act(b) {
        var kind = b.getAttribute('data-act');
        if (kind === 'copy-email') {
            var done = function () { var t = b.textContent; b.textContent = 'Copied!'; setTimeout(function () { b.textContent = t; }, 1600); };
            if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, function () { location.href = 'mailto:' + EMAIL; });
            else location.href = 'mailto:' + EMAIL;
        } else if (kind === 'whatsapp') {
            window.open(WA, '_blank', 'noopener');
        } else if (kind === 'link') {
            var u = new URL(b.href, location.href);
            if (u.pathname === location.pathname && u.hash) close();   // same page: let the anchor jump
        }
    }

    function ask(q) {
        q = String(q || '').trim();
        if (!q) return;
        input.value = '';
        var sug = log.querySelector('.dgc-sugs');
        if (sug) sug.remove();
        var you = { who: 'you', text: q };
        render(you); history.push(you);
        var dots = document.createElement('div');
        dots.className = 'dgc-dots'; dots.textContent = '···';
        log.appendChild(dots);
        log.scrollTop = log.scrollHeight;
        var t0 = Date.now();
        load().then(function () { return answer(q); }, function () {
            return { text: 'My notes didn\'t load. Check your connection and try again, or email Saagar directly.', links: [{ label: 'Copy email', action: 'copy-email' }] };
        }).then(function (r) {
            setTimeout(function () {
                dots.remove();
                var m = { who: 'bot', text: r.text, links: r.links };
                render(m); history.push(m); save();
            }, Math.max(0, 450 - (Date.now() - t0)));
        });
    }

    var lastFocus = null;
    function open() {
        build();
        lastFocus = document.activeElement;
        root.classList.add('open');
        document.documentElement.classList.remove('dragon-hover');
        load().catch(function () { });
        setTimeout(function () { input.focus({ preventScroll: true }); }, 30);
    }
    function close() {
        if (!root || !root.classList.contains('open')) return;
        root.classList.remove('open');
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
    function isOpen() { return !!root && root.classList.contains('open'); }

    /* The dragon canvases are pointer-events:none (the nav one overlaps the CTA button),
       so hit-test clicks against the dragon's painted pixels instead. */
    function onDragon(x, y) {
        var cs = document.querySelectorAll('.cta-hero, .cta-roam');
        for (var n = 0; n < cs.length; n++) {
            var c = cs[n], r = c.getBoundingClientRect();
            if (!r.width || x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
            var cx = Math.floor((x - r.left) * c.width / r.width);
            var cy = Math.floor((y - r.top) * c.height / r.height);
            try {
                var d = c.getContext('2d').getImageData(Math.max(0, cx - 1), Math.max(0, cy - 1), 3, 3).data;
                for (var i = 3; i < d.length; i += 4) if (d[i] > 0) return true;
            } catch (e) { }
        }
        return false;
    }

    var hover = document.createElement('style');
    hover.textContent = 'html.dragon-hover,html.dragon-hover *{cursor:pointer!important}';
    document.head.appendChild(hover);

    document.addEventListener('click', function (e) {
        if (isOpen() || !onDragon(e.clientX, e.clientY)) return;
        e.preventDefault();
        e.stopPropagation();
        open();
    }, true);
    document.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        document.documentElement.classList.toggle('dragon-hover', !isOpen() && onDragon(e.clientX, e.clientY));
    }, { passive: true });
    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-dragon-chat]');
        if (t) { e.preventDefault(); open(); }
    });

    window.openDragonChat = open;
    window.closeDragonChat = close;
    window.dragonAnswer = function (q) { return load().then(function () { return answer(q); }); };   // for testing
})();
