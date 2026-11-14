// Vercel serverless function. Set env vars TG_BOT_TOKEN and TG_CHAT_ID to
// receive each lead as a Telegram message.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = req.body || {};
  const clean = (s, n = 200) => String(s || '').replace(/[<>]/g, '').slice(0, n);
  const lead = { name: clean(b.name, 100), phone: clean(b.phone, 30), telegram: clean(b.telegram, 60), business: clean(b.business, 120), location: clean(b.location, 120) };
  if (lead.name.length < 2 || lead.phone.replace(/\D/g, '').length < 9) return res.status(400).json({ ok: false });

  const { TG_BOT_TOKEN, TG_CHAT_ID } = process.env;
  if (TG_BOT_TOKEN && TG_CHAT_ID) {
    const text = `🆕 Yangi ariza\nIsm: ${lead.name}\nTelefon: ${lead.phone}\nTelegram: ${lead.telegram}\nBiznes: ${lead.business}\nManzil: ${lead.location}`;
    const r = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text })
    }).catch(() => null);
    if (!r || !r.ok) return res.status(502).json({ ok: false });
  } else {
    console.log('lead', lead);
  }
  res.status(200).json({ ok: true });
};
