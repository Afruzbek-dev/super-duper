(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const modal = $('#quiz'), stepEl = $('#step');
  const prog = modal.querySelector('.progress'); if (prog) prog.style.display = 'none';
  const F = [
    { k: 'name', l: 'Ism', ph: 'Ismingiz', ac: 'name', ok: (v) => v.length >= 2, err: 'Ismingizni kiriting' },
    { k: 'phone', l: 'Telefon raqam', ph: '+998 90 123 45 67', type: 'tel', ac: 'tel', ok: (v) => v.replace(/\D/g, '').length >= 9, err: "Telefon raqamni to'g'ri kiriting" },
    { k: 'telegram', l: 'Telegram', ph: '@username', ok: (v) => v.length >= 2, err: 'Telegram username kiriting' },
    { k: 'business', l: 'Biznesingiz', ph: "Masalan: telefon do'koni, avtosalon", ok: (v) => v.length >= 2, err: 'Biznesingizni yozing' },
    { k: 'location', l: 'Qayerda joylashgan', ph: 'Shahar / tuman', ok: (v) => v.length >= 2, err: 'Joylashuvni yozing' },
  ];
  let intent = 'shartnoma';
  function render() {
    stepEl.innerHTML = `<form class="fade sf" novalidate>
      <h2 class="q-title">Shartnoma rasmiylashtirish</h2><p class="q-sub">Ma'lumotlaringizni qoldiring, biz siz bilan bog'lanamiz.</p>
      ${F.map((f) => `<label class="field-l" for="f-${f.k}">${f.l}</label>
      <input class="field" id="f-${f.k}" name="${f.k}" placeholder="${f.ph}" ${f.type ? `type="${f.type}" inputmode="tel"` : ''} ${f.ac ? `autocomplete="${f.ac}"` : ''} maxlength="120"><p class="err" data-e="${f.k}"></p>`).join('')}
      <button class="btn primary block" type="submit" style="margin-top:10px">Yuborish</button>
      <p class="err" id="ge"></p><p class="note">Ma'lumotlaringiz faqat siz bilan bog'lanish uchun ishlatiladi.</p></form>`;
    const f = stepEl.querySelector('form');
    f.onsubmit = async (e) => {
      e.preventDefault(); const data = { intent }; let ok = true, first = null;
      F.forEach((x) => { const v = f[x.k].value.trim(); const good = x.ok(v); stepEl.querySelector(`[data-e="${x.k}"]`).textContent = good ? '' : x.err; if (!good) { ok = false; first = first || f[x.k]; } data[x.k] = v; });
      if (!ok) return first.focus();
      const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Yuborilmoqda...';
      if (await window.sendLead(data)) stepEl.innerHTML = '<div class="thanks fade"><h2 class="q-title" style="text-align:center">Rahmat!</h2><p class="q-sub">Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.</p><button class="btn primary" id="done" type="button">Yopish</button></div>', $('#done').onclick = close;
      else { btn.disabled = false; btn.textContent = 'Yuborish'; $('#ge').textContent = "Xatolik. Qayta urinib ko'ring."; }
    };
  }
  function open(i) { if (i) intent = i; render(); modal.classList.add('open'); document.body.classList.add('lock'); }
  function close() { modal.classList.remove('open'); document.body.classList.remove('lock'); if (location.hash === '#quiz') history.replaceState(null, '', location.pathname + location.search); }
  document.querySelectorAll('[data-open]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(a.dataset.intent); }));
  $('#close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  if (location.hash === '#quiz') open();
})();
