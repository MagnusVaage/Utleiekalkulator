export const maxDuration = 60;

const PROMPT = `Du er ekspert på norske boligsalgsrapporter og tilstandsrapporter (NS 3600 / Forskrift til avhendingsloven).
Analyser rapporten nedenfor og returner KUN gyldig JSON (ingen annen tekst, ingen markdown) med NØYAKTIG denne strukturen:

{
  "adresse": "<boligens adresse hentet fra rapporten, eller tom streng>",
  "sammendrag": "<2-3 setninger om boligens FAKTISKE tilstand basert på rapporten>",
  "tg": [
    {"grad": <0|1|2|3>, "kategori": "<kort frase, 3-6 ord, som navngir avviket OG hvor det gjelder>", "tema": "<ett av temaene under>", "beskrivelse": "<maks 14 ord: hva som faktisk er observert>", "sporsmal": "<ett konkret spørsmål til megler, maks 20 ord; tom streng for TG0>"}
  ],
  "positive": ["<kort beskrivende frase>", "..."],
  "negative": ["<kort beskrivende frase>", "..."]
}

KRITISK – grunnregler mot oppdiktet innhold:
- Strukturen over er BARE et format-eksempel. Bruk ALDRI ord eller verdier fra eksempelet i svaret ditt.
- HVERT eneste felt skal hentes direkte fra rapportteksten. Finn ALDRI på funn, styrker eller fakta.
- Hvis du er usikker på om noe står i rapporten, SKAL du utelate det. Heller for få punkter enn ett oppdiktet.
- Ikke anta standardutstyr (peis, balkong, oppgradert el-anlegg osv.) med mindre rapporten nevner det eksplisitt.

Regler for TG-gradering:
- TG3 (grad 3): Alvorlig avvik — tiltak nødvendig snarest
- TG2 (grad 2): Vesentlig avvik — tiltak nødvendig
- TG1 (grad 1): Lite avvik — tiltak kan vurderes på sikt
- TG0 (grad 0): Ingen avvik — inkluder KUN om rapporten eksplisitt nevner TG0 med nyttig informasjon
- Gå SYSTEMATISK gjennom hele rapporten og ta med HVERT ENESTE funn som er gradert. En typisk tilstandsrapport har flere TG2- og TG1-funn (ofte 8-15 totalt). Du skal ALDRI hoppe over et funn.
- Funnene står ofte under overskrifter som "Vurderte forhold", "Vurdering av avvik" og "Konsekvens/tiltak" — selve TG-merket kan mangle i teksten fordi det er et ikon. Vurder da grad ut fra beskrivelsen (påvist avvik/skade = TG2, mindre/normal slitasje = TG1).
- IKKE bruk "Ingen avvik" e.l. som beskrivelse — beskriv alltid det faktiske forholdet.
- "tema" SKAL være én av: "Byggteknisk", "Våtrom", "Tekniske installasjoner", "Fukt og råte", "Brann og sikkerhet", "Dokumentasjon", "Utvendig", "Annet"
- "sporsmal" for TG2 og TG3 SKAL alltid fylles ut — det er den viktigste delen. Tom streng "" kun for TG0.
- "positive" = reelle styrker som fremgår av rapporten/salgsoppgaven (3-6 ords fraser). "negative" = reelle risikoer kjøper bør følge opp.
- Sikt mot minst 3 positive og 3 negative HVIS det finnes dekning i teksten — ellers færre.
- Svar kun på norsk.`;

// Build the model input from the substantive parts of the report. Norwegian
// tilstandsrapporter use standardised section labels, so we anchor on those
// instead of the raw "TG" badge (which is often a non-extractable icon).
function buildInput(text: string): string {
  const MAX = 20_000; // sliced down per-model below to fit each model's TPM cap
  const anchor = /(tilstandsgrad|vurderte forhold|vurdering av avvik|konsekvens\s*\/?\s*tiltak|\bTG\s?[0-3]\b|\bTG\s?IU\b)/gi;

  const seen = new Set<number>();
  const parts: string[] = [];
  let total = 0;
  let m: RegExpExecArray | null;
  while ((m = anchor.exec(text)) !== null) {
    const bucket = Math.floor(m.index / 300);
    if (seen.has(bucket)) continue;
    seen.add(bucket);
    const slice = text.slice(Math.max(0, m.index - 200), Math.min(text.length, m.index + 700));
    parts.push(slice);
    total += slice.length;
    if (total > MAX) break;
  }
  if (parts.length >= 4) return parts.join('\n…\n');

  // Fallback: the condition report / vedlegg sits in the LATTER half of the
  // document (the first pages are the broker's intro). Prefer a section marker;
  // otherwise use the tail of the document, never the intro.
  const lower = text.toLowerCase();
  const markers = ['tilstandsrapport', 'boligsalgsrapport', 'beskrivelse av eiendommen'];
  let idx = -1;
  for (const mk of markers) {
    const i = lower.indexOf(mk);
    if (i !== -1 && (idx === -1 || i < idx)) idx = i;
  }
  const region = idx !== -1 ? text.slice(idx) : text.slice(Math.max(0, text.length - MAX));
  return region.slice(0, MAX);
}

// Small in-memory cache so repeat views of the same listing (e.g. several
// colleagues opening the same Finn-link) don't each spend Groq tokens. Survives
// across requests on a warm serverless instance.
const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 1000 * 60 * 60; // 1 hour
function keyOf(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `${h}:${s.length}`;
}

// Groq counts (input + max_tokens) against each model's per-minute limit (TPM),
// and the limits differ a lot. The whole request — system prompt (~1.4k tokens),
// user input (~3.5 chars/token) AND the reserved max_tokens output — must fit under
// the cap, so we size BOTH input and output per model to stay safely below TPM.
// maxTokens is sized as high as each model's TPM allows AFTER subtracting the
// input + system prompt, so a long findings list (old, large homes produce many
// TG2/TG3) can finish the JSON instead of being truncated mid-object — Groq's
// strict json_object validator returns 400 json_validate_failed on truncation.
const MODELS = [
  { name: 'llama-3.3-70b-versatile', inputChars: 18_000, maxTokens: 4000 }, // TPM 12k
  { name: 'openai/gpt-oss-120b', inputChars: 10_000, maxTokens: 3000 }, // TPM 8k
  { name: 'llama-3.1-8b-instant', inputChars: 5_500, maxTokens: 2200 }, // TPM 6k
];

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

  const key = keyOf(text);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return Response.json(hit.data);

  const input = buildInput(text);

  try {
    let data: { choices?: { message?: { content?: string } }[] } | null = null;
    let lastErr = '';
    for (const model of MODELS) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 40_000);
      let res: Response;
      try {
        res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: model.name,
            messages: [
              { role: 'system', content: PROMPT },
              { role: 'user', content: `---RAPPORT START---\n${input.slice(0, model.inputChars)}\n---RAPPORT SLUTT---` },
            ],
            temperature: 0.2,
            max_tokens: model.maxTokens,
            response_format: { type: 'json_object' },
          }),
          signal: ctrl.signal,
        });
      } catch {
        lastErr = `${model.name}: tidsavbrudd/nettverksfeil`;
        continue; // try next model
      } finally {
        clearTimeout(t);
      }

      if (res.ok) { data = await res.json(); break; }

      const errBody = await res.text();
      lastErr = `${res.status} — ${errBody.slice(0, 200)}`;
      // Try a smaller model on: rate-limit (429), too-large (413), and truncated/
      // invalid JSON (400 json_validate_failed) — a smaller input window yields a
      // shorter completion that is less likely to be cut off mid-object.
      if (res.status === 429 || res.status === 413 || errBody.includes('json_validate_failed')) continue;
      break; // other errors won't be fixed by switching model
    }

    if (!data) throw new Error(`Groq svarte med feil: ${lastErr}`);

    const raw = data?.choices?.[0]?.message?.content ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Kunne ikke tolke AI-svaret');

    const parsed = JSON.parse(jsonMatch[0]);

    // Defence-in-depth against fabricated content: the model can occasionally invent
    // a feature (a fireplace, a balcony) that isn't in the report. Drop any finding,
    // strength or risk whose substantive words (6+ letters, e.g. "drenering",
    // "balkongdør") appear NOWHERE in the source text. Phrases without any long word
    // can't be verified, so we keep them rather than risk removing a real finding.
    const src = text.toLowerCase();
    const STOP = new Set(['boligen', 'rapporten', 'vurdert', 'tilstand', 'generelt', 'normalt']);
    const groundedIn = (phrase: string): boolean => {
      const words = (phrase.toLowerCase().match(/[a-zæøå]{6,}/g) ?? []).filter((w) => !STOP.has(w));
      return words.length === 0 || words.some((w) => src.includes(w));
    };
    if (Array.isArray(parsed.tg)) {
      parsed.tg = parsed.tg.filter((t: { kategori?: string; beskrivelse?: string }) =>
        groundedIn(`${t.kategori ?? ''} ${t.beskrivelse ?? ''}`));
    }
    if (Array.isArray(parsed.positive)) parsed.positive = parsed.positive.filter((p: string) => groundedIn(p));
    if (Array.isArray(parsed.negative)) parsed.negative = parsed.negative.filter((n: string) => groundedIn(n));

    cache.set(key, { at: Date.now(), data: parsed });
    if (cache.size > 200) cache.delete(cache.keys().next().value as string);

    return Response.json(parsed);
  } catch (err) {
    console.error('Rapport error:', err);
    const msg = err instanceof Error ? err.message : 'Ukjent feil';
    return Response.json({ error: `Analyse feilet: ${msg}` }, { status: 500 });
  }
}
