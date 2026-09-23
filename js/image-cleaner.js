/* =====================================================================
   Image cleaner page: remove hidden data (js/image-meta.js) or the
   background (IMG.LY model, loaded on demand). Nothing is uploaded.
   ===================================================================== */
import { scan, strip, personal } from './image-meta.js';

const BG_LIB = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm';
const EXIFR = 'https://cdn.jsdelivr.net/npm/exifr@7.1.3/dist/full.esm.mjs';
const MODELS = { fast: 'isnet_quint8', best: 'isnet_fp16' };
const EXT = { jpeg: 'jpg', png: 'png', webp: 'webp' };

const $ = (id) => document.getElementById(id);
const el = {
    drop: $('ic-drop'), file: $('ic-file'), pick: $('ic-pick'), work: $('ic-work'), tool: $('tool'),
    stage: $('ic-stage'), orig: $('ic-orig'), res: $('ic-res'), slider: $('ic-slider'), handle: $('ic-handle'), cmp: $('ic-cmp'), info: $('ic-fileinfo'),
    tabs: [$('tab-data'), $('tab-bg')], panes: [$('pane-data'), $('pane-bg')],
    sum: $('ic-sum'), facts: $('ic-facts'), more: $('ic-more'), blocks: $('ic-blocks'), keep: $('ic-keep'), keepRow: $('ic-keep-row'),
    clean: $('ic-clean'), cleanOut: $('ic-clean-out'), cleanOk: $('ic-clean-ok'), cleanNote: $('ic-clean-note'), cleanDl: $('ic-clean-dl'),
    cut: $('ic-cut'), progress: $('ic-progress'), bar: $('ic-bar'), status: $('ic-status'),
    cutOut: $('ic-cut-out'), swatches: $('ic-swatches'), color: $('ic-color'), cutDl: $('ic-cut-dl'), cutNote: $('ic-cut-note'),
    reset: $('ic-reset'), error: $('ic-error'),
};
if (!el.drop) throw new Error('image cleaner markup missing');

const S = { token: 0, file: null, bytes: null, info: null, base: 'image', urls: [], cleaned: false, cut: null, busy: false, bg: 'transparent' };
let bgLib = null, exifr = null;

// ---------- helpers ----------
const fmt = (n) => (n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB' : (n / 1048576).toFixed(1) + ' MB');   // number and unit stay on one line
const url = (blob) => { const u = URL.createObjectURL(blob); S.urls.push(u); return u; };
const node = (tag, props = {}, ...kids) => { const n = Object.assign(document.createElement(tag), props); n.append(...kids.filter((k) => k != null && k !== '')); return n; };
const show = (n, on = true) => { n.hidden = !on; };
function error(msg) { el.error.textContent = msg; show(el.error); }
function toBlob(canvas, type, q) { return new Promise((r, j) => canvas.toBlob((b) => (b ? r(b) : j(new Error('could not save the image'))), type, q)); }
function drawn(img) {                                                   // the image as the browser shows it (orientation applied)
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    return c;
}

// ---------- loading ----------
function reset() {
    S.token++;
    S.urls.forEach((u) => URL.revokeObjectURL(u)); S.urls = [];
    Object.assign(S, { file: null, bytes: null, info: null, cleaned: false, cut: null, bg: 'transparent' });
    el.orig.removeAttribute('src'); el.res.removeAttribute('src');
    [el.error, el.cleanOut, el.cutOut, el.progress, el.facts, el.more].forEach((n) => show(n, false));
    compare(false);
    el.facts.replaceChildren(); el.blocks.replaceChildren();
    el.slider.value = 50; el.stage.style.setProperty('--pos', '50%');
}

async function load(file) {
    if (!file || S.busy) return;
    show(el.error, false);
    if (!/^image\//.test(file.type) && !/\.(jpe?g|png|webp|gif|avif|bmp|heic|heif)$/i.test(file.name)) return error('That file is not an image. Choose a JPG, PNG or WebP.');
    if (file.size > 60 * 1048576) return error('That image is larger than 60 MB. Try a smaller one.');
    reset();
    const token = S.token;
    S.file = file;
    S.base = (file.name || 'image').replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '-').slice(0, 60) || 'image';
    S.bytes = new Uint8Array(await file.arrayBuffer());
    el.orig.src = url(file);
    try { await el.orig.decode(); } catch {
        reset(); showWork(false);
        return error("Your browser can't open this file. iPhone HEIC photos only open in Safari; elsewhere, share or export them as JPG first.");
    }
    if (token !== S.token) return;
    S.info = scan(S.bytes);
    const w = el.orig.naturalWidth, h = el.orig.naturalHeight;
    el.stage.style.setProperty('--ratio', w / h); el.cmp.style.setProperty('--ratio', w / h);
    el.info.textContent = `${file.name || 'Pasted image'} · ${w} × ${h} px · ${fmt(file.size)}`;
    showWork(true);
    renderFound();
    readDetails(file, token);
}
function showWork(on) {
    show(el.work, on); show(el.drop, !on);
    if (on) el.work.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------- hidden data: what is in the file ----------
function status(k) {
    const kept = k.kind === 'orientation' || (k.kind === 'icc' && el.keep.checked);
    return node('span', { className: 'st' + (kept ? ' keep' : ''), textContent: S.cleaned ? (kept ? 'Kept' : 'Removed') : (kept ? 'Keep' : 'Remove') });
}
function renderFound() {
    const { blocks, supported } = S.info;
    const found = personal(blocks), total = found.reduce((n, k) => n + k.size, 0);
    el.sum.textContent = !supported ? 'This format is saved again as PNG, which leaves out all hidden data.'
        : found.length ? `Found ${found.length} kind${found.length > 1 ? 's' : ''} of hidden data (${fmt(total)}).`
        : 'No hidden data found. This image is already clean.';
    el.blocks.replaceChildren(...blocks.map((k) => node('li', {}, node('span', { textContent: k.label }), node('span', { className: 'sz', textContent: fmt(k.size) }), status(k))));
    show(el.keepRow, blocks.some((k) => k.kind === 'icc'));
    el.clean.disabled = supported && !blocks.some((k) => k.kind !== 'orientation' && !(k.kind === 'icc' && el.keep.checked));
    el.clean.textContent = el.clean.disabled ? 'Nothing to remove' : 'Remove hidden data';
}

// readable highlights (camera, date, location...) via exifr; a bonus on top of the block list
const val = (v) => v == null ? '' : v instanceof Date ? (isNaN(v) ? '' : v.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }))
    : Array.isArray(v) ? v.map(val).filter(Boolean).join(', ') : typeof v === 'object' ? val(v.value ?? v.description ?? '') : String(v).replace(/\0/g, '').trim();
async function readDetails(file, token) {
    if (!personal(S.info.blocks).some((k) => ['exif', 'xmp', 'iptc'].includes(k.kind))) return;
    try {
        exifr = exifr || await import(EXIFR);
        const x = await exifr.parse(file, { tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: false, jfif: false, ihdr: false, interop: false, makerNote: false, userComment: false });
        if (token !== S.token || !x) return;
        const rows = [];
        if (typeof x.latitude === 'number' && typeof x.longitude === 'number' && (x.latitude || x.longitude)) {
            const la = x.latitude.toFixed(5), lo = x.longitude.toFixed(5);
            rows.push(['Location', node('span', {}, `${la}, ${lo} `, node('a', { href: `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=15/${la}/${lo}`, target: '_blank', rel: 'noopener noreferrer', textContent: 'map ↗' }),
                node('small', { textContent: 'Anyone with this file can see where it was taken.' })), true]);
        }
        const make = val(x.Make), model = val(x.Model);
        const settings = [x.FNumber && 'f/' + x.FNumber, x.ExposureTime && (x.ExposureTime < 1 ? '1/' + Math.round(1 / x.ExposureTime) : x.ExposureTime) + ' s', x.ISO && 'ISO ' + val(x.ISO)].filter(Boolean).join(' · ');
        rows.push(
            ['Camera', model && make && !model.toLowerCase().includes(make.split(' ')[0].toLowerCase()) ? make + ' ' + model : model || make],
            ['Lens', val(x.LensModel)],
            ['Taken', val(x.DateTimeOriginal || x.CreateDate || x.DateTime || x.ModifyDate)],
            ['Settings', settings],
            ['Serial no.', val(x.BodySerialNumber || x.SerialNumber || x.InternalSerialNumber)],
            ['Software', val(x.Software || x.CreatorTool)],
            ['Author', val(x.Artist || x.creator || x.Creator || x.OwnerName || x.CameraOwnerName || x['By-line'])],
            ['Copyright', val(x.Copyright || x.rights)],
            ['Description', val(x.ImageDescription || x.description || x.Caption || x.title)],
        );
        const shown = rows.filter((r) => r[1]);
        el.facts.replaceChildren(...shown.map(([k, v, alert]) => node('div', { className: alert ? 'is-alert' : '' }, node('dt', { textContent: k }), node('dd', {}, v))));
        show(el.facts, shown.length > 0);
        const n = Object.keys(x).length;
        el.more.textContent = `${n} detail${n === 1 ? '' : 's'} in total.`;
        show(el.more, n > shown.length);
    } catch { /* the block list above still shows what will be removed */ }
}

// ---------- hidden data: remove ----------
async function cleanImage() {
    if (S.busy || !S.info) return;
    let bytes = S.info.supported ? strip(S.bytes, { keepProfile: el.keep.checked }) : null, ext = EXT[S.info.format], saved = false;
    if (!bytes) { bytes = new Uint8Array(await (await toBlob(drawn(el.orig), 'image/png')).arrayBuffer()); ext = 'png'; saved = true; }
    const after = scan(bytes), left = personal(after.blocks);
    S.cleaned = true; renderFound();
    el.cleanOk.classList.toggle('is-warn', left.length > 0);
    el.cleanOk.textContent = left.length ? 'Some data could not be removed: ' + left.map((k) => k.label).join(', ') : 'Checked: the new file has no hidden data left.';
    const kept = [after.blocks.some((k) => k.kind === 'icc') && 'colour profile', after.blocks.some((k) => k.kind === 'orientation') && 'orientation'].filter(Boolean);
    el.cleanNote.textContent = [`${fmt(bytes.length)}, was ${fmt(S.bytes.length)}.`, kept.length && `Kept: ${kept.join(' and ')}.`, saved && 'Saved as PNG because this format cannot be cleaned in place.'].filter(Boolean).join(' ');
    el.cleanDl.href = url(new Blob([bytes], { type: 'image/' + (ext === 'jpg' ? 'jpeg' : ext) }));
    el.cleanDl.download = `${S.base}-clean.${ext}`;
    el.cleanDl.firstChild.nodeValue = `Download ${ext.toUpperCase()} `;
    show(el.cleanOut);
}

// ---------- background ----------
function progress(p, text) { el.bar.style.width = Math.round(Math.max(0, Math.min(1, p)) * 100) + '%'; el.status.textContent = text; }
async function cutOut() {
    if (S.busy || !S.file) return;
    S.busy = true; const token = S.token;
    el.cut.disabled = true; show(el.error, false); show(el.cutOut, false); show(el.progress); progress(0, 'Loading…');
    const got = {}; let best = 0;
    const onProgress = (key, cur, total) => {
        if (token !== S.token) return;
        if (key.startsWith('fetch:')) {
            got[key] = [cur, total];
            const [c, t] = Object.values(got).reduce((a, [x, y]) => [a[0] + x, a[1] + y], [0, 0]);
            best = Math.max(best, c / t);
            progress(best, `Downloading the AI model, first time only · ${Math.round(best * 100)}%`);
        } else if (key.startsWith('compute:')) progress((cur + 1) / (total + 1), 'Removing the background…');
    };
    try {
        bgLib = bgLib || await import(BG_LIB);
        const model = MODELS[document.querySelector('input[name="ic-model"]:checked')?.value] || MODELS.best;
        const input = EXT[S.info.format] ? S.file : await toBlob(drawn(el.orig), 'image/png');
        const blob = await bgLib.removeBackground(input, { model, device: 'gpu', output: { format: 'image/png' }, progress: onProgress });
        if (token !== S.token) return;
        S.cut = blob;
        el.res.src = url(blob);
        await el.res.decode();
        compare(true);
        await setBg('transparent');
        show(el.cutOut);
    } catch (e) {
        if (token === S.token) error('The background could not be removed (' + (e && e.message ? e.message : e) + '). Try the Fast model, a smaller image, or another browser.');
    } finally {
        S.busy = false; el.cut.disabled = false; show(el.progress, false);
    }
}
function compare(on) {
    const tabBg = el.tabs[1].getAttribute('aria-selected') === 'true';
    const vis = on !== false && !!S.cut && tabBg;
    [el.res, el.slider, el.handle, el.cmp].forEach((n) => show(n, vis));
}
let bgRun = 0;
async function setBg(bg) {
    if (!S.cut) return;
    S.bg = bg; const run = ++bgRun;
    el.swatches.querySelectorAll('button.ic-sw').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.bg === bg)));
    el.color.parentElement.style.boxShadow = bg.startsWith('#') && ![...el.swatches.querySelectorAll('button')].some((b) => b.dataset.bg === bg) ? '0 0 0 2px #fff, 0 0 0 4px #0A0A0A' : '';
    el.res.style.background = bg === 'transparent' ? '' : bg;
    let out = S.cut, ext = 'png';
    if (bg !== 'transparent') {
        const bmp = await createImageBitmap(S.cut), c = document.createElement('canvas');
        c.width = bmp.width; c.height = bmp.height;
        const ctx = c.getContext('2d'); ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(bmp, 0, 0);
        out = await toBlob(c, 'image/jpeg', 0.92); ext = 'jpg';
    }
    if (run !== bgRun) return;
    el.cutDl.href = url(out);
    el.cutDl.download = `${S.base}-no-background.${ext}`;
    el.cutDl.firstChild.nodeValue = `Download ${ext.toUpperCase()} `;
    el.cutNote.textContent = `${fmt(out.size)}. ${ext === 'png' ? 'Transparent PNG' : 'JPG on a solid background'}, no hidden data.`;
}

// ---------- tabs ----------
function selectTab(i, focus) {
    el.tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; show(el.panes[j], i === j); });
    if (focus) el.tabs[i].focus();
    compare(true);
}
el.tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(i));
    t.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); selectTab(i ? 0 : 1, true); } });
});

// ---------- events ----------
el.pick.addEventListener('click', () => el.file.click());
el.file.addEventListener('change', () => { load(el.file.files[0]); el.file.value = ''; });
el.reset.addEventListener('click', () => { if (S.busy) return; reset(); showWork(false); el.pick.focus(); });
el.clean.addEventListener('click', cleanImage);
el.keep.addEventListener('change', () => { S.cleaned = false; show(el.cleanOut, false); renderFound(); });
el.cut.addEventListener('click', cutOut);
el.slider.addEventListener('input', () => el.stage.style.setProperty('--pos', el.slider.value + '%'));
el.swatches.addEventListener('click', (e) => { const b = e.target.closest('button[data-bg]'); if (b) setBg(b.dataset.bg); });
el.color.addEventListener('input', () => setBg(el.color.value));

let depth = 0;
const over = (on) => { el.drop.classList.toggle('is-over', on); el.work.classList.toggle('is-over', on); };
el.tool.addEventListener('dragenter', (e) => { if (e.dataTransfer?.types.includes('Files')) { e.preventDefault(); depth++; over(true); } });
el.tool.addEventListener('dragover', (e) => { if (e.dataTransfer?.types.includes('Files')) e.preventDefault(); });
el.tool.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; over(false); } });
el.tool.addEventListener('drop', (e) => { e.preventDefault(); depth = 0; over(false); load(e.dataTransfer.files[0]); });
document.addEventListener('paste', (e) => {
    const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith('image/'));
    if (f) { e.preventDefault(); load(f); }
});

// smaller model by default on phones
document.querySelector(`input[name="ic-model"][value="${matchMedia('(max-width: 767px)').matches ? 'fast' : 'best'}"]`).checked = true;
