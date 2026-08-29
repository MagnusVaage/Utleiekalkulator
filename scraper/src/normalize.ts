import type { Condition } from "./types.ts";

/**
 * Normaliserer et modellnummer til en nøkkel for matching på tvers av kilder:
 * store bokstaver, alle skilletegn fjernet ("WW90T534AAW/S6" -> "WW90T534AAWS6").
 */
export function modelKey(modelNumber: string): string {
  return modelNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Tokens som ligner modellnummer, men er enheter/spesifikasjoner. */
const UNIT_TOKEN =
  /^\d+([.,]\d+)?(GB|TB|MB|GHZ|MHZ|HZ|KG|G|CM|MM|M|L|DL|W|KW|WH|MAH|K|P|V|A|MP|X|FPS|TOMMERS?|TOMMER|ÅR|PLASS(ER)?|STK)$/i;
const RESOLUTION_TOKEN = /^\d+X\d+$/i;
const YEAR_TOKEN = /^(19|20)\d{2}$/;

/**
 * Heuristikk: plukker ut mest sannsynlige modellnummer fra en annonsetittel.
 * Kandidat = token med både bokstaver og minst to sifre, minst 5 tegn,
 * som ikke er en enhet ("128GB"), oppløsning eller årstall.
 * Ved flere kandidater velges den lengste (mest spesifikke).
 * Returnerer null når ingenting kvalifiserer — da skal annonsen hoppes over,
 * ikke gjettes på.
 */
export function extractModelNumber(title: string): string | null {
  const tokens = title.split(/[\s,()[\]!"«»]+/);
  let best: string | null = null;
  for (const raw of tokens) {
    const token = raw.replace(/^[-/.]+|[-/.]+$/g, "");
    if (token.length < 5) continue;
    if (!/[A-Za-zÆØÅæøå]/.test(token)) continue;
    if ((token.match(/\d/g) ?? []).length < 2) continue;
    if (!/^[A-Za-z0-9/.-]+$/.test(token)) continue;
    if (UNIT_TOKEN.test(token) || RESOLUTION_TOKEN.test(token) || YEAR_TOKEN.test(token)) continue;
    if (best === null || token.length > best.length) best = token;
  }
  return best;
}

/**
 * Mapper Finns tilstandstekst til vår enum. Selvrapportert og upålitelig —
 * se kommentar på Condition-typen.
 */
export function parseCondition(raw: string | undefined | null): Condition {
  if (!raw) return "ukjent";
  const s = raw.trim().toLowerCase();
  if (/^(helt )?ny$|ubrukt/.test(s)) return "ny";
  if (s.includes("som ny")) return "som_ny";
  if (s.includes("brukt")) return "brukt";
  return "ukjent";
}
