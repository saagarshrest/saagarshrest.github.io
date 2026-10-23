# Design system — saagarshrest.com.np

The working guide for every page on this site. Source of truth for shared styles is `assets/css/site.css`; case study pages carry their own `cs-*` block (copy it from `work/Casedetailofficiti.html`).

## 1. Principles

- **Monochrome first.** Ink on paper. Colour comes from images, and only on hover.
- **Type does the work.** Large, tight, medium-weight sans with an italic serif accent.
- **Sections, not boxes.** Full-bleed light / soft / dark bands separated by hairlines, not cards with shadows.
- **No pill badges or tag chips.** Use plain uppercase labels instead.
- **Images are never visibly compressed.** Keep the original and ship WebP q90 at 2x.

## 2. Colour tokens

```css
:root {
  --ink:   #0A0A0A;              /* text, dark sections, primary buttons */
  --paper: #FFFFFF;              /* light sections */
  --soft:  #F2F2F2;              /* soft sections, notes */
  --line:  rgba(10,10,10,.16);   /* hairlines */
  --mute:  rgba(10,10,10,.62);   /* secondary text */
}
```

| Use | Light background | Dark background |
|---|---|---|
| Body text | ink at .65–.78 | white at .66–.75 |
| Labels | ink at .55 | white at .55 |
| Borders / rules | ink at .14–.2 (.3 under table heads) | white at .14–.2 |
| Image stage | `#EDEDED` | `#0A0A0A` |

**One accent only:** green `#15803D` (hover `#166534`), reserved for “Available for work” and WhatsApp. Nothing else is coloured.

## 3. Typography

- **Inter Tight** 400 / 500 / 600 for everything.
- **Instrument Serif italic** for `<em>` inside headings and for numerals (`.sx-num`).

| Role | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| Home hero `.hero-title` | `clamp(2.6rem, 5.4vw, 5.4rem)` | .98 | -0.045em | 500 |
| Section title `.sx-title` | `clamp(2.3rem, 4.6vw, 4.4rem)` | ~1 | -0.04em | 500 |
| Case study hero `.cs-hero-title` | `clamp(3rem, 7vw, 6.6rem)` | .95 | -0.045em | 500 |
| Case study H2 `.cs-h2` | `clamp(2rem, 3.8vw, 3.4rem)` | 1 | -0.035em | 500 |
| H3 `.cs-h3` | 1.5rem | 1.15 | -0.02em | 500 |
| Lead `.cs-lead` | 1.1–1.15rem | 1.55 | — | 400 |
| Body `.cs-p` | 1rem | 1.6 | — | 400 |
| Label `.cs-label` | .68rem uppercase | — | .16em | 500 |

Headline pattern: plain words, then the payoff in italic serif, e.g. `Calls that <em>shaped the app.</em>`

## 4. Layout

- Container: `max-w-7xl` (80rem) with 1.5rem side padding; case studies use `.cs-wrap`.
- Breakpoints: 640 / 768 / 900 / 1024px.
- Sections: `.sx-light`, `.sx-cream` (soft), `.sx-dark`. Case studies use `.cs-sec.light | .soft | .dark`, 5rem vertical padding (less below 640px).
- Alternate light / soft / dark down the page; use dark once or twice for emphasis.
- Two-column intro: `.cs-grid2` (label + H2 left, copy right); `.cs-grid2.even` for equal halves.
- No horizontal scroll at 375px. Wide tables sit inside `.cs-tbl-wrap`.

## 5. Shape, radius and elevation

| Element | Radius |
|---|---|
| Buttons, avatars, dots | 9999px |
| Hero, cover, image stage | 22px |
| Case images, persona cards | 18px |
| Notes | 14px |
| Thumbnails | 12px |

No drop shadows. Separation comes from 1px hairlines and background changes.

## 6. Motion

- Easing: `cubic-bezier(.16, 1, .3, 1)`.
- Images: grayscale by default, colour on hover, .5–.7s.
- Buttons lift `translateY(-2px)` on hover.
- Everything respects `prefers-reduced-motion`.
- `assets/js/pager.js` pages section by section at ≥1024px; add `data-no-pager` to opt a page out.

## 7. Components

**Navigation.** Sticky `.site-nav`, 76px high; switches to `.on-dark` over dark sections (`assets/js/nav-hero.js`).

**Buttons and links.**
- `.hero-btn` / `.cs-btn`: black pill, inverts on hover; white pill inside `.dark`.
- `.cs-link`: text with a 1px underline border, fades to .55 on hover.

**Cards.**
- `.sx-case`: listing card — image (200px, grayscale), `.sx-meta` (category + date), `h2`, `p`, `.sx-foot` (“By Saagar” + `.sx-read`).
- `.sx-card`, `.sx-item` / `.sx-list` for simpler lists.

**Case study parts.**
- `.cs-meta` — definition list of product, role, platform, scope, status.
- `.cs-toc` — in-page section links.
- `.cs-row` — numbered row (`.sx-num` + `h3` + `p`) inside `.cs-list`.
- `.cs-facts` / `.cs-fact` (`.n` number, `.c` caption); `.cs-facts.four` for four across.
- `.cs-tbl` (`.cs-tbl-dk` on dark), `.cs-quote`, `.cs-persona`, `.cs-quad`.
- `.cs-note` — left-ruled aside for caveats (NDA, test data, targets vs results).
- `.cs-dec` — decision block: text + image, `.flip` to swap sides.
- `.cs-ticks`, `.cs-steps`, `.cs-states`, `.cs-trade` (trade-off footnote).
- `.cs-hero-img` / `.cs-shot` — framed image that links to its full-size original; `.dk` on dark.

**Articles and documents.** `.art-*` prose (drop cap, auto-numbered H2); `.doc-note`, `.doc-rows` for legal and info pages.

**Footer.** `contact-bg` block, shared on every page.

## 8. Images

- Folder per page: `assets/images/<slug>/`.
- Keep the original PNG/JPG; add a WebP at quality 90; the WebP is shown and links to the original.
- Always set `width`, `height` and real `alt` text; `loading="lazy"` below the fold.
- Open Graph image: `og.jpg`, 1200×630, quality 90, no chroma subsampling.

## 9. Writing

- Plain, specific sentences. Say what was done and why.
- Label claims honestly: targets are targets, test data is test data.
- Case study order: hero + meta → problem → goals → principles → decisions → system → outcome → learnings / next.

## 10. New page checklist

1. Copy the closest template (`work/Casedetailofficiti.html` for case studies) so the head, analytics, nav, footer and scripts match.
2. Update title, description, canonical, OG image and JSON-LD.
3. Add images per section 8.
4. Link it from its listing page (e.g. `work/Casestudy.html`, newest first).
5. Add it to `sitemap.xml` and the archive + sitemap lists in `tools/build-pages.py`, then run `python tools/build-pages.py`.
6. Check 375px and 1440px: no horizontal scroll, no broken images, nav contrast over dark sections.
