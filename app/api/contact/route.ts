import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Server er ikke konfigurert for e-post.' }, { status: 500 });
  }

  let body: { name?: string; email?: string; topic?: string; message?: string; honey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ugyldig forespørsel.' }, { status: 400 });
  }

  if (body.honey) return NextResponse.json({ ok: true });

  const name = (body.name || '').trim().slice(0, 120);
  const email = (body.email || '').trim().slice(0, 200);
  const topic = (body.topic || 'Tilbakemelding').trim().slice(0, 120);
  const message = (body.message || '').trim().slice(0, 5000);

  if (!message || message.length < 3) {
    return NextResponse.json({ error: 'Skriv en melding.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ugyldig e-postadresse.' }, { status: 400 });
  }

  const payload = {
    access_key: key,
    subject: `[Utleiekalkulator] ${topic}`,
    from_name: 'Utleiekalkulator',
    name: name || 'Anonym',
    email: email || 'noreply@utleiekalkulatoren.no',
    message,
    botcheck: '',
  };

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Kunne ikke sende. Prøv igjen senere.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
