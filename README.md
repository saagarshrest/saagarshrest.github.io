# saagarshrest.com.np

Static site (plain HTML + CSS + JavaScript), served by GitHub Pages.
No build step is required to publish — push to the default branch and the site goes live.

## Folder structure

```
/
├── index.html              Home
├── 404.html                Custom not-found page (required at the root by GitHub Pages)
├── 403 / 500 / 503 /
│   error / offline.html    Other dead-end pages, same pixel-art scene as the 404
├── <topic>.html            One page per topic (Design, Products, Resume, legal pages, …)
├── Articles/               Article pages
├── assets/
│   ├── css/site.css        All shared styles
│   ├── js/                 nav-hero, pager, error-scene, design, photos, image tools
│   ├── images/             Photography, case-study media, Designportfolio/
│   ├── icons/              favicon.svg, favicon-192/512, apple-touch-icon
│   ├── files/              Downloadable resume (PDF + its HTML source)
│   └── products/           Downloadable product builds (Coin Commando jar/jad)
├── tools/                  Maintenance scripts (not part of the published site)
├── .well-known/            security.txt
├── CNAME                   Custom domain
├── robots.txt              Crawl rules + sitemap pointer
├── sitemap.xml             Search-engine URL index
├── feed.xml                RSS feed of the articles
├── ads.txt / app-ads.txt   Authorized digital sellers (AdSense)
├── humans.txt              Site credits
└── site.webmanifest        PWA manifest
```

**Page URLs are stable** — every page stays at the site root (`/Design.html`,
`/Articles/…`), so existing links and search rankings are unaffected. Only asset
paths live under `/assets/`.

## Design system

New pages follow the same grid and type scale as the rest of the site:

```
section.px-6
└── .max-w-7xl.mx-auto.grid.lg:grid-cols-12.gap-12
    ├── aside .lg:col-span-4 (sticky, hidden on mobile)
    │   └── .art-read label + .art-toc contents list
    └── div .lg:col-span-8.art   (prose)
```

- `.sx-label` — small uppercase section label
- `.sx-title` — page title (serif italic `<em>` for the second word)
- `.sx-lead` — intro paragraph under the title
- `.art` — article prose: 1.15rem / 1.8 line-height, drop cap on `.art-lead`,
  automatically numbered `h2` headings (`01`, `02`, …)
- `.art-toc` — sticky contents list, numbers match the headings
- New: `.doc-note` (callout), `.doc-rows` (index rows), `.doc-q` (FAQ accordion),
  `.doc-meta` (last-updated line)

`assets/js/doc-toc.js` builds the contents list from the headings and highlights
the section you are reading.

## Maintenance scripts

Run from the repository root:

```sh
python3 tools/build-pages.py      # regenerate the standard pages from the shared template
python3 tools/inject-footer.py    # re-insert the shared footer links into every page
```

`build-pages.py` rewrites these pages: `403`, `404`, `500`, `503`, `accessibility`,
`archive`, `contact`, `cookie-policy`, `disclaimer`, `error`, `faq`, `offline`,
`privacy`, `sitemap-page`, `terms`, `thank-you`. Edit the template in the script
rather than the generated HTML, then re-run it.

## Notes

- The 404 page and its siblings run a canvas pixel-art scene
  (`assets/js/error-scene.js`). The code and caption come from the canvas
  `data-code` / `data-sub` attributes, so any error page can reuse it.
- The contact form posts through FormSubmit to `saagarshrest@gmail.com`.
- `assets/images/Designportfolio/` is large (~272 MB); consider compressing it
  if the repository needs to stay slim.
