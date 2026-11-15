(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const modal = $('#quiz');
  const open = () => { modal.classList.add('open'); document.body.classList.add('lock'); setTimeout(() => { const n = $('#f-name'); if (n && n.offsetParent) n.focus({ preventScroll: true }); }, 120); };
  const close = () => { modal.classList.remove('open'); document.body.classList.remove('lock'); if (location.hash === '#form') history.replaceState(null, '', location.pathname + location.search); };
  document.querySelectorAll('[data-open]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  $('#close').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  if (location.hash === '#form') open();
  // Google Form target. Fill these from the form's "Get pre-filled link" (entry.XXXX ids)
  // and the form's public URL ending in /formResponse. Leave action empty to use /api/lead.
  const GOOGLE_FORM = {
    action: '',
    fields: { name: '', phone: '', telegram: '', location: '', count: '', business: '', intent: '' },
  };
  const toGoogle = (d) => {
    const body = new URLSearchParams();
    Object.entries(GOOGLE_FORM.fields).forEach(([k, id]) => { if (id && d[k] != null) body.append(id, String(d[k])); });
    return fetch(GOOGLE_FORM.action, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      .then(() => true).catch(() => false);
  };
  // Apps Script web app URL (ends with /exec). When set, leads go straight to the Google Sheet.
  const SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyZWA4xN-AHkRSheCR1crLqnjCKI57l_IBbNEScB3dkF3S_fus6TKTypTynPUQnihX5cw/exec';
  const toSheet = (d) => fetch(SHEET_WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ ...d, phone: d.phone ? "'" + d.phone : d.phone, variant: location.pathname, utm: window.__utm || {}, referrer: document.referrer }) })
    .then(() => true).catch(() => false);
  const submitLead = (d) => (SHEET_WEBHOOK ? toSheet(d) : GOOGLE_FORM.action ? toGoogle(d) : window.sendLead(d));
  // form
  const ph = $('#f-phone');
  const fmtPhone = () => { let d = ph.value.replace(/\D/g, ''); if (d.startsWith('998')) d = d.slice(3); d = d.slice(0, 9); const g = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean); ph.value = '+998' + (g.length ? ' ' + g.join(' ') : ' '); };
  ph.addEventListener('input', fmtPhone); ph.addEventListener('focus', () => { if (!ph.value.trim() || ph.value.trim() === '+998') ph.value = '+998 '; });
  document.querySelectorAll('#lf input').forEach((i) => i.addEventListener('input', () => { const e = document.querySelector(`[data-e="${i.name}"]`); if (e) e.textContent = ''; i.classList.remove('bad'); }));
  const f = $('#lf');
  const R = { name: [(v) => v.length >= 2, 'Ismingizni kiriting'], phone: [(v) => v.replace(/\D/g, '').length >= 12, "Telefon raqamni to'g'ri kiriting"], location: [(v) => v.length >= 2, "Do'kon joylashuvini yozing"] };
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); let ok = true, first = null; const d = { intent: 'ulanish', business: "Do'kon" };
    ['name', 'phone', 'location'].forEach((k) => { const v = f[k].value.trim(); const g = R[k][0](v); f.querySelector(`[data-e="${k}"]`).textContent = g ? '' : R[k][1]; if (!g) { ok = false; first = first || f[k]; f[k].classList.add('bad'); } d[k] = v; });
    d.telegram = f.telegram.value.trim(); d.count = f.count.value;
    if (!ok) return first.focus();
    const b = f.querySelector('button'); b.disabled = true; b.textContent = 'Yuborilmoqda...';
    if (await submitLead(d)) { $('#fbox').innerHTML = `<div class="done">
      <div class="tick"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-17"/></svg></div>
      <h2>Arizangiz qabul qilindi</h2>
      <p class="q-sub">Tez orada siz bilan bog'lanamiz.</p>
      <ol class="next"><li><b>1</b><span>Operatorimiz siz bilan telefon orqali bog'lanadi</span></li><li><b>2</b><span>Do'koningizni Hesap'ga ulaymiz</span></li><li><b>3</b><span>Sotuvchilaringizni o'zimiz o'rgatamiz</span></li></ol>
      <a class="btn tg" href="https://t.me/hesap_uzb" rel="noopener">Telegram kanalimiz</a>
      <button class="btn primary" id="done" type="button">Yopish</button></div>`; $('#done').onclick = close; }
    else { b.disabled = false; b.textContent = 'Bepul ulanish'; $('#ge').textContent = "Xatolik. Qayta urinib ko'ring."; }
  });
})();
