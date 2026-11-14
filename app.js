(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const modal = $('#quiz'), stepEl = $('#step'), bar = $('#bar');
  const params = new URLSearchParams(location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid']
    .forEach((k) => { if (params.get(k)) utm[k] = params.get(k); });

  const STEPS = [
    { k: 'name', title: 'Ismingiz nima?', ph: 'Ism', ac: 'name', min: 2, err: 'Ismingizni kiriting' },
    { k: 'phone', title: 'Telefon raqamingiz?', ph: '+998 90 123 45 67', ac: 'tel', type: 'tel', err: "Telefon raqamni to'g'ri kiriting",
      ok: (v) => v.replace(/\D/g, '').length >= 9 },
    { k: 'telegram', title: 'Telegram username?', sub: 'Masalan: @username', ph: '@username', min: 2, err: 'Telegram username kiriting' },
    { k: 'business', title: 'Qanday biznes bilan shug\'ullanasiz?', sub: "Masalan: telefon do'koni, avtosalon, mebel", ph: 'Biznesingiz', min: 2, err: 'Biznesingizni yozing' },
    { k: 'location', title: 'Biznesingiz qayerda joylashgan?', sub: 'Shahar yoki tuman', ph: 'Toshkent, Chilonzor', min: 2, err: 'Joylashuvni yozing' },
  ];
  const data = {};
  let i = 0, started = false;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function show() {
    const s = STEPS[i], last = i === STEPS.length - 1;
    bar.style.width = Math.round((i / STEPS.length) * 100 + 8) + '%';
    stepEl.innerHTML = `<form class="fade" novalidate>
      <h2 class="q-title">${s.title}</h2>${s.sub ? `<p class="q-sub">${s.sub}</p>` : '<div style="height:12px"></div>'}
      <input class="field" name="v" placeholder="${esc(s.ph)}" ${s.type ? `type="${s.type}" inputmode="tel"` : ''} ${s.ac ? `autocomplete="${s.ac}"` : ''} maxlength="120" value="${esc(data[s.k] || '')}">
      <p class="err" id="e"></p>
      <div class="row">${i ? '<button class="btn" type="button" id="back">Orqaga</button>' : ''}
      <button class="btn primary" type="submit">${last ? 'Yuborish' : 'Davom etish'}</button></div></form>`;
    const f = stepEl.querySelector('form'), inp = f.v;
    setTimeout(() => inp.focus(), 50);
    const back = $('#back');
    if (back) back.onclick = () => { data[s.k] = inp.value.trim(); i--; show(); };
    f.onsubmit = (e) => {
      e.preventDefault();
      const v = inp.value.trim();
      const ok = s.ok ? s.ok(v) : v.length >= s.min;
      if (!ok) { $('#e').textContent = s.err; return; }
      data[s.k] = v;
      if (last) return submit(); i++; show();
    };
  }

  async function submit() {
    bar.style.width = '95%';
    stepEl.innerHTML = '<div class="thanks fade"><p class="q-sub">Yuborilmoqda...</p></div>';
    const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, utm, referrer: document.referrer }) }).catch(() => null);
    if (r && r.ok) {
      bar.style.width = '100%';
      stepEl.innerHTML = '<div class="thanks fade"><h2 style="text-align:center">Rahmat!</h2><p class="q-sub">Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.</p><button class="btn primary" id="done" type="button">Yopish</button></div>';
      $('#done').onclick = close; i = 0; Object.keys(data).forEach((k) => delete data[k]);
    } else {
      i = STEPS.length - 1; show(); $('#e').textContent = "Xatolik. Qayta urinib ko'ring.";
    }
  }

  function open() { modal.classList.add('open'); document.body.classList.add('lock'); if (!started) { started = true; show(); } }
  function close() { modal.classList.remove('open'); document.body.classList.remove('lock'); if (location.hash === '#quiz') history.replaceState(null, '', location.pathname + location.search); started = false; i = 0; }
  document.querySelectorAll('[data-open]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  $('#close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  if (location.hash === '#quiz') open();
})();
