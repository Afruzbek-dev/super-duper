(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  // form
  const f = $('#lf');
  const R = { name: [(v) => v.length >= 2, 'Ismingizni kiriting'], phone: [(v) => v.replace(/\D/g, '').length >= 9, "Telefon raqamni to'g'ri kiriting"], location: [(v) => v.length >= 2, "Do'kon joylashuvini yozing"] };
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); let ok = true, first = null; const d = { intent: 'ulanish', business: "Do'kon" };
    ['name', 'phone', 'location'].forEach((k) => { const v = f[k].value.trim(); const g = R[k][0](v); f.querySelector(`[data-e="${k}"]`).textContent = g ? '' : R[k][1]; if (!g) { ok = false; first = first || f[k]; } d[k] = v; });
    d.telegram = f.telegram.value.trim(); d.count = f.count.value;
    if (!ok) return first.focus();
    const b = f.querySelector('button'); b.disabled = true; b.textContent = 'Yuborilmoqda...';
    if (await window.sendLead(d)) $('#fbox').innerHTML = '<div class="thanks"><h2 style="text-align:center">Rahmat!</h2><p class="about" style="margin:0 auto">Arizangiz qabul qilindi. 15 daqiqada qo\'ng\'iroq qilamiz.</p></div>';
    else { b.disabled = false; b.textContent = 'Bepul ulanish'; $('#ge').textContent = "Xatolik. Qayta urinib ko'ring."; }
  });
})();
