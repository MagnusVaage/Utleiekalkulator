import Anthropic from '@anthropic-ai/sdk';

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

Regler:
- Inkluder ALLE TG-funn fra rapporten (TG0, TG1, TG2 og TG3)
- Beskrivelse skal være presis og kort (maks 12 ord)
- positive = reelle styrker og fordeler
- negative = risikoer og ting kjøper bør følge opp
- Minimum 3 positive og 3 negative punkter om mulig
- Svar kun på norsk`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY mangler — legg den til i Vercel Environment Variables' },
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

  // Limit to ~120k chars — ample for any property report
  const truncated = text.slice(0, 120_000);

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `${PROMPT}\n\n---RAPPORT START---\n${truncated}\n---RAPPORT SLUTT---`,
      }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Kunne ikke tolke AI-svaret');

    return Response.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error('Rapport error:', err);
    const msg = err instanceof Error ? err.message : 'Ukjent feil';
    return Response.json({ error: `Analyse feilet: ${msg}` }, { status: 500 });
  }
}
