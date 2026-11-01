/* Portfolio behaviour: scroll-spy, theme, mobile rail, reflections switcher, skill filter, image viewer */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* theme (remembered when the browser allows it) */
  var root = document.documentElement, btn = $('#theme');
  var saved = null; try { saved = localStorage.getItem('ja-theme'); } catch (e) {}
  if (!saved && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) saved = 'dark';
  function setTheme(t) { root.setAttribute('data-theme', t); btn.textContent = t === 'dark' ? '☀ Light mode' : '☾ Dark mode'; try { localStorage.setItem('ja-theme', t); } catch (e) {} }
  setTheme(saved || 'light');
  btn.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

  /* mobile rail */
  var rail = $('#rail');
  $('#menu').addEventListener('click', function () { rail.classList.toggle('open'); });
  $$('#rail a').forEach(function (a) { a.addEventListener('click', function () { rail.classList.remove('open'); }); });

  /* scroll-spy */
  var links = {}; $$('#rail li a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var secs = $$('section.chapter');
  var up = $('#up');
  function spy() {
    var y = window.scrollY + window.innerHeight * 0.3, cur = null;
    secs.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    Object.keys(links).forEach(function (k) { links[k].classList.toggle('on', k === cur); });
    up.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', spy, { passive: true }); spy();
  up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* reflections switcher (Semester 1) */
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.classList.remove('on'); });
      $$('.tabpane').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); $('#' + b.dataset.pane).classList.add('on');
    });
  });

  /* skill filter: click a skill to light up the matching CV entries */
  var active = null, rows = $$('.ledger[data-skills]'), chips = $$('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var k = c.dataset.skill;
      active = active === k ? null : k;
      chips.forEach(function (x) { x.classList.toggle('on', !!active && x.dataset.skill === active); x.classList.toggle('off', !!active && x.dataset.skill !== active); });
      rows.forEach(function (r) {
        var has = (r.dataset.skills || '').split(' ').indexOf(active) > -1;
        r.classList.toggle('hit', !!active && has); r.classList.toggle('dim', !!active && !has);
      });
    });
  });

  /* image viewer */
  var dlg = $('#viewer'), big = $('#viewer-img'), cap = $('#viewer-cap');
  $$('.shot').forEach(function (s) {
    s.addEventListener('click', function () {
      var img = $('img', s); big.src = img.src; big.alt = img.alt; cap.textContent = img.alt;
      if (dlg.showModal) dlg.showModal(); else window.open(img.src);
    });
  });
  $('#viewer-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
})();
