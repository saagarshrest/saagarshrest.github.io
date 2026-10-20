/* =====================================================================
   Find and remove hidden data (EXIF, GPS, XMP, IPTC, comments, thumbnails)
   in JPEG, PNG and WebP files by rewriting the file structure. The image
   itself is copied byte for byte, so there is no quality loss.
   Kept on purpose: what the browser needs to show the picture correctly
   (the colour profile when asked, and orientation, rewritten as a tiny
   EXIF block that holds nothing else).
   Pure functions, no DOM: used by js/image-cleaner.js.
   ===================================================================== */

const ascii = (b, s, n) => { let t = ''; for (let i = s; i < s + n && i < b.length; i++) t += String.fromCharCode(b[i]); return t; };
const u16be = (b, i) => (b[i] << 8) | b[i + 1];
const u32be = (b, i) => ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
const u32le = (b, i) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;
const concat = (parts) => {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
};

export function sniff(b) {
    if (b[0] === 0xFF && b[1] === 0xD8) return 'jpeg';
    if (b[0] === 0x89 && ascii(b, 1, 3) === 'PNG') return 'png';
    if (ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 4) === 'WEBP') return 'webp';
    if (ascii(b, 0, 3) === 'GIF') return 'gif';
    return 'other';
}

// ---------- TIFF (the format inside EXIF) ----------
function tiffInfo(b, t) {                 // t: offset of the "II*" / "MM*" header
    const info = { orientation: 1, entries: 0, onlyOrientation: false };
    if (t + 8 > b.length) return info;
    const le = b[t] === 0x49;
    const r16 = (i) => (le ? b[i] | (b[i + 1] << 8) : u16be(b, i));
    const r32 = (i) => (le ? u32le(b, i) : u32be(b, i));
    if (r16(t + 2) !== 42) return info;
    const ifd = t + r32(t + 4);
    if (ifd + 2 > b.length) return info;
    const n = r16(ifd);
    info.entries = n;
    for (let k = 0; k < n; k++) {
        const e = ifd + 2 + k * 12;
        if (e + 12 > b.length) break;
        if (r16(e) === 0x0112) { const v = r16(e + 8); if (v >= 1 && v <= 8) info.orientation = v; }
    }
    const next = ifd + 2 + n * 12;                                          // offset of a chained IFD (thumbnail), 0 if none
    info.onlyOrientation = n === 1 && r16(ifd + 2) === 0x0112 && next + 4 <= b.length && r32(next) === 0;
    return info;
}
// a TIFF block that holds one value: the orientation (big-endian, 26 bytes)
const orientationTiff = (o) => new Uint8Array([0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, o, 0, 0, 0, 0, 0, 0]);

const LABELS = {
    exif: 'EXIF: camera, settings, date and time, often GPS location',
    orientation: 'Orientation (which way up to show the photo)',
    xmp: 'XMP: editing history, author, keywords',
    iptc: 'IPTC / Photoshop: captions, credits, keywords',
    icc: 'Colour profile',
    comment: 'Comment',
    thumbnail: 'Embedded preview thumbnail',
    extra: 'Extra images or data after the photo (depth or HDR maps)',
    mpf: 'Multi-picture index (MPF)',
    time: 'Last-modified time',
};
const block = (kind, size, label) => ({ kind, size, label: label || LABELS[kind] });

// ---------- JPEG ----------
function walkJpeg(b) {
    const segs = [];
    let i = 2;
    while (i + 1 < b.length) {
        if (b[i] !== 0xFF) { i++; continue; }
        const m = b[i + 1];
        if (m === 0xFF) { i++; continue; }                                   // fill byte
        if (m === 0xD9) { segs.push({ m, start: i, end: i + 2 }); return { segs, end: i + 2 }; }
        if ((m >= 0xD0 && m <= 0xD7) || m === 0x01) { segs.push({ m, start: i, end: i + 2 }); i += 2; continue; }
        if (i + 4 > b.length) break;
        let e = i + 2 + u16be(b, i + 2);
        if (m === 0xDA) {                                                     // start of scan: skip the compressed data
            let j = e;
            while (j + 1 < b.length) {
                if (b[j] === 0xFF) {
                    const n = b[j + 1];
                    if (n === 0x00 || (n >= 0xD0 && n <= 0xD7)) { j += 2; continue; }
                    if (n === 0xFF) { j++; continue; }
                    break;
                }
                j++;
            }
            e = j;
        }
        e = Math.min(e, b.length);
        segs.push({ m, start: i, end: e, id: ascii(b, i + 4, 36) });
        i = e;
    }
    return { segs, end: b.length };
}
function jpegKind(b, s) {                   // null = image data the decoder needs
    const { m, id = '' } = s, size = s.end - s.start;
    if (m === 0xE0) return id.startsWith('JFIF\0') ? null : block('thumbnail', size);
    if (m === 0xE1) {
        if (id.startsWith('Exif\0')) { const t = tiffInfo(b, s.start + 10); return block(t.onlyOrientation ? 'orientation' : 'exif', size); }
        if (id.startsWith('http://ns.adobe.com/x')) return block('xmp', size);
    }
    if (m === 0xE2) {
        if (id.startsWith('ICC_PROFILE')) return block('icc', size);
        if (id.startsWith('MPF')) return block('mpf', size);
    }
    if (m === 0xED) return block('iptc', size);
    if (m === 0xEE && id.startsWith('Adobe')) return null;                   // colour transform flag, needed to decode
    if (m >= 0xE0 && m <= 0xEF) {
        const name = id.split('\0')[0].replace(/[^\x20-\x7E]/g, '').slice(0, 20);
        return block('other', size, 'App data' + (name ? ' "' + name + '"' : '') + ' (APP' + (m - 0xE0) + ')');
    }
    if (m === 0xFE) return block('comment', size);
    return null;
}
function jpegOrientation(b, segs) {
    for (const s of segs) if (s.m === 0xE1 && (s.id || '').startsWith('Exif\0')) return tiffInfo(b, s.start + 10).orientation;
    return 1;
}
function jfifWithoutThumb(b, s) {
    const hasThumb = s.end - s.start > 20 && b[s.start + 18] * b[s.start + 19] > 0;
    if (!hasThumb) return b.subarray(s.start, s.end);
    const out = b.slice(s.start, s.start + 20);
    out[2] = 0; out[3] = 16; out[18] = 0; out[19] = 0;
    return out;
}
function scanJpeg(b) {
    const { segs, end } = walkJpeg(b);
    const blocks = [];
    for (const s of segs) { const k = jpegKind(b, s); if (k) blocks.push(k); }
    const first = segs[0];
    if (first && first.m === 0xE0 && (first.id || '').startsWith('JFIF\0') && first.end - first.start > 20 && b[first.start + 18] * b[first.start + 19] > 0) blocks.push(block('thumbnail', first.end - first.start - 18));
    if (b.length - end > 32) blocks.push(block('extra', b.length - end));
    return { blocks, orientation: jpegOrientation(b, segs) };
}
function stripJpeg(b, keepProfile) {
    const { segs } = walkJpeg(b);
    const o = jpegOrientation(b, segs);
    const out = [b.subarray(0, 2)];
    let placed = false;
    const orient = () => {
        if (placed) return; placed = true;
        if (o === 1) return;
        const t = orientationTiff(o), app = new Uint8Array(4 + 6 + t.length);
        app.set([0xFF, 0xE1, (app.length - 2) >> 8, (app.length - 2) & 255, 0x45, 0x78, 0x69, 0x66, 0, 0]); app.set(t, 10);
        out.push(app);
    };
    for (const s of segs) {
        const k = jpegKind(b, s);
        if (s.m === 0xE0 && !k) { out.push(jfifWithoutThumb(b, s)); orient(); continue; }
        if (k) { if (k.kind === 'icc' && keepProfile) { orient(); out.push(b.subarray(s.start, s.end)); } continue; }
        orient(); out.push(b.subarray(s.start, s.end));
    }
    return concat(out);                                                       // anything after the end marker is dropped
}

// ---------- PNG ----------
const PNG_KEEP = new Set(['IHDR', 'PLTE', 'IDAT', 'IEND', 'tRNS', 'gAMA', 'cHRM', 'sRGB', 'sBIT', 'pHYs', 'bKGD', 'acTL', 'fcTL', 'fdAT', 'cICP', 'mDCv', 'cLLi']);
function walkPng(b) {
    const chunks = [];
    let i = 8;
    while (i + 12 <= b.length) {
        const len = u32be(b, i), type = ascii(b, i + 4, 4), end = i + 12 + len;
        if (end > b.length) break;
        chunks.push({ type, start: i, end, data: i + 8, len });
        i = end;
        if (type === 'IEND') break;
    }
    return { chunks, end: i };
}
function pngKind(b, c) {
    const size = c.end - c.start;
    if (PNG_KEEP.has(c.type)) return null;
    if (c.type === 'tEXt' || c.type === 'zTXt' || c.type === 'iTXt') {
        const key = ascii(b, c.data, Math.min(79, c.len)).split('\0')[0];
        return key === 'XML:com.adobe.xmp' ? block('xmp', size) : block('comment', size, 'Text: "' + key + '"');
    }
    if (c.type === 'eXIf') return block(tiffInfo(b, c.data).onlyOrientation ? 'orientation' : 'exif', size);
    if (c.type === 'tIME') return block('time', size);
    if (c.type === 'iCCP') return block('icc', size);
    if (c.type.charCodeAt(0) < 97) return null;                              // unknown critical chunk: keep, the image may need it
    return block('other', size, 'Private data "' + c.type + '"');
}
let CRC;
function crc32(bytes) {
    if (!CRC) { CRC = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; } }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}
function pngChunk(type, data) {
    const out = new Uint8Array(12 + data.length), dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(data, 8);
    dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
    return out;
}
function scanPng(b) {
    const { chunks, end } = walkPng(b);
    const blocks = [];
    let orientation = 1;
    for (const c of chunks) {
        const k = pngKind(b, c); if (k) blocks.push(k);
        if (c.type === 'eXIf') orientation = tiffInfo(b, c.data).orientation;
    }
    if (b.length - end > 32) blocks.push(block('extra', b.length - end));
    return { blocks, orientation };
}
function stripPng(b, keepProfile) {
    const { chunks } = walkPng(b);
    const out = [b.subarray(0, 8)];
    for (const c of chunks) {
        const k = pngKind(b, c);
        if (!k || (k.kind === 'icc' && keepProfile)) { out.push(b.subarray(c.start, c.end)); continue; }
        if (c.type === 'eXIf') { const o = tiffInfo(b, c.data).orientation; if (o !== 1) out.push(pngChunk('eXIf', orientationTiff(o))); }
    }
    return concat(out);
}

// ---------- WebP ----------
const WEBP_KEEP = new Set(['VP8 ', 'VP8L', 'VP8X', 'ALPH', 'ANIM', 'ANMF']);
function walkWebp(b) {
    const chunks = [];
    const riffEnd = Math.min(b.length, 8 + u32le(b, 4));
    let i = 12;
    while (i + 8 <= riffEnd) {
        const type = ascii(b, i, 4), len = u32le(b, i + 4), end = Math.min(i + 8 + len + (len & 1), b.length);
        chunks.push({ type, start: i, end, data: i + 8, len });
        i = end;
    }
    return { chunks, end: riffEnd };
}
function webpKind(b, c) {
    const size = c.end - c.start;
    if (WEBP_KEEP.has(c.type)) return null;
    if (c.type === 'EXIF') return block('exif', size);
    if (c.type === 'XMP ') return block('xmp', size);
    if (c.type === 'ICCP') return block('icc', size);
    return block('other', size, 'Private data "' + c.type.trim() + '"');
}
function scanWebp(b) {
    const { chunks, end } = walkWebp(b);
    const blocks = [];
    for (const c of chunks) { const k = webpKind(b, c); if (k) blocks.push(k); }
    if (b.length - end > 32) blocks.push(block('extra', b.length - end));
    return { blocks, orientation: 1 };
}
function stripWebp(b, keepProfile) {
    const { chunks } = walkWebp(b);
    const parts = [];
    for (const c of chunks) {
        const k = webpKind(b, c);
        if (k && !(k.kind === 'icc' && keepProfile)) continue;
        if (c.type === 'VP8X') {
            const x = b.slice(c.start, c.end);
            x[8] &= ~(0x08 | 0x04 | (keepProfile ? 0 : 0x20));                  // clear the EXIF, XMP (and ICC) flags
            parts.push(x);
        } else parts.push(b.subarray(c.start, c.end));
    }
    const body = concat(parts), head = new Uint8Array(12);
    head.set([0x52, 0x49, 0x46, 0x46]); new DataView(head.buffer).setUint32(4, body.length + 4, true); head.set([0x57, 0x45, 0x42, 0x50], 8);
    return concat([head, body]);
}

// ---------- public ----------
const SCAN = { jpeg: scanJpeg, png: scanPng, webp: scanWebp };
const STRIP = { jpeg: stripJpeg, png: stripPng, webp: stripWebp };

/** What hidden data the file carries. `blocks`: [{kind, label, size}] */
export function scan(bytes) {
    const format = sniff(bytes);
    if (!SCAN[format]) return { format, blocks: [], orientation: 1, supported: false };
    return { format, supported: true, ...SCAN[format](bytes) };
}

/** A copy of the file without hidden data, or null when the format needs re-encoding instead. */
export function strip(bytes, { keepProfile = true } = {}) {
    const format = sniff(bytes);
    return STRIP[format] ? STRIP[format](bytes, keepProfile) : null;
}

/** Blocks that still identify something about the photo (everything except colour profile and orientation). */
export const personal = (blocks) => blocks.filter((k) => k.kind !== 'icc' && k.kind !== 'orientation');
