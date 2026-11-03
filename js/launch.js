/* Keepsoft demo launcher. Builds the Playground blueprint in the browser from this site's own address
   and opens https://playground.wordpress.net/#<base64 blueprint>. No build step, no server. */
(function () {
  var me = document.currentScript;
  var root = me && me.src ? me.src.replace(/\/js\/launch\.js(\?.*)?$/, '') : location.href.replace(/\/(demo\/[^/]*|index\.html)?(\?.*|#.*)?$/, '');
  var base = ((window.KEEPSOFT_BASE || root) + '').replace(/\/+$/, '');
  var buyMap = window.KEEPSOFT_BUY || {};

  function ascii(s) { return s.replace(/[\u007f-￿]/g, function (c) { return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4); }); }

  function build(slug) {
    return fetch(base + '/blueprints/' + slug + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not load blueprint (' + r.status + ')');
      return r.text();
    }).then(function (txt) {
      var buy = buyMap[slug] || 'https://codecanyon.net/user/keepsoft';
      txt = txt.split('__BASE__').join(base).split('__BUY__').join(JSON.stringify(buy).slice(1, -1));
      var json = ascii(JSON.stringify(JSON.parse(txt)));
      return 'https://playground.wordpress.net/#' + btoa(json);
    });
  }

  window.KeepsoftLaunch = { base: base, build: build };

  // Interstitial pages (demo/<slug>.html) set data-slug on <body>.
  var slug = document.body && document.body.getAttribute('data-slug');
  if (!slug) return;
  var status = document.getElementById('status'), btn = document.getElementById('open'), count = document.getElementById('count');
  var target = null, left = 2, timer;
  function go() { if (target) { clearInterval(timer); location.replace(target); } }
  if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); go(); });
  build(slug).then(function (url) {
    target = url; if (btn) { btn.classList.remove('is-disabled'); btn.setAttribute('href', url); }
    timer = setInterval(function () {
      left--; if (count) count.textContent = Math.max(left, 0);
      if (left <= 0) { if (status) status.textContent = 'Opening WordPress Playground… keep this tab open.'; go(); }
    }, 1000);
  }).catch(function (e) {
    if (status) status.textContent = 'Sorry, the demo could not be started: ' + e.message + '. Please reload the page.';
    document.body.classList.add('failed');
  });
})();
