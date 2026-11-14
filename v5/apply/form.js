(() => {
  'use strict';
  const el = document.getElementById('step');
  const F = [
    { k: 'name', l: 'Ism', ph: 'Ismingiz', ac: 'name', ok: (v) => v.length >= 2, err: 'Ismingizni kiriting' },
    { k: 'phone', l: 'Telefon raqam', ph: '+998 90 123 45 67', type: 'tel', ac: 'tel', ok: (v) => v.replace(/\D/g, '').length >= 9, err: "Telefon raqamni to'g'ri kiriting" },
    { k: 'telegram', l: 'Telegram', ph: '@username', ok: (v) => v.length >= 2, err: 'Telegram username kiriting' },
    { k: 'business', l: 'Biznesingiz', ph: "Masalan: telefon do'koni, avtosalon", ok: (v) => v.length >= 2, err: 'Biznesingizni yozing' },
    { k: 'location', l: 'Qayerda joylashgan', ph: 'Shahar / tuman', ok: (v) => v.length >= 2, err: 'Joylashuvni yozing' },
  ];
  el.innerHTML = `<form class="sf" novalidate>
    <h1 class="q-title">Shartnoma rasmiylashtirish</h1><p class="q-sub">Ma'lumotlaringizni qoldiring, biz siz bilan bog'lanamiz.</p>
    ${F.map((f) => `<label class="field-l" for="f-${f.k}">${f.l}</label>
    <input class="field" id="f-${f.k}" name="${f.k}" placeholder="${f.ph}" ${f.type ? `type="${f.type}" inputmode="tel"` : ''} ${f.ac ? `autocomplete="${f.ac}"` : ''} maxlength="120"><p class="err" data-e="${f.k}"></p>`).join('')}
    <button class="btn primary block" type="submit" style="margin-top:10px">Yuborish</button>
    <p class="err" id="ge"></p><p class="note">Ma'lumotlaringiz faqat siz bilan bog'lanish uchun ishlatiladi.</p></form>`;
  const f = el.querySelector('form');
  f.onsubmit = async (e) => {
    e.preventDefault(); const data = { intent: 'shartnoma' }; let ok = true, first = null;
    F.forEach((x) => { const v = f[x.k].value.trim(); const good = x.ok(v); el.querySelector(`[data-e="${x.k}"]`).textContent = good ? '' : x.err; if (!good) { ok = false; first = first || f[x.k]; } data[x.k] = v; });
    if (!ok) return first.focus();
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Yuborilmoqda...';
    if (await window.sendLead(data)) {
      el.innerHTML = '<div class="thanks"><h1 class="q-title" style="text-align:center">Rahmat!</h1><p class="q-sub">Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.</p><a class="btn primary" href="/v5/">Bosh sahifaga qaytish</a></div>';
      window.scrollTo(0, 0);
    } else { btn.disabled = false; btn.textContent = 'Yuborish'; document.getElementById('ge').textContent = "Xatolik. Qayta urinib ko'ring."; }
  };
})();
