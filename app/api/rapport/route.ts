export const maxDuration = 60;

const PROMPT = `Du er ekspert på norske boligsalgsrapporter og tilstandsrapporter.
Analyser denne rapporten og returner KUN gyldig JSON (ingen annen tekst, ingen markdown) med denne strukturen:

{
  "adresse": "boligens adresse eller tom streng om ikke tilgjengelig",
  "sammendrag": "2-3 setninger om boligens generelle tilstand",
  "tg": [
    {"grad": 3, "kategori": "Tak", "beskrivelse": "Lekkasje oppdaget, krever umiddelbar utbedring"},
    {"grad": 2, "kategori": "Balkong", "beskrivelse": "Behov for overflatebehandling av rekkverk"},
    {"grad": 1, "kategori": "Vinduer", "beskrivelse": "Mindre slitasje på listverk"},
    {"grad": 0, "kategori": "Elektrisk anlegg", "beskrivelse": "Nylig oppgradert el-tavle"}
  ],
  "positive": ["Nyoppusset kjøkken (2023)", "Solrik sydvestvendt balkong"],
  "negative": ["TG3 på tak bør utbedres umiddelbart", "Eldre røranlegg med usikker restlevetid"]
}

Regler for TG-gradering:
- TG3 (grad: 3): Alvorlig avvik — tiltak nødvendig snarest
- TG2 (grad: 2): Vesentlig avvik — tiltak nødvendig
- TG1 (grad: 1): Liten avvik — tiltak kan vurderes
- TG0 (grad: 0): Ingen avvik — inkluder KUN om rapporten eksplisitt nevner TG0 med nyttig informasjon
- Inkluder IKKE elementer der du er usikker på graden — er det TG1 i rapporten, bruk grad 1, ikke 0
- Inkluder IKKE TG0-elementer med beskrivelse "Ingen TG-merking" eller lignende — utelat dem
- Beskrivelse skal være presis og kort (maks 12 ord)
- positive = reelle styrker og fordeler
- negative = risikoer og ting kjøper bør følge opp
- Minimum 3 positive og 3 negative punkter om mulig
- Svar kun på norsk`;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'GROQ_API_KEY mangler — legg den til i Vercel Environment Variables' },
      { status: 500 },
    );
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Ugyldig forespørsel' }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) return Response.json({ error: 'Ingen tekst å analysere' }, { status: 400 });

  // Find the tilstandsrapport section instead of blindly sending the whole text
  const tgIndex = text.search(/tilstandsgrad|TILSTANDSGRAD|TG\s*[123]\b/i);
  const relevant = tgIndex > 500
    ? text.slice(Math.max(0, tgIndex - 500), tgIndex + 12_000)
    : text.slice(0, 12_000);
  const truncated = relevant;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: PROMPT },
          { role: 'user', content: `---RAPPORT START---\n${truncated}\n---RAPPORT SLUTT---` },
        ],
        temperature: 0.2,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq svarte med feil: ${res.status} — ${err.slice(0, 200)}`);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Kunne ikke tolke AI-svaret');

    return Response.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error('Rapport error:', err);
    const msg = err instanceof Error ? err.message : 'Ukjent feil';
    return Response.json({ error: `Analyse feilet: ${msg}` }, { status: 500 });
  }
}
