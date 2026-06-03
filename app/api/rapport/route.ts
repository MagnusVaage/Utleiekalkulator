export const maxDuration = 60;

const PROMPT = `Du er ekspert på norske boligsalgsrapporter og tilstandsrapporter.
Analyser denne rapporten og returner KUN gyldig JSON (ingen annen tekst, ingen markdown) med denne strukturen:

{
  "adresse": "boligens adresse eller tom streng om ikke tilgjengelig",
  "sammendrag": "2-3 setninger om boligens generelle tilstand",
  "tg": [
    {"grad": 3, "kategori": "Taklekkasje i loftsbod", "tema": "Byggteknisk", "beskrivelse": "Lekkasje oppdaget, krever umiddelbar utbedring", "sporsmal": "Hva vil det koste å utbedre taklekkasjen, og når ble det sist sjekket?"},
    {"grad": 2, "kategori": "Oppgraderingsbehov i bad", "tema": "Våtrom", "beskrivelse": "Membran fra 2006 nærmer seg forventet levetid", "sporsmal": "Er det planlagt utskifting av membranen på badet, og hva er estimert kostnad?"},
    {"grad": 1, "kategori": "Slitasje på vinduer", "tema": "Byggteknisk", "beskrivelse": "Mindre slitasje på listverk", "sporsmal": "Når ble vinduene sist vedlikeholdt?"},
    {"grad": 0, "kategori": "Nylig oppgradert el-anlegg", "tema": "Tekniske installasjoner", "beskrivelse": "Nylig oppgradert el-tavle", "sporsmal": ""}
  ],
  "positive": ["Koselig stue med peisovn", "Ny varmtvannsbereder", "Stilrene, nyere vinduer", "Rolig og attraktiv beliggenhet"],
  "negative": ["TG3 på tak bør utbedres umiddelbart", "Eldre røranlegg med usikker restlevetid"]
}

Regler for TG-gradering:
- TG3 (grad: 3): Alvorlig avvik — tiltak nødvendig snarest
- TG2 (grad: 2): Vesentlig avvik — tiltak nødvendig
- TG1 (grad: 1): Liten avvik — tiltak kan vurderes på sikt
- TG0 (grad: 0): Ingen avvik — inkluder KUN om rapporten eksplisitt nevner TG0 med nyttig informasjon
- IKKE bruk "Ingen avvik", "Ingen vesentlige avvik" eller lignende som beskrivelse — beskriv alltid hva det faktiske avviket eller tilstanden er
- For TG1: beskriv hva som er observert (f.eks. "Slitasje på listverk", "Eldre dør med normal slitasje")
- KRITISK: TG1-funn er like obligatoriske som TG2 og TG3. Tilstandsrapporter inneholder vanligvis FLERE TG1-funn enn TG2/TG3. Du skal ALDRI hoppe over et TG1-funn. Gå systematisk gjennom hele rapporten og ta med HVER ENESTE komponent som er gradert TG1 — også de små og "uvesentlige".
- IKKE utelat noen TG-funn — hent ALLE TG1, TG2 og TG3 funn fra rapporten. Hvis rapporten har 12 TG1-funn skal du returnere alle 12.
- Beskrivelse skal være presis og informativ (maks 14 ord), ikke bare gjenta graden eller si "ingen avvik"
- "kategori" SKAL være en kort, beskrivende frase (3-6 ord) som navngir selve avviket OG hvor/hva det gjelder — IKKE bare ett stikkord. Skriv "Fukt i kjellerrom", ikke "Fukt". Skriv "Mangelfulle rekkverk på trapper", ikke "Trapper". Skriv "Utdatert elektrisk anlegg", ikke "Elektrisk".
- "tema" SKAL være én av: "Byggteknisk", "Våtrom", "Tekniske installasjoner", "Fukt og råte", "Brann og sikkerhet", "Dokumentasjon", "Utvendig", "Annet"
- "sporsmal" = ett konkret, presist spørsmål kjøper bør stille megler om akkurat dette funnet (maks 20 ord). Tom streng "" for TG0.
- For TG2 og TG3 SKAL "sporsmal" alltid fylles ut — det er den viktigste delen
- positive = reelle styrker og fordeler, hver som en kort beskrivende frase (3-6 ord, f.eks. "Koselig stue med peisovn", "Solrik sydvestvendt balkong") — ikke bare ett ord
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

  // Extract context around every TG mention in the document
  const tgRegex = /\bTG\s*[0-3]\b/g;
  let match;
  const seen = new Set<number>();
  const snippets: string[] = [];
  while ((match = tgRegex.exec(text)) !== null) {
    // Deduplicate nearby matches (within 200 chars)
    const bucket = Math.floor(match.index / 200);
    if (seen.has(bucket)) continue;
    seen.add(bucket);
    const start = Math.max(0, match.index - 150);
    const end = Math.min(text.length, match.index + 400);
    snippets.push(text.slice(start, end));
    if (snippets.join('\n').length > 20_000) break;
  }
  const truncated = snippets.length > 3
    ? snippets.join('\n---\n')
    : text.slice(0, 10_000);

  // Each model has its own daily token budget — if the primary is rate-limited,
  // fall back to the next one so a single model's cap can't block analysis.
  const MODELS = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'];

  try {
    let data: { choices?: { message?: { content?: string } }[] } | null = null;
    let lastErr = '';
    for (const model of MODELS) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: PROMPT },
            { role: 'user', content: `---RAPPORT START---\n${truncated}\n---RAPPORT SLUTT---` },
          ],
          temperature: 0.2,
          max_tokens: 4000,
        }),
      });

      if (res.ok) { data = await res.json(); break; }

      lastErr = `${res.status} — ${(await res.text()).slice(0, 200)}`;
      if (res.status === 429) continue; // rate-limited: try next model
      break; // other errors won't be fixed by switching model
    }

    if (!data) throw new Error(`Groq svarte med feil: ${lastErr}`);

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
