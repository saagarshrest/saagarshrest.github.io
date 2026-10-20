#!/usr/bin/env python3
"""Inject the shared footer site-links block into every page footer (idempotent)."""
import os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINKS = '''        <!-- Site pages -->
        <div class="ct-sitemap">
            <div class="ct-sitemap__group">
                <span class="ct-label">Explore</span>
                <a href="/work/Design.html">Design</a>
                <a href="/Articles/Article.html">Articles</a>
                <a href="/work/Casestudy.html">Case Study</a>
                <a href="/products/Products.html">Products</a>
                <a href="/about/Photos.html">Photos</a>
                <a href="/about/Resume.html">Resume</a>
                <a href="/pages/archive.html">Archive</a>
            </div>
            <div class="ct-sitemap__group">
                <span class="ct-label">Site</span>
                <a href="/pages/contact.html">Contact</a>
                <a href="/pages/faq.html">FAQ</a>
                <a href="/pages/sitemap-page.html">Sitemap</a>
                <a href="/legal/accessibility.html">Accessibility</a>
            </div>
            <div class="ct-sitemap__group">
                <span class="ct-label">Legal</span>
                <a href="/legal/privacy.html">Privacy Policy</a>
                <a href="/legal/terms.html">Terms of Use</a>
                <a href="/legal/cookie-policy.html">Cookie Policy</a>
                <a href="/legal/disclaimer.html">Disclaimer</a>
            </div>
        </div>'''
MARKER = '        <!-- Bottom bar -->'

files = sorted(f for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True)
               if not os.path.relpath(f, ROOT).startswith(('assets', 'tools')))

changed = []
for f in files:
    s = open(f, encoding='utf-8').read()
    if 'ct-sitemap' in s:
        continue
    if MARKER not in s:
        continue
    s = s.replace(MARKER, LINKS + '\n\n' + MARKER, 1)
    open(f, 'w', encoding='utf-8').write(s)
    changed.append(os.path.relpath(f, ROOT))

print('injected into %d pages:' % len(changed))
for c in changed:
    print('  ', c)
