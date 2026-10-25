/* Contact form without a backend of our own.
   The site is static, so the message is POSTed in the background to
   FormSubmit's AJAX endpoint, which emails it to me. The visitor stays on the
   page and sees the result inline. The same message is also sent as a lead to
   my HVAC management system. If both requests fail, we reveal the text with a
   copy button and a mailto: link so the message is never lost. */
(function () {
    'use strict';

    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var TO = 'saagarshrest@gmail.com';
    var ENDPOINT = 'https://formsubmit.co/ajax/' + TO;
    var LEADS = 'https://hvac-management-system-rouge.vercel.app/api/v1/public/leads/bPa2gFptFDN7D9ZnUX9c1-H8l2HSuQ2_';
    var submitBtn = document.getElementById('cf-submit');
    var fallback = document.getElementById('cf-fallback');
    var copyBox = document.getElementById('cf-copy');
    var copyBtn = document.getElementById('cf-copy-btn');
    var copied = document.getElementById('cf-copied');
    var retry = document.getElementById('cf-retry');
    var status = document.getElementById('cf-status');
    var btnLabel = submitBtn ? submitBtn.innerHTML : '';

    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function say(text) {
        if (!status) return;
        status.textContent = text;
        status.classList.remove('hidden');
    }

    function busy(on) {
        if (!submitBtn) return;
        submitBtn.disabled = on;
        submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
        submitBtn.innerHTML = on ? 'Sending…' : btnLabel;
    }

    function showFallback(subject, body) {
        if (copyBox) copyBox.value = body;
        if (retry) {
            retry.href = 'mailto:' + TO +
                         '?subject=' + encodeURIComponent(subject) +
                         '&body=' + encodeURIComponent(body);
        }
        if (copied) copied.classList.add('hidden');
        if (fallback) fallback.classList.remove('hidden');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = val('cf-name');
        var email = val('cf-email');
        var topic = val('cf-subject') || 'Website enquiry';
        var message = val('cf-msg');
        var honey = form.querySelector('[name="_honey"]');

        if (!name || !email || !message) {
            form.reportValidity();
            return;
        }

        // Bots fill every field; pretend it worked and send nothing.
        if (honey && honey.value) {
            form.reset();
            say('Thanks — your message has been sent.');
            return;
        }

        var subject = topic + ' — ' + name;
        var body = 'Name: ' + name + '\n' +
                   'Email: ' + email + '\n\n' +
                   message + '\n';

        if (fallback) fallback.classList.add('hidden');
        busy(true);
        say('Sending your message…');

        var mail = fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: name,
                email: email,
                topic: topic,
                message: message,
                _subject: subject,
                _replyto: email,
                _template: 'table',
                _captcha: 'false'
            })
        })
            .then(function (res) {
                return res.json().then(function (data) {
                    if (!res.ok || String(data.success) !== 'true') {
                        throw new Error(data.message || 'Request failed');
                    }
                });
            });

        var lead = fetch(LEADS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                email: email,
                description: topic + '\n\n' + message,
                serviceType: 'OTHER',
                pageUrl: location.href,
                website: ''
            })
        })
            .then(function (res) {
                if (!res.ok) throw new Error('Lead request failed');
            });
        lead.catch(function () {});

        // Sent if either delivery worked.
        mail.catch(function () { return lead; })
            .then(function () {
                form.reset();
                say('Thanks, ' + name + ' — your message has been sent. I’ll reply to ' + email + ' soon.');
            })
            .catch(function () {
                say('Sorry, something went wrong and your message wasn’t sent.');
                showFallback(subject, body);
            })
            .then(function () {
                busy(false);
            });
    });

    if (copyBtn && copyBox) {
        copyBtn.addEventListener('click', function () {
            function done() {
                if (copied) copied.classList.remove('hidden');
                copyBtn.textContent = 'Copied';
                setTimeout(function () {
                    copyBtn.textContent = 'Copy message';
                }, 2000);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyBox.value).then(done, function () {
                    copyBox.select();
                    try { document.execCommand('copy'); } catch (err) {}
                    done();
                });
            } else {
                copyBox.select();
                try { document.execCommand('copy'); } catch (err) {}
                done();
            }
        });
    }
})();
