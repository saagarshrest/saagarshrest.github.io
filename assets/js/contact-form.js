/* Contact form without a backend.
   The site is static, so instead of POSTing somewhere we compose the message
   and hand it to the visitor's own mail app (mailto:). Nothing leaves the
   browser unless they press send there. If no mail handler is configured we
   reveal the same text with a copy button. */
(function () {
    'use strict';

    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var TO = 'saagarshrest@gmail.com';
    var fallback = document.getElementById('cf-fallback');
    var copyBox = document.getElementById('cf-copy');
    var copyBtn = document.getElementById('cf-copy-btn');
    var copied = document.getElementById('cf-copied');
    var retry = document.getElementById('cf-retry');
    var status = document.getElementById('cf-status');

    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = val('cf-name');
        var email = val('cf-email');
        var topic = val('cf-subject') || 'Website enquiry';
        var message = val('cf-msg');

        if (!name || !email || !message) {
            form.reportValidity();
            return;
        }

        var subject = topic + ' — ' + name;
        var body = 'Name: ' + name + '\n' +
                   'Email: ' + email + '\n\n' +
                   message + '\n';

        var href = 'mailto:' + TO +
                   '?subject=' + encodeURIComponent(subject) +
                   '&body=' + encodeURIComponent(body);

        if (copyBox) copyBox.value = body;
        if (retry) retry.href = href;
        if (fallback) fallback.classList.remove('hidden');
        if (copied) copied.classList.add('hidden');

        if (status) {
            status.textContent = href.length > 1800
                ? 'Your email app should be opening. This message is long, so if it arrives cut short, copy it below instead.'
                : 'Your email app should be opening with the message ready to send.';
            status.classList.remove('hidden');
        }

        // Give the browser a tick to paint the fallback before handing off.
        setTimeout(function () {
            window.location.href = href;
        }, 60);
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
