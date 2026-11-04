#!/usr/bin/env python3
"""Build assets/data/dragon-index.json, the search index the dragon chat answers from.

Splits the <main> content of each public page into sections at h1-h3 headings.
Rerun after editing page content:  python tools/build-dragon-index.py
"""
import json, os, re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'data', 'dragon-index.json')

SKIP = {'404.html', 'zoho-domain-verification.html', 'pages/thank-you.html',
        'pages/archive.html', 'pages/sitemap-page.html', 'assets/files/resume.html',
        'products/Commando.html', 'products/KathmanduShadows.html'}
SKIP_DIRS = ('errors/', 'node_modules/', '.git/')
SKIP_TAGS = {'script', 'style', 'svg', 'noscript', 'canvas', 'template', 'button', 'select', 'form'}
BLOCK = {'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'section', 'article', 'dt', 'dd',
         'tr', 'blockquote', 'figcaption', 'summary', 'br', 'td', 'th'}
MAX_CHARS = 700


class Extract(HTMLParser):
    """use_body: the page has no <main>, so read <body> minus nav, menu and footer."""
    def __init__(self, use_body):
        super().__init__(convert_charrefs=True)
        self.root = 'body' if use_body else 'main'
        self.title = ''
        self.in_title = False
        self.in_main = 0
        self.skip = None             # [tag, nesting] of the element being skipped
        self.heading = None          # (tag, id) while inside a heading
        self.sections = []           # [{'h': str, 'id': str|None, 'parts': [str]}]
        self.buf = []
        self.last_id = None

    def cur(self):
        if not self.sections:
            self.sections.append({'h': '', 'id': None, 'parts': []})
        return self.sections[-1]

    def skippable(self, tag, a):
        if tag in SKIP_TAGS or a.get('aria-hidden') == 'true' or 'hidden' in a:
            return True
        if self.root == 'body':
            cls = a.get('class') or ''
            return tag in ('nav', 'footer', 'header') or a.get('id') == 'mobile-menu' or 'site-menu' in cls
        return False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title':
            self.in_title = True
        if tag == self.root:
            self.in_main += 1
        if not self.in_main:
            return
        if self.skip:
            if tag == self.skip[0]:
                self.skip[1] += 1
            return
        if self.skippable(tag, a):
            self.skip = [tag, 1]
            return
        if a.get('id'):
            self.last_id = a['id']
        if tag in ('h1', 'h2', 'h3', 'summary'):
            self.flush()
            self.heading = (tag, a.get('id') or self.last_id)
            self.buf = []
        elif tag in BLOCK:
            self.flush()

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        if not self.in_main:
            return
        if self.skip:
            if tag == self.skip[0]:
                self.skip[1] -= 1
                if not self.skip[1]:
                    self.skip = None
            return
        if self.heading and tag == self.heading[0]:
            text = clean(' '.join(self.buf))
            self.sections.append({'h': text, 'id': self.heading[1], 'parts': []})
            self.heading = None
            self.buf = []
        elif tag in BLOCK:
            self.flush()
        if tag == self.root:
            self.in_main -= 1

    def flush(self):
        if self.heading:
            return
        text = clean(' '.join(self.buf))
        if text:
            self.cur()['parts'].append(text)
        self.buf = []

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_main and not self.skip:
            self.buf.append(data)


def clean(s):
    return re.sub(r'\s+', ' ', s).strip()


def page_url(rel):
    rel = rel.replace(os.sep, '/')
    if rel == 'index.html':
        return '/'
    if rel.endswith('/index.html'):
        return '/' + rel[:-len('index.html')]
    return '/' + rel


def main():
    entries = []
    for dirpath, _, files in os.walk(ROOT):
        for f in files:
            if not f.endswith('.html'):
                continue
            rel = os.path.relpath(os.path.join(dirpath, f), ROOT).replace(os.sep, '/')
            if rel in SKIP or rel.startswith(SKIP_DIRS):
                continue
            src = open(os.path.join(dirpath, f), encoding='utf-8').read()
            if re.search(r'<meta name="robots" content="noindex', src):
                continue
            p = Extract(use_body='<main' not in src)
            p.feed(src)
            title = clean(p.title).split('|')[0].strip()
            url = page_url(rel)
            for s in p.sections:
                text = clean(' '.join(s['parts']))
                if len(text) < 40:
                    continue
                if len(text) > MAX_CHARS:
                    text = text[:MAX_CHARS].rsplit(' ', 1)[0] + '…'
                entries.append({
                    'page': title,
                    'h': s['h'],
                    'url': url + ('#' + s['id'] if s['id'] else ''),
                    't': text,
                })
    entries.sort(key=lambda e: e['url'].split('#')[0])   # stable: sections stay in page order
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(entries, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'wrote {len(entries)} sections to {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT) // 1024} KB)')


if __name__ == '__main__':
    main()
