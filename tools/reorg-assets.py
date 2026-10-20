#!/usr/bin/env python3
"""Move site assets into /assets/ and rewrite every root-absolute reference.

Page URLs are untouched: only asset paths change.
"""
import os, re, subprocess, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# ---------------------------------------------------------------- 1. moves
MOVES = [
    ('css', 'assets/css'),
    ('js', 'assets/js'),
    ('images', 'assets/images'),
    ('files', 'assets/files'),
    ('Products', 'assets/products'),
    ('hero.png', 'assets/images/hero.png'),
    ('favicon.svg', 'assets/icons/favicon.svg'),
    ('favicon-32.png', 'assets/icons/favicon-32.png'),
    ('favicon-192.png', 'assets/icons/favicon-192.png'),
    ('favicon-512.png', 'assets/icons/favicon-512.png'),
    ('apple-touch-icon.png', 'assets/icons/apple-touch-icon.png'),
]
for src, dst in MOVES:
    if not os.path.exists(src):
        print('  skip (missing):', src)
        continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    subprocess.run(['git', 'mv', src, dst], check=True)
    print('  moved', src, '->', dst)

# ------------------------------------------------------------ 2. rewrites
# only root-absolute paths directly after a quote (so external URLs are untouched)
PAIRS = [
    ('/css/', '/assets/css/'),
    ('/js/', '/assets/js/'),
    ('/images/', '/assets/images/'),
    ('/files/', '/assets/files/'),
    ('/Products/', '/assets/products/'),
    ('/favicon.svg', '/assets/icons/favicon.svg'),
    ('/favicon-32.png', '/assets/icons/favicon-32.png'),
    ('/favicon-192.png', '/assets/icons/favicon-192.png'),
    ('/favicon-512.png', '/assets/icons/favicon-512.png'),
    ('/apple-touch-icon.png', '/assets/icons/apple-touch-icon.png'),
]
TARGETS = (glob.glob('*.html') + glob.glob('Articles/*.html') +
           glob.glob('assets/js/*.js') + glob.glob('*.py') +
           ['site.webmanifest', 'sitemap.xml', 'robots.txt', 'humans.txt'])

PATTERNS = []
for old, new in PAIRS:
    PATTERNS.append((re.compile(r'(["\'])' + re.escape(old)), r'\1' + new))
# hero.png lives with the images now
PATTERNS.append((re.compile(r'(["\'])/hero\.png'), r'\1/assets/images/hero.png'))
# bare (unquoted) root-absolute paths inside js strings built by concatenation
PATTERNS.append((re.compile(r'(?<![\w"\'/])/images/Designportfolio/'), '/assets/images/Designportfolio/'))

changed = []
for f in TARGETS:
    if not os.path.exists(f):
        continue
    s = open(f, encoding='utf-8').read()
    orig = s
    for pat, rep in PATTERNS:
        s = pat.sub(rep, s)
    if s != orig:
        open(f, 'w', encoding='utf-8').write(s)
        changed.append(f)

print('\nrewrote %d files:' % len(changed))
for c in changed:
    print('  ', c)
