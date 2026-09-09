/* =========================================================
   Swoop Window Cleaning — site interactions
   Vanilla JS, no dependencies, no external requests.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile navigation ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    // close when a link inside the menu is tapped
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        burger.focus();
      }
    });

    // close when tapping the dimmed backdrop
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      setNav(false);
    });

    // reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && nav.classList.contains('is-open')) setNav(false);
    });
  }

  /* ---------- scroll reveal ----------
     IntersectionObserver drives the staggered cascade, but on a fast jump
     (anchor link, End key, flick scroll) elements can be skipped past without
     ever intersecting. A sweep keeps those from being stranded invisible. */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function reveal(el, stagger) {
    if (el.classList.contains('is-visible')) return;
    if (stagger) {
      var siblings = Array.prototype.slice.call(el.parentElement ? el.parentElement.children : []);
      var index = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(Math.max(index, 0) * 70, 350) + 'ms';
    }
    el.classList.add('is-visible');
  }

  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { reveal(el, false); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target, true);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { observer.observe(el); });

    // Safety net: anything at or above the fold must be visible.
    var sweeping = false;
    function sweep() {
      sweeping = false;
      var h = window.innerHeight || document.documentElement.clientHeight;
      for (var i = revealables.length - 1; i >= 0; i--) {
        var el = revealables[i];
        if (el.classList.contains('is-visible')) { revealables.splice(i, 1); continue; }
        if (el.getBoundingClientRect().top < h) {
          reveal(el, false);
          observer.unobserve(el);
          revealables.splice(i, 1);
        }
      }
    }
    function queueSweep() {
      if (sweeping) return;
      sweeping = true;
      window.requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep);
    window.addEventListener('load', queueSweep);
    queueSweep();
  }

  /* ---------- duplicate marquee content for a seamless loop ---------- */
  var track = document.querySelector('.marquee__track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- quote form validation ---------- */
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');

  function showError(input, message) {
    var field = input.closest('.field');
    if (field) field.classList.add('is-invalid');
    var slot = document.querySelector('.error[data-for="' + input.id + '"]');
    if (slot) slot.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var field = input.closest('.field');
    if (field) field.classList.remove('is-invalid');
    var slot = document.querySelector('.error[data-for="' + input.id + '"]');
    if (slot) slot.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function isPhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  if (form) {
    var name = form.querySelector('#name');
    var phone = form.querySelector('#phone');
    var email = form.querySelector('#email');

    [name, phone, email].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () { clearError(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      if (status) status.textContent = '';

      if (!name.value.trim()) {
        showError(name, 'Please tell us your name.');
        valid = false;
      } else {
        clearError(name);
      }

      if (!isPhone(phone.value)) {
        showError(phone, 'Enter a phone number we can reach you at.');
        valid = false;
      } else {
        clearError(phone);
      }

      if (!isEmail(email.value)) {
        showError(email, 'Enter a valid email address.');
        valid = false;
      } else {
        clearError(email);
      }

      if (!valid) {
        var firstInvalid = form.querySelector('.field.is-invalid input');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend on this static site — hand the request to the customer's
      // mail client, pre-filled, so nothing is lost.
      var service = form.querySelector('#service');
      var city = form.querySelector('#city');
      var message = form.querySelector('#message');

      var body =
        'Name: ' + name.value.trim() + '\n' +
        'Phone: ' + phone.value.trim() + '\n' +
        'Email: ' + email.value.trim() + '\n' +
        'City / area: ' + (city && city.value.trim() ? city.value.trim() : '—') + '\n' +
        'Service needed: ' + (service ? service.value : '—') + '\n\n' +
        'Details:\n' + (message && message.value.trim() ? message.value.trim() : '—');

      var href = 'mailto:hello@swoopwindowcleaning.com' +
        '?subject=' + encodeURIComponent('Free quote request — ' + name.value.trim()) +
        '&body=' + encodeURIComponent(body);

      if (status) {
        status.textContent = 'Thanks ' + name.value.trim().split(' ')[0] +
          '! Opening your email app to send this to our team — or just call 602-603-5560.';
      }

      window.location.href = href;
      form.reset();
    });
  }
})();
