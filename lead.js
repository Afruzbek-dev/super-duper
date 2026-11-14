// Shared by all variants: sends the lead to /api/lead
window.sendLead = async (data) => {
  const p = new URLSearchParams(location.search), utm = {};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','ttclid'].forEach((k) => { if (p.get(k)) utm[k] = p.get(k); });
  const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, utm, referrer: document.referrer, variant: location.pathname }) }).catch(() => null);
  const ok = !!(r && r.ok);
  if (ok) { try { window.fbq && fbq('track', 'Lead'); } catch (e) {} }
  return ok;
};
