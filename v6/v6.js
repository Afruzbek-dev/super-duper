(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const modal = $('#quiz');
  const open = () => { modal.classList.add('open'); document.body.classList.add('lock'); };
  const close = () => { modal.classList.remove('open'); document.body.classList.remove('lock'); if (location.hash === '#form') history.replaceState(null, '', location.pathname + location.search); };
  document.querySelectorAll('[data-open]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  $('#close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  if (location.hash === '#form') open();
  // form
  const f = $('#lf');
  const R = { name: [(v) => v.length >= 2, 'Ismingizni kiriting'], phone: [(v) => v.replace(/\D/g, '').length >= 9, "Telefon raqamni to'g'ri kiriting"], location: [(v) => v.length >= 2, "Do'kon joylashuvini yozing"] };
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); let ok = true, first = null; const d = { intent: 'ulanish', business: "Do'kon" };
    ['name', 'phone', 'location'].forEach((k) => { const v = f[k].value.trim(); const g = R[k][0](v); f.querySelector(`[data-e="${k}"]`).textContent = g ? '' : R[k][1]; if (!g) { ok = false; first = first || f[k]; } d[k] = v; });
    d.telegram = f.telegram.value.trim(); d.count = f.count.value;
    if (!ok) return first.focus();
    const b = f.querySelector('button'); b.disabled = true; b.textContent = 'Yuborilmoqda...';
    if (await window.sendLead(d)) $('#fbox').innerHTML = '<div class="thanks"><h2 class="q-title" style="text-align:center;padding:0">Rahmat!</h2><p class="q-sub">Arizangiz qabul qilindi. 15 daqiqada qo\'ng\'iroq qilamiz.</p><button class="btn primary" id="done" type="button">Yopish</button></div>', $('#done').onclick = close;
    else { b.disabled = false; b.textContent = 'Bepul ulanish'; $('#ge').textContent = "Xatolik. Qayta urinib ko'ring."; }
  });
})();
