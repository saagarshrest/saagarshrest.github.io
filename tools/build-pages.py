#!/usr/bin/env python3
"""Generate the standard site pages from the shared design system.

Design system (taken from the existing pages):
  section > .max-w-7xl.mx-auto > .grid.lg:grid-cols-12.gap-12
  left column  : .lg:col-span-4 (sticky) with .sx-label / .sx-title / .sx-lead
  right column : .lg:col-span-8 with .art prose (numbered h2, .art-lead drop cap)
"""
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(ROOT, '404.html'), encoding='utf-8').read()

# --- extract shared blocks -------------------------------------------------
nav_block = src[src.index('<!-- Navigation -->'):src.index('<main>')]
footer_block = src[src.index('<!-- Footer -->'):src.index('</footer>') + len('</footer>')]
inline_js = re.search(r'<script>\n    \(function \(\).*?</script>', src, re.S).group(0)

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-FYVQB18KQB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-FYVQB18KQB');
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{desc}">
    <meta name="robots" content="{robots}">
    <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/assets/icons/favicon-32.png" sizes="32x32" type="image/png">
    <link rel="icon" href="/assets/icons/favicon-192.png" sizes="192x192" type="image/png">
    <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="alternate" type="application/rss+xml" title="Saagar Shrestha — Articles" href="/feed.xml">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#0D0D0D',
                        secondary: '#1E40AF',
                        accent: '#F59E0B',
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/site.css">
</head>

<body class="bg-white" data-no-pager>
"""

TAIL = """{footer_block}

{inline_js}
<script src="/assets/js/pager.js"></script>
<script src="/assets/js/nav-hero.js"></script>
<script src="/assets/js/doc-toc.js"></script>
{extra_tail}
</body>
</html>
"""

# --- the shared footer link block (injected into every page's footer) ------
FOOTER_LINKS = """
        <!-- Site pages -->
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
        </div>
"""


def page(title, desc, body, robots='index, follow', extra_head='', extra_tail=''):
    html = (HEAD
            .replace('{title}', title)
            .replace('{desc}', desc)
            .replace('{robots}', robots)
            .replace('</head>', extra_head + '</head>'))
    html += nav_block + '<main>\n' + body + '</main>\n\n'
    html += (TAIL
             .replace('{footer_block}', footer_block)
             .replace('{inline_js}', inline_js)
             .replace('{extra_tail}', extra_tail))
    return html


# =========================================================================
# content helpers — everything uses the site's own classes
# =========================================================================
def hero(kicker, title, lead, meta=None):
    """Site-style page header: label, big title with a serif italic, lead."""
    stamp = f'<p class="doc-meta">{meta}</p>' if meta else ''
    return f"""
    <section class="px-6 pt-14 md:pt-20 pb-10 md:pb-14">
        <div class="max-w-7xl mx-auto">
            <p class="sx-label">{kicker}</p>
            <h1 class="sx-title mt-4">{title}</h1>
            <p class="sx-lead mt-6">{lead}</p>
            {stamp}
        </div>
    </section>
"""


def doc(body, toc_label='On this page'):
    """Two-column document: sticky contents on the left, prose on the right."""
    return f"""
    <section class="px-6 pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <aside class="lg:col-span-4 hidden lg:block lg:sticky lg:top-8">
                <div class="art-side__in">
                    <div class="art-read">Contents<b data-doc-toc-label>{toc_label}</b></div>
                    <nav class="art-toc" data-doc-toc aria-label="On this page"></nav>
                </div>
            </aside>
            <div class="lg:col-span-8 art">
{body}
            </div>
        </div>
    </section>
"""


def h2(t): return f'\n<h2>{t}</h2>\n'
def p(t):  return f'\n<p>{t}</p>\n'
def ul(items):
    return ('\n<ul class="doc-list list-disc pl-6 space-y-3">'
            + ''.join(f'<li>{i}</li>' for i in items) + '</ul>\n')
def note(text):
    return f'\n<div class="doc-note"><p>{text}</p></div>\n'


# =========================================================================
PAGES = {}

# ---------------------------------------------------------------- error pages
PX_STYLE = """
    <style>
        .px404 { display: block; width: 100%; max-width: 560px; height: auto; margin: 0 auto; image-rendering: pixelated; image-rendering: crisp-edges; }
        .px404-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
    </style>
"""
PX_SCRIPT = '<script src="/assets/js/error-scene.js"></script>\n'
CONTACT_JS = '<script src="/assets/js/contact-form.js"></script>\n'


def error_page(code, sub, message, cta_label='Back to home', cta_href='/',
               sr=None, aria=None, links=None):
    """A dead-end page in the same pixel-art style as the 404."""
    sr = sr or f'{code}: {sub.title()}'
    aria = aria or (f'Pixel-art text reading {code} {sub.title()}. In a loop, the site\'s '
                    f'dragon mascot burns it to ash and a little builder puts it back together.')
    extra = ''.join(f'\n                <a href="{href}" class="hero-link">{label}</a>' for label, href in links or [])
    return f"""
    <section class="px-6 py-16 md:py-24">
        <div class="max-w-3xl mx-auto text-center">
            <h1 class="px404-sr">{sr}</h1>
            <canvas id="px404" class="px404" data-code="{code}" data-sub="{sub}" role="img" aria-label="{aria}"></canvas>
            <p class="hero-lead mx-auto mt-8">{message}</p>
            <div class="hero-actions justify-center">
                <a href="{cta_href}" class="hero-btn">{cta_label} <span class="hero-btn-arrow">↗</span></a>{extra}
            </div>
        </div>
    </section>
"""


PAGES['errors/500.html'] = page(
    'Something went wrong | Saagar Shrestha',
    'An unexpected error occurred on this site.',
    error_page(500, 'SERVER ERROR',
               'Something broke on our end. This one is on us — try again in a moment, and if it keeps happening, let me know.',
               cta_label='Try again', cta_href='/',
               links=[('Report a problem', '/pages/contact.html')]),
    robots='noindex', extra_head=PX_STYLE, extra_tail=PX_SCRIPT)

PAGES['errors/403.html'] = page(
    'Access denied | Saagar Shrestha',
    'You do not have permission to view this page.',
    error_page(403, 'ACCESS DENIED',
               'This area is restricted. If you believe you should have access, get in touch and I’ll sort it out.',
               cta_label='Back to home', cta_href='/',
               links=[('Report a problem', '/pages/contact.html')]),
    robots='noindex', extra_head=PX_STYLE, extra_tail=PX_SCRIPT)

PAGES['errors/503.html'] = page(
    'Back shortly | Saagar Shrestha',
    'The site is temporarily unavailable.',
    error_page(503, 'SERVICE UNAVAILABLE',
               'The site is being updated or is temporarily offline. Everything should be back within the hour.',
               cta_label='Back to home', cta_href='/',
               links=[('Report a problem', '/pages/contact.html')]),
    robots='noindex', extra_head=PX_STYLE, extra_tail=PX_SCRIPT)

PAGES['errors/error.html'] = page(
    'Error | Saagar Shrestha',
    'An unexpected error occurred.',
    error_page('ERR', 'SOMETHING WENT WRONG',
               'An unexpected error interrupted the request. The page may have been moved or renamed.',
               cta_label='Back to home', cta_href='/',
               sr='Error: something went wrong',
               links=[('Report a problem', '/pages/contact.html')]),
    robots='noindex', extra_head=PX_STYLE, extra_tail=PX_SCRIPT)

PAGES['errors/offline.html'] = page(
    'Offline | Saagar Shrestha',
    'You appear to be offline.',
    error_page('OFF', 'NO CONNECTION',
               'This page needs a connection. Reconnect and it will load right back up — anything you were reading is still on this device.',
               cta_label='Retry', cta_href='/',
               sr='Offline: no connection',
               links=[('Back to home', '/')]),
    robots='noindex', extra_head=PX_STYLE, extra_tail=PX_SCRIPT)

# ---------------------------------------------------------------- privacy
PAGES['legal/privacy.html'] = page(
    'Privacy Policy | Saagar Shrestha',
    'How this website collects, uses and protects your personal data.',
    hero('Legal', 'Privacy <em>Policy</em>',
         'What this site collects, why, and what I do with it. Plain language, no legalese gymnastics.',
         meta='Last updated · 20 October 2026') +
    doc(
        '<p class="art-lead">This is a personal portfolio site. It has no accounts, no login, and no database. The only things that leave your browser are anonymous analytics and the message you choose to email me. I never sell, rent or share your data with anyone.</p>' +
        h2('The short version') +
        note('I collect anonymous usage analytics so I can see which pages are useful, and your contact details if you choose to write to me. Nothing else, and nothing to anyone else.') +
        h2('What this site collects') +
        ul([
            '<strong>Server logs.</strong> My host (GitHub Pages) records standard request logs such as IP address, browser type, and the page requested, in order to serve the site and prevent abuse. These are handled under the host’s own policy.',
            '<strong>Google Analytics.</strong> Anonymous usage statistics — which pages you visit, your approximate region, and your browser and device — collected through Google Analytics (measurement ID <code>G-FYVQB18KQB</code>) so I can understand which work is actually useful to visitors.',
            '<strong>Contact details.</strong> If you email me, message me on WhatsApp, or use the contact form, I receive your name, email address and message so I can reply. Form submissions are relayed to my inbox by <a href="https://formsubmit.co">FormSubmit</a>, which handles them under its own privacy policy; nothing is stored on this site.',
        ]) +
        h2('What I do <em>not</em> collect') +
        ul([
            'No advertising or cross-site tracking cookies.',
            'No third-party ad networks, pixels or remarketing tags.',
            'No behavioural profiling or automated decisions.',
            'No data broker enrichment of visitors.',
        ]) +
        h2('Cookies and local storage') +
        p('This site sets no advertising cookies. Google Analytics may set first-party cookies (such as <code>_ga</code>) to distinguish a returning visitor from a new one; Google’s own policy governs those. You can block or delete cookies at any time in your browser settings, and the site will still work.') +
        h2('Third-party services') +
        p('Pages load fonts from Google Fonts and stylesheets/scripts from public CDNs. When those files load, the provider receives your IP address as part of the ordinary request. Links to Instagram, LinkedIn, Medium, Dribbble, Figma and Unsplash are external and governed by those platforms’ own privacy policies.') +
        h2('Your rights') +
        p('Under the GDPR and Nepal’s privacy principles, you can ask what data I hold about you, request a correction, ask for it to be deleted, or object to how it is used. Email <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a> and I will respond within 30 days. Analytics data can be deleted on request; email correspondence cannot, because I need to keep a record of who said what.') +
        h2('Data retention') +
        ul([
            'Server logs: kept for the host’s standard retention window, then discarded.',
            'Analytics: retained for 14 months, then deleted automatically.',
            'Email and messages: kept for as long as needed to handle your enquiry and any follow-up.',
        ]) +
        h2('Children') +
        p('This site is not directed at anyone under 13, and I do not knowingly collect data from children.') +
        h2('Changes to this policy') +
        p('If this policy changes I will update the “last updated” date at the top of the page. Material changes will also be noted on the <a href="/Articles/Article.html">articles</a> page.') +
        h2('Contact') +
        p('Questions about privacy? <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a>. Prefer a form? Use the <a href="/pages/contact.html">contact page</a>.')
    ))

# ---------------------------------------------------------------- terms
PAGES['legal/terms.html'] = page(
    'Terms of Use | Saagar Shrestha',
    'The terms that apply to using this website.',
    hero('Legal', 'Terms of <em>Use</em>',
         'The straightforward rules for using this site — what you can and cannot do with what you find here.',
         meta='Last updated · 20 October 2026') +
    doc(
        '<p class="art-lead">By using saagarshrest.com.np you agree to these terms. If you disagree with any part of them, please stop using the site.</p>' +
        h2('The content') +
        ul([
            'All text, images, designs, case studies, code and other materials on this site are owned by Saagar Shrestha unless otherwise credited.',
            'You may read, quote and share excerpts with clear attribution and a link back to the source page.',
            'You may not republish complete articles, case studies or design work as your own, or use them commercially without written permission.',
            'Case studies and client work remain the intellectual property of their respective owners. Nothing here transfers those rights to you.',
        ]) +
        h2('Downloads and products') +
        p('Tools and products offered on this site are provided as-is. Test them on your own data first. I am not liable for lost data or lost profit arising from their use. Free resources may be updated, changed or withdrawn at any time.') +
        h2('Third-party links') +
        p('Links to external sites are provided for convenience. I do not control those sites and am not responsible for their content, accuracy, or practices.') +
        h2('Accuracy') +
        p('I aim for accuracy but make no guarantee that content is complete or error-free. Product UI screenshots may reflect versions that have since changed. Anything published here is general information, not professional advice.') +
        h2('Limitation of liability') +
        p('To the maximum extent permitted by law, I am not liable for any loss or damage arising from your use of this site or its content.') +
        h2('Intellectual property') +
        p('The site’s name, logo, and visual identity are my property. The pixel-art dragon mascot is original work and may not be reused without credit.') +
        h2('Governing law') +
        p('These terms are governed by the laws of Nepal.') +
        h2('Changes') +
        p('These terms may be updated from time to time. Continued use of the site after a change means you accept the revised version.') +
        h2('Contact') +
        p('Questions about these terms? <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a>.')
    ))

# ---------------------------------------------------------------- cookies
PAGES['legal/cookie-policy.html'] = page(
    'Cookie Policy | Saagar Shrestha',
    'What cookies and local storage this website uses.',
    hero('Legal', 'Cookie <em>Policy</em>',
         'A short, honest list of everything this site stores in your browser.',
         meta='Last updated · 20 October 2026') +
    doc(
        '<p class="art-lead">Cookies are small text files a website saves in your browser so it can remember you between visits. “Local storage” works the same way but holds slightly more data.</p>' +
        h2('What this site uses') +
        ul([
            '<strong>Google Analytics cookies</strong> (<code>_ga</code>, <code>_ga_*</code>) — first-party analytics that tell me which pages are read and how many people visit. These expire after up to 24 months.',
            '<strong>Essential preferences</strong> — small values your browser needs to render the site (for example your light/dark preference). These are not tracking and cannot be switched off without breaking the page.',
        ]) +
        h2('What this site does not use') +
        ul([
            'No advertising cookies.',
            'No cross-site tracking cookies.',
            'No third-party marketing or profiling cookies.',
            'No consent wall, because there is nothing to consent to.',
        ]) +
        h2('Managing cookies') +
        p('Every major browser lets you view, block and delete cookies. Blocking analytics cookies will not break the site — you will simply stop appearing in the numbers. On iOS and macOS, use “Do Not Track” in your browser’s privacy settings.') +
        h2('Contact') +
        p('Questions about cookies? <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a>.')
    ))

# ---------------------------------------------------------------- disclaimer
PAGES['legal/disclaimer.html'] = page(
    'Disclaimer | Saagar Shrestha',
    'General disclaimers about the content on this website.',
    hero('Legal', 'Disclaimer',
         'The reasonable-expectations note that should sit under everything on this site.',
         meta='Last updated · 20 October 2026') +
    doc(
        '<p class="art-lead">Everything published here — including articles, case studies, product pages and advice in articles — is provided for general information and educational purposes. It is not professional, legal, financial or medical advice, and it should not be relied on as such.</p>' +
        h2('Design and process claims') +
        p('Numbers, metrics and outcomes described in case studies reflect specific projects in specific contexts. Results depend on the team, the product, the market and the budget. They are not a promise or a guarantee of similar results for your project.') +
        h2('Third-party content') +
        p('Quotes, client names, logos and external links are used with permission or for editorial reference. Any views expressed by third parties are their own, not mine.') +
        h2('Accuracy and availability') +
        p('I work hard to keep content accurate and the site running, but the site is provided "as is" and without warranty of any kind. Content may be changed, corrected or removed at any time without notice.') +
        h2('External links') +
        p('Links to third-party sites are provided for convenience only. I am not responsible for their content, availability, or privacy practices.') +
        h2('Personal advice') +
        p('Nothing here should be substituted for advice tailored to your specific situation. If a decision matters, talk to a qualified professional — and to me about the design and experience side of it.') +
        h2('Contact') +
        p('Spotted something inaccurate? <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a>.')
    ))

# ---------------------------------------------------------------- access
PAGES['legal/accessibility.html'] = page(
    'Accessibility Statement | Saagar Shrestha',
    'An accessibility statement for this website.',
    hero('Standards', 'Accessibility <em>Statement</em>',
         'What I have done to make this site usable for everyone — and where it still falls short.',
         meta='Last reviewed · 20 October 2026') +
    doc(
        '<p class="art-lead">This site aims to meet <strong>WCAG 2.2 Level AA</strong>. Accessibility is treated as part of the design work, not an afterthought bolted on at the end.</p>' +
        h2('What is in place') +
        ul([
            'Semantic HTML landmarks (header, nav, main, footer) so the page structure is clear to assistive technology.',
            'Keyboard-operable navigation, links, buttons and forms, with a visible focus state.',
            'A skip-to-content link on every page.',
            'Text and background contrast that meets AA against the plain black-on-white base palette.',
            'Meaningful alternative text on images, and decorative images marked as decorative.',
            'Responsive layouts that reflow to 320px wide and support 200% text zoom without loss of content.',
            'A reduced-motion mode that respects the “reduce motion” system setting.',
            'The 404 page conveys its meaning in text, not only in pixel art.',
        ]) +
        h2('Known limitations') +
        ul([
            'Some archived third-party embeds and screenshots may not be fully described for screen-reader users.',
            'A few long case-study pages rely on small caption text below the AA contrast threshold.',
        ]) +
        h2('Feedback and contact') +
        p('If something on this site is hard to use, email <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a> with the page address and a description of the problem. I aim to respond within a few working days, and to fix genuine accessibility barriers as a priority.') +
        h2('Enforcement') +
        p('If a barrier persists after contacting me, you can escalate to the relevant consumer protection authority in Nepal.') +
        h2('Related reading') +
        p('I wrote a longer piece on this subject: <a href="/Articles/Designing for Accessibility.html">Designing for Accessibility</a>.')
    ))

# ---------------------------------------------------------------- contact
PAGES['pages/contact.html'] = page(
    'Contact | Saagar Shrestha',
    'Get in touch about design, UX and product work.',
    hero('Contact', 'Let’s <em>talk</em>',
         'A project in mind, a question about the work, or a bug in one of the tools? This is the fastest way to reach me.') +
    """
    <section class="px-6 pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <div class="lg:col-span-7">
                <h2 class="sx-title !text-[clamp(1.8rem,3vw,2.6rem)]">Send a message</h2>
                <p class="sx-lead mt-4">I read everything and reply to most messages within two working days.</p>
                <form class="mt-8 space-y-5" id="contact-form" action="https://formsubmit.co/saagarshrest@gmail.com" method="post" data-contact-form>
                    <input type="hidden" name="_next" value="https://saagarshrest.com.np/pages/thank-you.html">
                    <input type="hidden" name="_captcha" value="false">
                    <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
                    <div>
                        <label for="cf-name" class="block text-sm font-medium mb-2">Name</label>
                        <input id="cf-name" name="name" type="text" required autocomplete="name"
                               class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10">
                    </div>
                    <div>
                        <label for="cf-email" class="block text-sm font-medium mb-2">Email</label>
                        <input id="cf-email" name="email" type="email" required autocomplete="email"
                               class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10">
                    </div>
                    <div>
                        <label for="cf-subject" class="block text-sm font-medium mb-2">What is this about?</label>
                        <select id="cf-subject" name="subject"
                                class="w-full border border-neutral-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10">
                            <option>A new project</option>
                            <option>UX audit / review</option>
                            <option>Design system work</option>
                            <option>Something about the tools here</option>
                            <option>Speaking or writing</option>
                            <option>Something else</option>
                        </select>
                    </div>
                    <div>
                        <label for="cf-msg" class="block text-sm font-medium mb-2">Message</label>
                        <textarea id="cf-msg" name="message" rows="6" required
                                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"></textarea>
                    </div>
                    <button type="submit" id="cf-submit" class="hero-btn">Send message <span class="hero-btn-arrow">↗</span></button>
                    <p class="text-xs text-neutral-500 leading-relaxed">Your message is delivered straight to my inbox through <a href="https://formsubmit.co" class="underline underline-offset-2" target="_blank" rel="noopener">FormSubmit</a>. Nothing is stored on this site.</p>
                    <p id="cf-status" class="hidden text-sm text-neutral-700" role="status" aria-live="polite"></p>
                    <div id="cf-fallback" class="hidden rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                        <p class="text-sm font-medium text-neutral-900">The message couldn’t be sent</p>
                        <p class="mt-2 text-sm text-neutral-600 leading-relaxed">Copy it below and email it to <a href="mailto:saagarshrest@gmail.com" class="underline underline-offset-2">saagarshrest@gmail.com</a>, or open it in your mail app.</p>
                        <textarea id="cf-copy" readonly rows="7" aria-label="Message ready to copy"
                                  class="mt-4 w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-700 focus:outline-none focus:border-neutral-900"></textarea>
                        <div class="mt-3 flex flex-wrap items-center gap-3">
                            <button type="button" id="cf-copy-btn" class="hero-btn !text-sm !px-4 !py-2">Copy message</button>
                            <a id="cf-retry" href="mailto:saagarshrest@gmail.com" class="hero-link !text-sm">Open in mail app</a>
                            <span id="cf-copied" class="hidden text-xs text-neutral-500">Copied</span>
                        </div>
                    </div>
                </form>
            </div>
            <aside class="lg:col-span-5">
                <div class="lg:sticky lg:top-8">
                    <h2 class="sx-title !text-[clamp(1.8rem,3vw,2.6rem)]">Or go direct</h2>
                    <dl class="mt-8 border-t border-neutral-200">
                        <div class="py-4 border-b border-neutral-200">
                            <dt class="sx-label">Email</dt>
                            <dd class="mt-1 text-lg"><a href="mailto:saagarshrest@gmail.com" class="underline underline-offset-4">saagarshrest@gmail.com</a></dd>
                        </div>
                        <div class="py-4 border-b border-neutral-200">
                            <dt class="sx-label">Phone</dt>
                            <dd class="mt-1 text-lg"><a href="tel:+9779860332656" class="underline underline-offset-4">+977-9860332656</a></dd>
                        </div>
                        <div class="py-4 border-b border-neutral-200">
                            <dt class="sx-label">WhatsApp</dt>
                            <dd class="mt-1 text-lg"><a href="https://wa.me/9779860332656" target="_blank" rel="noopener noreferrer" class="underline underline-offset-4">Message on WhatsApp ↗</a></dd>
                        </div>
                        <div class="py-4 border-b border-neutral-200">
                            <dt class="sx-label">Based in</dt>
                            <dd class="mt-1 text-lg">Kathmandu, Nepal <span class="text-neutral-400">·</span> <span id="npt-time">--:--</span> NPT</dd>
                        </div>
                        <div class="py-4">
                            <dt class="sx-label">Status</dt>
                            <dd class="mt-1 text-lg flex items-center gap-3"><span class="ct-status !bg-neutral-900"></span>Available for new projects</dd>
                        </div>
                    </dl>
                    <div class="mt-10">
                        <p class="sx-label">Elsewhere</p>
                        <div class="mt-4 flex flex-wrap gap-3">
                            <a href="https://www.linkedin.com/in/saagarshrest/" target="_blank" rel="noopener noreferrer" class="hero-btn !text-sm !px-4 !py-2">LinkedIn ↗</a>
                            <a href="https://dribbble.com/saagarshrest" target="_blank" rel="noopener noreferrer" class="hero-btn !text-sm !px-4 !py-2">Dribbble ↗</a>
                            <a href="https://medium.com/@saagarshrest" target="_blank" rel="noopener noreferrer" class="hero-btn !text-sm !px-4 !py-2">Medium ↗</a>
                            <a href="https://www.figma.com/@saagarshrest" target="_blank" rel="noopener noreferrer" class="hero-btn !text-sm !px-4 !py-2">Figma ↗</a>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </section>
""",
    extra_tail=CONTACT_JS)

# ---------------------------------------------------------------- thanks
PAGES['pages/thank-you.html'] = page(
    'Thank you | Saagar Shrestha',
    'Your message has been sent.',
    hero('Message sent', 'Thank <em>you</em>',
         'Your message is on its way. I usually reply within two working days.') +
    """
    <section class="px-6 pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <div class="lg:col-span-7">
                <p class="sx-lead">While you wait, a few things you might want to look at:</p>
                <ul class="doc-list list-disc pl-6 space-y-3 mt-6 text-lg">
                    <li><a href="/work/Casestudy.html" class="underline underline-offset-4">Selected case studies</a></li>
                    <li><a href="/products/Products.html" class="underline underline-offset-4">Free tools and products</a></li>
                    <li><a href="/Articles/Article.html" class="underline underline-offset-4">Articles on design and UX</a></li>
                    <li><a href="/about/Resume.html" class="underline underline-offset-4">Resume</a></li>
                </ul>
                <div class="hero-actions mt-10">
                    <a href="/" class="hero-btn">Back to home <span class="hero-btn-arrow">↗</span></a>
                </div>
            </div>
        </div>
    </section>
""")

# ---------------------------------------------------------------- faq
def qa(q, a):
    return f"""<details class="doc-q">
            <summary>
                <span>{q}</span>
                <span class="doc-q__sign" aria-hidden="true">+</span>
            </summary>
            <div class="doc-q__body">{a}</div>
        </details>"""


PAGES['pages/faq.html'] = page(
    'FAQ | Saagar Shrestha',
    'Frequently asked questions about working with Saagar Shrestha.',
    hero('Questions', 'Frequently asked <em>questions</em>',
         'The things people usually want to know before getting in touch.') +
    """
    <section class="px-6 pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <aside class="lg:col-span-4 lg:sticky lg:top-8">
                <div class="art-side__in">
                    <div class="art-read">Still stuck<b>Send the question over</b></div>
                    <p class="sx-lead mt-6">There is no such thing as a silly one. I answer every message myself.</p>
                    <div class="hero-actions mt-6">
                        <a href="/pages/contact.html" class="hero-btn !text-sm !px-5 !py-2.5">Contact me <span class="hero-btn-arrow">↗</span></a>
                    </div>
                </div>
            </aside>
            <div class="lg:col-span-8">
""" + ''.join([
        qa('What do you do?', 'I design digital products and experiences — end-to-end UX, interface design, and design systems. I work with startups and product teams who need a clear, well-crafted interface and a system that scales with them.'),
        qa('Are you available for freelance work?', 'Yes, with limited capacity. The site footer shows the current status, and <a href="/pages/contact.html">the contact page</a> is the fastest way to start a conversation. I take on a small number of engagements at a time so each one gets proper attention.'),
        qa('Where are you based, and do you work remotely?', 'I am based in Kathmandu, Nepal, and work with clients across time zones. Most collaboration happens over calls, shared design files and short written briefs — timezone rarely matters as long as there is overlap for a weekly sync.'),
        qa('How long does a project take?', 'A focused UX audit or design system sprint is typically two to four weeks. A full product engagement runs longer and is scoped in phases, so you get value early rather than all at the end.'),
        qa('What do you charge?', 'I work mostly on an hourly basis at <strong>$25–35 per hour</strong>, or a <strong>fixed monthly price</strong> for ongoing work. Either way the rate is agreed before we start, so there are no surprises on the invoice. Tell me what you need and I will send a proposal.'),
        qa('Do you work with existing design teams?', 'Often. I slot into internal teams for audits, system definition, or hands-on interface work, and I am comfortable working from your research rather than insisting on my own process.'),
        qa('Are the tools on this site free?', 'Yes — every tool in <a href="/products/Products.html">Products</a> is free to use, in the browser, with no account and no data sent to a server. They are built with plain HTML, CSS and JavaScript so they keep working offline.'),
        qa('Can I use the pixel art on this site?', 'The mascot and 404 artwork are original. You are welcome to use them in your own project with a credit line. If you want them without attribution for a commercial product, get in touch and we can sort something out.'),
        qa('Do you write the articles yourself?', 'Yes. Everything in <a href="/Articles/Article.html">Articles</a> is written by me, based on real project experience. Some pieces are also published on Medium.'),
        qa('Can I republish your work?', 'Quote and share with attribution and a link back. Do not republish whole articles or case studies as your own. Full details are in the <a href="/legal/terms.html">Terms of Use</a>.'),
        qa('What is the fastest way to reach you?', 'Email <a href="mailto:saagarshrest@gmail.com">saagarshrest@gmail.com</a> — it lands directly in my inbox and I answer it myself. WhatsApp works too if the message is short.'),
    ]) + """
            </div>
        </div>
    </section>
""")

# ---------------------------------------------------------------- archive
ARTICLES = [
    ('Designing for Accessibility', 'Accessibility is a design decision, not a checklist bolted on at the end.'),
    ('Designing for Emotion', 'How to make an interface feel something, not just work.'),
    ('Revolutionizing User Experience with AI', 'Where AI genuinely changes the way products should be built.'),
    ('Design Thinking an Iterative Process', 'Why the loop matters more than the whiteboard.'),
    ('Why Artificial Intelligence needs Good User Experience', 'Bad AI UX is worse than no AI UX.'),
    ('Data-Driven vs. Intuition-Driven', 'Where each one wins, and how to know which one you are in.'),
]


def rows(items):
    return ''.join(
        f'<a href="{u}"><span>{t}</span>'
        + (f'<span class="doc-rows__note">{d}</span>' if d else '')
        + '</a>' for t, u, d in items)


PAGES['pages/archive.html'] = page(
    'Archive | Saagar Shrestha',
    'Every page, article and case study on saagarshrest.com.np in one place.',
    hero('Everything', 'The <em>archive</em>',
         'Every piece of writing, case study and tool on this site, collected in one place.') +
    """
    <section class="px-6 pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <aside class="lg:col-span-4 hidden lg:block lg:sticky lg:top-8">
                <div class="art-side__in">
                    <div class="art-read">Jump to<b>Archive</b></div>
                    <nav class="art-toc" data-doc-toc aria-label="Archive sections"></nav>
                </div>
            </aside>
            <div class="lg:col-span-8">
                <h2 class="doc-h2">Articles</h2>
                <div class="doc-rows">
""" + rows([(t, f'/Articles/{t}.html', d) for t, d in ARTICLES]) + """
                </div>

                <h2 class="doc-h2">Work</h2>
                <div class="doc-rows">
""" + rows([
        ('Case studies', '/work/Casestudy.html', ''),
        ('Harmony Wallet — crypto wallet (2020)', '/work/Casedetailharmony.html', ''),
        ('Simple Period Tracker — private cycle tracking', '/work/Casedetailperiodtracker.html', ''),
        ('Field service ops — HVAC platform', '/work/Casedetailhvac.html', ''),
        ('Officiti — healthcare platform', '/work/Casedetailofficiti.html', ''),
        ('Ramo Parts — parts commerce', '/work/Casedetailramroparts.html', ''),
        ('ShiftCare', '/work/Shiftcarecase.html', ''),
        ('UX audit', '/work/UXAudit.html', ''),
        ('Clients', '/work/Clients.html', ''),
    ]) + """
                </div>

                <h2 class="doc-h2">Tools &amp; products</h2>
                <div class="doc-rows">
""" + rows([
        ('All products', '/products/Products.html', ''),
        ('Image Cleaner', '/products/ImageCleaner.html', ''),
        ('Design System Creator', '/products/DesignSystemCreator.html', ''),
        ('Commando', '/products/Commando.html', ''),
        ('Kathmandu Shadows', '/products/KathmanduShadows.html', ''),
        ('Period trackers', '/TandC-Period-tracker.html', ''),
    ]) + """
                </div>

                <h2 class="doc-h2">More</h2>
                <div class="doc-rows">
""" + rows([
        ('Design', '/work/Design.html', ''),
        ('Design systems', '/work/DesignSystem.html', ''),
        ('Photos', '/about/Photos.html', ''),
        ('Resume', '/about/Resume.html', ''),
        ('Contact', '/pages/contact.html', ''),
        ('FAQ', '/pages/faq.html', ''),
    ]) + """
                </div>
            </div>
        </div>
    </section>
""")

# ---------------------------------------------------------------- sitemap page
PAGES['pages/sitemap-page.html'] = page(
    'Sitemap | Saagar Shrestha',
    'A human-readable index of every page on saagarshrest.com.np.',
    hero('Index', 'Sitemap',
         'Every page on this site, in one list.') +
    """
    <section class="px-6 pb-16 md:pb-24">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
            <aside class="lg:col-span-4 lg:sticky lg:top-8">
                <div class="art-side__in">
                    <div class="art-read">Machine-readable<b>sitemap.xml · feed.xml</b></div>
                    <p class="sx-lead mt-6">The XML version is for search engines, the RSS feed is for readers.</p>
                    <div class="hero-actions mt-6">
                        <a href="/sitemap.xml" class="hero-btn !text-sm !px-5 !py-2.5">sitemap.xml <span class="hero-btn-arrow">↗</span></a>
                        <a href="/feed.xml" class="hero-link">RSS feed</a>
                    </div>
                </div>
            </aside>
            <div class="lg:col-span-8">
                <div class="doc-rows">
""" + rows([
        ('Home', '/', 'Introduction and latest work'),
        ('Design', '/work/Design.html', 'Design approach and services'),
        ('Articles', '/Articles/Article.html', 'Writing on design and UX'),
        ('Designing for Accessibility', '/Articles/Designing for Accessibility.html', 'Article'),
        ('Designing for Emotion', '/Articles/Designing for Emotion.html', 'Article'),
        ('Revolutionizing User Experience with AI', '/Articles/Revolutionizing User Experience with AI.html', 'Article'),
        ('Design Thinking an Iterative Process', '/Articles/Design Thinking an Iterative Process.html', 'Article'),
        ('Why Artificial Intelligence needs Good User Experience', '/Articles/Why Artificial Intelligence needs Good User Experience.html', 'Article'),
        ('Data-Driven vs. Intuition-Driven', '/Articles/Data-Driven vs. Intuition-Driven.html', 'Article'),
        ('Case Study', '/work/Casestudy.html', 'Selected engagements'),
        ('Harmony Wallet', '/work/Casedetailharmony.html', 'Crypto wallet case study (2020)'),
        ('Simple Period Tracker', '/work/Casedetailperiodtracker.html', 'Period tracker case study'),
        ('Field Service Ops', '/work/Casedetailhvac.html', 'HVAC field service case study'),
        ('Officiti', '/work/Casedetailofficiti.html', 'Healthcare platform case study'),
        ('Ramo Parts', '/work/Casedetailramroparts.html', 'Parts commerce case study'),
        ('Products', '/products/Products.html', 'Free tools and products'),
        ('Design System', '/work/DesignSystem.html', 'Design system work'),
        ('Photos', '/about/Photos.html', 'Photography'),
        ('Resume', '/about/Resume.html', 'Experience and skills'),
        ('Archive', '/pages/archive.html', 'Everything on the site'),
        ('Contact', '/pages/contact.html', 'Get in touch'),
        ('FAQ', '/pages/faq.html', 'Common questions'),
        ('Privacy Policy', '/legal/privacy.html', 'Legal'),
        ('Terms of Use', '/legal/terms.html', 'Legal'),
        ('Cookie Policy', '/legal/cookie-policy.html', 'Legal'),
        ('Disclaimer', '/legal/disclaimer.html', 'Legal'),
        ('Accessibility Statement', '/legal/accessibility.html', 'Standards'),
    ]) + """
                </div>
            </div>
        </div>
    </section>
""")

# --- write everything ------------------------------------------------------
for name, html in PAGES.items():
    os.makedirs(os.path.dirname(os.path.join(ROOT, name)), exist_ok=True)
    open(os.path.join(ROOT, name), 'w', encoding='utf-8').write(html)
    print('wrote', name)

print('done')
