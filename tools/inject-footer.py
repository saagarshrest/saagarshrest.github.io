#!/usr/bin/env python3
"""Inject the shared footer site-links block into every page footer (idempotent)."""
import os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINKS = '''        <!-- Site pages -->
        <div class="ct-sitemap">
            <div class="ct-sitemap__group">
                <span class="ct-label">Explore</span>
                <a href="/Design.html">Design</a>
                <a href="/Article.html">Articles</a>
                <a href="/Casestudy.html">Case Study</a>
                <a href="/Products.html">Products</a>
                <a href="/Photos.html">Photos</a>
                <a href="/Resume.html">Resume</a>
                <a href="/archive.html">Archive</a>
            </div>
            <div class="ct-sitemap__group">
                <span class="ct-label">Site</span>
                <a href="/contact.html">Contact</a>
                <a href="/faq.html">FAQ</a>
                <a href="/sitemap-page.html">Sitemap</a>
                <a href="/accessibility.html">Accessibility</a>
            </div>
            <div class="ct-sitemap__group">
                <span class="ct-label">Legal</span>
                <a href="/privacy.html">Privacy Policy</a>
                <a href="/terms.html">Terms of Use</a>
                <a href="/cookie-policy.html">Cookie Policy</a>
                <a href="/disclaimer.html">Disclaimer</a>
            </div>
        </div>'''
MARKER = '        <!-- Bottom bar -->'

files = sorted(glob.glob(os.path.join(ROOT, '*.html'))) + \
        sorted(glob.glob(os.path.join(ROOT, 'Articles', '*.html')))

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
