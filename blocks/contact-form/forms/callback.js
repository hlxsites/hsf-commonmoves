/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let recaptchaToken = null;

function verifyCallback(resp) {
  recaptchaToken = resp;
}

function onloadCallback() {
  grecaptcha.render('captcha-20285', {
    sitekey: window.placeholders.default.recaptchaSitekey,
    callback: verifyCallback,
  });
}
