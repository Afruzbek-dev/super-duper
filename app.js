(() => {
  'use strict';
  const cf = document.getElementById('cf');
  const msg = document.getElementById('cmsg');
  const params = new URLSearchParams(location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'ttclid']
    .forEach((k) => { if (params.get(k)) utm[k] = params.get(k); });

  cf.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(cf);
    const v = (k) => (f.get(k) || '').toString().trim();
    const data = { name: v('name'), phone: v('phone'), telegram: v('telegram'), business: v('business'), location: v('location') };
    const err = (t) => { msg.className = 'err'; msg.textContent = t; };
    if (data.name.length < 2) return err('Ismingizni kiriting');
    if (data.phone.replace(/\D/g, '').length < 9) return err("Telefon raqamni to'g'ri kiriting");
    if (data.telegram.length < 2) return err('Telegram username kiriting');
    if (data.business.length < 2) return err('Biznesingizni yozing');
    if (data.location.length < 2) return err('Joylashuvni yozing');

    const btn = cf.querySelector('button');
    btn.disabled = true; msg.textContent = '';
    const r = await fetch('/api/lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, utm, referrer: document.referrer })
    }).catch(() => null);
    if (r && r.ok) {
      document.getElementById('formbox').innerHTML =
        '<div class="thanks"><h2 style="text-align:center">Rahmat!</h2><p class="sub">Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.</p></div>';
    } else {
      btn.disabled = false; err("Xatolik. Qayta urinib ko'ring.");
    }
  });
})();
