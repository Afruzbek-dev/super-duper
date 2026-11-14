(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const msgs = $('#msgs'), quick = $('#quick'), bar = $('#bar'), inp = $('#inp');
  const BIZ = ['Telefon va texnika', 'Avto / moto', 'Mebel', 'Kiyim-kechak', 'Qurilish mollari'];
  const CITY = ['Toshkent', 'Samarqand', 'Andijon', "Farg'ona", 'Namangan'];
  const S = [
    { k: 'name', say: "Assalomu alaykum! 👋 Men Hesap yordamchisiman. Ismingiz nima?", ph: 'Ismingiz', ok: (v) => v.length >= 2, err: 'Ismingizni to\'liqroq yozing' },
    { k: 'phone', say: (d) => `Tanishganimdan xursandman, ${d.name}! Telefon raqamingiz?`, ph: '+998 90 123 45 67', type: 'tel', ok: (v) => v.replace(/\D/g, '').length >= 9, err: "Raqam noto'g'ri, qayta kiriting" },
    { k: 'telegram', say: 'Telegram username qoldiring (masalan @username)', ph: '@username', ok: (v) => v.length >= 2, err: 'Username kiriting' },
    { k: 'business', say: 'Nima sotasiz? Tanlang yoki yozing', ph: 'Biznesingiz', chips: BIZ, ok: (v) => v.length >= 2, err: 'Biznesingizni yozing' },
    { k: 'location', say: 'Oxirgi savol: qayerda joylashgan?', ph: 'Shahar / tuman', chips: CITY, ok: (v) => v.length >= 2, err: 'Joylashuvni yozing' },
  ];
  const data = {}; let i = 0, busy = false;
  const add = (t, c) => { const d = document.createElement('div'); d.className = 'm ' + c; d.textContent = t; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function ask() {
    const s = S[i]; busy = true; quick.innerHTML = ''; bar.classList.add('off');
    const t = add('•••', 'b t'); await wait(650); t.remove();
    add(typeof s.say === 'function' ? s.say(data) : s.say, 'b');
    inp.placeholder = s.ph; inp.type = s.type || 'text'; inp.value = '';
    if (s.chips) s.chips.forEach((c) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.onclick = () => reply(c); quick.appendChild(b); });
    bar.classList.remove('off'); busy = false; inp.focus({ preventScroll: true });
  }
  async function reply(v) {
    if (busy) return; v = v.trim(); const s = S[i];
    if (!s.ok(v)) { add(v || '…', 'u'); const t = add(s.err, 'b'); return; }
    add(v, 'u'); data[s.k] = v; quick.innerHTML = '';
    if (i < S.length - 1) { i++; return ask(); }
    busy = true; bar.classList.add('off');
    const t = add('•••', 'b t'); const ok = await window.sendLead(data); t.remove();
    if (ok) add("Rahmat! 🎉 Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.", 'b');
    else { add("Xatolik yuz berdi. Qayta urinib ko'ring.", 'b'); busy = false; bar.classList.remove('off'); }
  }
  bar.addEventListener('submit', (e) => { e.preventDefault(); reply(inp.value); });
  ask();
})();
