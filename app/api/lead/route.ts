// Receives a seller/verdivurdering lead from the analyse page and forwards it to
// a Google Apps Script web app (the URL is kept server-side so it isn't exposed
// to the browser). The Apps Script appends a row to the Sheet and emails the owner.
export async function POST(request: Request) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ error: 'LEAD_WEBHOOK_URL mangler' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Ugyldig forespørsel' }, { status: 400 });
  }

  const adresse = String(body.adresse ?? '').trim();
  const telefon = String(body.telefon ?? '').trim();
  if (!adresse || !telefon) {
    return Response.json({ error: 'Adresse og telefon er påkrevd' }, { status: 400 });
  }

  // Human-readable lead type for the Sheet/email.
  const TYPE_LABEL: Record<string, string> = { selge: 'Salg av bolig', rente: 'Verditakst' };
  const kilde = String(body.kilde ?? '').trim();
  const type = TYPE_LABEL[kilde] ?? kilde;

  // Norwegian local time, date + hours:minutes only (no seconds, no UTC suffix).
  const tidspunkt = new Intl.DateTimeFormat('nb-NO', {
    timeZone: 'Europe/Oslo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()).replace(',', '');

  const row = {
    tidspunkt,
    type,
    telefon,
    adresse,
    kontekstAdresse: String(body.kontekstAdresse ?? '').trim(),
    kontekstFinn: String(body.kontekstFinn ?? '').trim(),
  };

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('Lead webhook error:', err);
    return Response.json({ error: 'Kunne ikke lagre lead' }, { status: 502 });
  }
}
