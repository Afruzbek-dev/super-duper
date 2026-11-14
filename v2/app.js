(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const el = $('#step'), dots = $('#dots');
  const BIZ = [['📱', 'Telefon va texnika'], ['🚗', 'Avto / moto'], ['🛋️', 'Mebel'], ['👕', 'Kiyim-kechak'], ['🧱', 'Qurilish mollari'], ['✏️', 'Boshqa']];
  const CITY = [['Toshkent'], ['Samarqand'], ['Andijon'], ['Farg\'ona'], ['Namangan'], ['Boshqa']];
  const S = [
    { k: 'name', q: 'Ismingiz nima?', ph: 'Ism', ac: 'name', ok: (v) => v.length >= 2, err: 'Ismingizni kiriting' },
    { k: 'phone', q: 'Telefon raqamingiz?', qs: "Siz bilan shu raqam orqali bog'lanamiz", ph: '+998 90 123 45 67', type: 'tel', ac: 'tel', ok: (v) => v.replace(/\D/g, '').length >= 9, err: "Telefon raqamni to'g'ri kiriting" },
    { k: 'telegram', q: 'Telegram username?', qs: 'Masalan: @username', ph: '@username', ok: (v) => v.length >= 2, err: 'Telegram username kiriting' },
    { k: 'business', q: 'Nima sotasiz?', qs: 'Biznesingizga eng mos variantni tanlang', chips: BIZ, other: 'Biznesingizni yozing', icons: true },
    { k: 'location', q: 'Qayerda joylashgan?', qs: 'Shaharni tanlang', chips: CITY, other: 'Shahar / tuman nomi' },
  ];
  const data = {}; let i = 0;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  dots.innerHTML = S.map(() => '<i></i>').join('');

  function paint() { dots.querySelectorAll('i').forEach((d, n) => d.classList.toggle('on', n <= i)); }
  function next(v) { data[S[i].k] = v; if (i === S.length - 1) return finish(); i++; show(); }

  function show() {
    paint(); const s = S[i];
    const back = i ? '<button class="back" id="back" type="button">← Orqaga</button>' : '';
    if (s.chips) {
      el.innerHTML = `<div class="fade">${back}<h2 class="q">${s.q}</h2><p class="qs">${s.qs}</p>
        <div class="chips">${s.chips.map(([a, b], n) => `<button class="chip" data-n="${n}" type="button">${b ? `<span>${a}</span>${b}` : a}</button>`).join('')}</div>
        <form id="of" class="fade" hidden novalidate><input class="field" name="v" placeholder="${esc(s.other)}" maxlength="120"><p class="err" id="e"></p>
        <div class="row"><button class="btn primary" type="submit">Davom etish</button></div></form></div>`;
      const f = $('#of');
      el.querySelectorAll('.chip').forEach((c) => c.onclick = () => {
        const n = +c.dataset.n, last = n === s.chips.length - 1;
        el.querySelectorAll('.chip').forEach((x) => x.classList.remove('sel')); c.classList.add('sel');
        if (last) { f.hidden = false; f.v.focus(); } else { const [a, b] = s.chips[n]; setTimeout(() => next(b || a), 180); }
      });
      f.onsubmit = (e) => { e.preventDefault(); const v = f.v.value.trim(); if (v.length < 2) return ($('#e').textContent = 'Yozib qoldiring'); next(v); };
    } else {
      el.innerHTML = `<form class="fade" novalidate>${back}<h2 class="q">${s.q}</h2>${s.qs ? `<p class="qs">${s.qs}</p>` : '<div style="height:10px"></div>'}
        <input class="field" name="v" placeholder="${esc(s.ph)}" ${s.type ? `type="${s.type}" inputmode="tel"` : ''} ${s.ac ? `autocomplete="${s.ac}"` : ''} maxlength="100" value="${esc(data[s.k] || '')}">
        <p class="err" id="e"></p><div class="row"><button class="btn primary" type="submit">Davom etish</button></div></form>`;
      const f = el.querySelector('form'); setTimeout(() => f.v.focus(), 50);
      f.onsubmit = (e) => { e.preventDefault(); const v = f.v.value.trim(); if (!s.ok(v)) return ($('#e').textContent = s.err); next(v); };
    }
    const b = $('#back'); if (b) b.onclick = () => { i--; show(); };
  }

  async function finish() {
    el.innerHTML = '<div class="thanks fade"><p class="qs">Yuborilmoqda...</p></div>';
    const ok = await window.sendLead(data);
    if (ok) { dots.querySelectorAll('i').forEach((d) => d.classList.add('on')); el.innerHTML = '<div class="thanks fade"><div class="big">🎉</div><h2 class="q">Rahmat!</h2><p class="qs">Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.</p></div>'; }
    else { i = S.length - 1; show(); }
  }
  show();
})();
