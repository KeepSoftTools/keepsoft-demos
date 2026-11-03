/*!
 * TradePro - main.js (vanilla JS, no dependencies)
 * Author: Keepsoft (https://codecanyon.net/user/keepsoft)
 * Copyright (C) 2026 Keepsoft
 * Modules: theme, header, mobile menu, back-to-top, counters, accordion, tabs,
 * testimonial slider, before/after, project filter, forms, cookie notice, reveal.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, value) {
    try {
      if (value === undefined) { return window.localStorage.getItem(key); }
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  root.classList.remove('no-js');
  root.classList.add('js');

  /* ---------- Theme (data-theme on <html>) ---------- */
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    $$('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', String(t === 'dark'));
    });
  }
  var saved = store('tradepro-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  $$('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store('tradepro-theme', next);
    });
  });

  /* ---------- Sticky header shadow ---------- */
  var header = $('.header');
  var toTop = $('.to-top');
  function onScroll() {
    var y = window.pageYOffset;
    if (header) { header.classList.toggle('is-stuck', y > 8); }
    if (toTop) { toTop.classList.toggle('is-visible', y > 600); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('.menu-toggle');
  var nav = $('#site-nav');
  function setMenu(open) {
    if (!menuBtn || !nav) { return; }
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) { setMenu(false); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) { setMenu(false); } });
  }

  /* ---------- Counters ---------- */
  var counters = $$('[data-count]');
  function formatNum(n, el) {
    return (el.getAttribute('data-prefix') || '') + n.toLocaleString('en-US') + (el.getAttribute('data-suffix') || '');
  }
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    if (reduceMotion) { el.textContent = formatNum(end, el); return; }
    var dur = 1600, start = null;
    function step(ts) {
      if (start === null) { start = ts; }
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNum(Math.round(end * eased), el);
      if (p < 1) { window.requestAnimationFrame(step); }
    }
    window.requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { co.observe(c); });
    } else { counters.forEach(runCounter); }
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { ro.observe(r); });
  } else { reveals.forEach(function (r) { r.classList.add('is-in'); }); }

  /* ---------- Accordion ---------- */
  $$('.accordion').forEach(function (acc) {
    var single = acc.hasAttribute('data-single');
    $$('.acc-btn', acc).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc-item');
        var open = btn.getAttribute('aria-expanded') === 'true';
        if (single && !open) {
          $$('.acc-btn', acc).forEach(function (b) {
            b.setAttribute('aria-expanded', 'false');
            b.closest('.acc-item').classList.remove('is-open');
          });
        }
        btn.setAttribute('aria-expanded', String(!open));
        item.classList.toggle('is-open', !open);
      });
    });
  });

  /* ---------- Tabs ---------- */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) { tab.focus(); }
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') { n = tabs[(i + 1) % tabs.length]; }
        else if (e.key === 'ArrowLeft') { n = tabs[(i - 1 + tabs.length) % tabs.length]; }
        else if (e.key === 'Home') { n = tabs[0]; }
        else if (e.key === 'End') { n = tabs[tabs.length - 1]; }
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- Testimonial slider ---------- */
  $$('[data-slider]').forEach(function (sl) {
    var track = $('.slider-track', sl);
    var slides = $$('.slide', sl);
    var dotsWrap = $('.dots', sl);
    var prev = $('[data-prev]', sl), next = $('[data-next]', sl);
    var live = $('.slider-viewport', sl);
    var idx = 0, timer = null;
    var dots = [];
    slides.forEach(function (s, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'dot';
      d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      d.addEventListener('click', function () { go(i); stop(); });
      dotsWrap.appendChild(d); dots.push(d);
    });
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * idx) + '%)';
      slides.forEach(function (s, n) {
        s.setAttribute('aria-hidden', String(n !== idx));
        if ('inert' in s) { s.inert = n !== idx; }
      });
      dots.forEach(function (d, n) { d.setAttribute('aria-current', String(n === idx)); });
    }
    function play() {
      if (reduceMotion || timer) { return; }
      timer = window.setInterval(function () { go(idx + 1); }, 7000);
    }
    function stop() { window.clearInterval(timer); timer = null; }
    prev.addEventListener('click', function () { go(idx - 1); stop(); });
    next.addEventListener('click', function () { go(idx + 1); stop(); });
    sl.addEventListener('mouseenter', stop);
    sl.addEventListener('focusin', stop);
    sl.addEventListener('mouseleave', play);
    live.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(idx - 1); } else if (e.key === 'ArrowRight') { go(idx + 1); }
    });
    go(0); play();
  });

  /* ---------- Before / after ---------- */
  $$('[data-ba]').forEach(function (ba) {
    var range = $('.ba-range', ba);
    function set(v) { ba.style.setProperty('--pos', v + '%'); range.setAttribute('aria-valuetext', v + '% before'); }
    range.addEventListener('input', function () { set(range.value); });
    set(range.value);
  });

  /* ---------- Project filter ---------- */
  $$('[data-filter-group]').forEach(function (group) {
    var btns = $$('.filter-btn', group);
    var items = $$('[data-category]', group.parentNode);
    var status = $('.filter-status', group.parentNode);
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var shown = 0;
        items.forEach(function (it) {
          var match = f === 'all' || it.getAttribute('data-category').split(' ').indexOf(f) > -1;
          it.hidden = !match;
          if (match) { shown++; }
        });
        if (status) { status.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's'); }
      });
    });
  });

  /* ---------- Forms (client-side validation; connect to your backend, see docs) ---------- */
  $$('form[data-form]').forEach(function (form) {
    var status = $('.form-status', form);
    $$('.input, .select, .textarea', form).forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value) { f.classList.toggle('is-invalid', !f.checkValidity()); } });
      f.addEventListener('input', function () { if (f.classList.contains('is-invalid')) { f.classList.toggle('is-invalid', !f.checkValidity()); } });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      $$('.input, .select, .textarea', form).forEach(function (f) {
        var bad = !f.checkValidity();
        f.classList.toggle('is-invalid', bad);
        if (bad && !first) { first = f; }
      });
      if (first) { first.focus(); return; }
      var action = form.getAttribute('data-endpoint');
      var done = function () {
        form.reset();
        if (status) { status.classList.add('is-visible'); status.focus(); }
      };
      if (action) {
        window.fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) { throw new Error('Request failed'); } done(); })
          .catch(function () {
            if (status) { status.textContent = 'Sorry, something went wrong. Please call us instead.'; status.classList.add('is-visible'); }
          });
      } else { done(); }
    });
  });

  /* ---------- Cookie notice ---------- */
  var cookie = $('.cookie');
  if (cookie && !store('tradepro-cookie')) {
    window.setTimeout(function () { cookie.classList.add('is-visible'); }, 800);
  }
  $$('[data-cookie]', cookie || document).forEach(function (b) {
    b.addEventListener('click', function () {
      store('tradepro-cookie', b.getAttribute('data-cookie'));
      cookie.classList.remove('is-visible');
    });
  });
})();
