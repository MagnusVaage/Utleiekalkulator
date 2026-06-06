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
  if (!adresse) {
    return Response.json({ error: 'Adresse er påkrevd' }, { status: 400 });
  }

  const row = {
    tidspunkt: new Date().toISOString(),
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
