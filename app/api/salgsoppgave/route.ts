import { extractText, getDocumentProxy } from 'unpdf';

export const maxDuration = 60;

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'nb-NO,nb;q=0.9,no;q=0.8,en;q=0.5',
};

// Score a document by URL keywords — works when the megler puts the doc type in the file path (Aktiv/Vitec).
function rankPdf(url: string): number {
  const u = url.toLowerCase();
  let s = 0;
  if (u.includes('salgsoppgave')) s += 10;
  if (u.includes('tilstand')) s += 8;
  if (u.includes('digital')) s += 2;
  if (u.includes('prospekt')) s += 4;
  if (u.includes('egenerkl')) s -= 6;
  if (u.includes('budskjema') || u.includes('kjopekontrakt') || u.includes('kjøpekontrakt')) s -= 8;
  if (u.includes('nabolag') || u.includes('energiattest') || u.includes('vedtekter')) s -= 4;
  return s;
}

// Score a document by its human label — works when the doc type lives in link text / JSON metadata
// rather than the URL (Krogsveen/Sanity, Emera/S3, and most modern megler sites with hashed filenames).
function rankLabel(label: string): number {
  const l = label.toLowerCase();
  let s = 0;
  if (l.includes('salgsoppgave')) s += 12;
  if (l.includes('komplett')) s += 4;
  if (l.includes('tilstandsrapport')) s += 10;
  if (l.includes('prospekt')) s += 6;
  if (l.includes('vedlegg')) s += 5;
  if (l.includes('sammenslått') || l.includes('sammenslatt')) s += 3;
  if (l.includes('bruktbolig')) s += 3;
  if (l.includes('egenerkl')) s -= 8;
  if (l.includes('energiattest') || l.includes('energimerk')) s -= 6;
  if (l.includes('nabolag')) s -= 6;
  if (l.includes('budgivning') || l.includes('budrunde') || l.includes('forbruker') || l.includes('budskjema')) s -= 8;
  if (l.includes('vedtekt') || l.includes('årsmøte') || l.includes('protokoll') || l.includes('innkalling')) s -= 6;
  if (l.includes('reguleringskart') || l.includes('byggetegning') || l.includes('løsøre') || l.includes('boligkjøperpakke')) s -= 6;
  return s;
}

function fileName(url: string): string {
  return url.split('/').pop()?.split('?')[0]?.toLowerCase() ?? '';
}

// Webmegler/EiendomsMegler1-style SPAs serve the salgsoppgave through an "epaper":{"name","url"}
// JSON field where the URL has no .pdf extension, so the generic PDF scan never sees it.
function extractEpaperUrl(html: string): string | undefined {
  const u = html.replace(/\\u002[fF]/gi, '/').replace(/\\\//g, '/').replace(/\\"/g, '"');
  const m = u.match(/"epaper"\s*:\s*\{[^}]*?"url"\s*:\s*"(https?:\/\/[^"]+)"/i);
  return m?.[1];
}

function extractPdfUrls(html: string): string[] {
  const set = new Set<string>();
  const re = /https?:\/\/[^\s"'<>\\)]+\.pdf[^\s"'<>\\)]*/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) set.add(m[0].replace(/&amp;/g, '&'));
  return [...set];
}

// Map "filename.pdf" -> human label, harvested from anchor text and JSON metadata in the megler page.
function buildLabelMap(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const put = (file: string, label: string) => {
    const f = file.toLowerCase();
    const clean = label.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (f && clean && !map.has(f)) map.set(f, clean);
  };

  // 1. Anchor text: <a href="....pdf">Label</a>  (Krogsveen and most server-rendered sites)
  const aRe = /<a[^>]+href="([^"]+\.pdf[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = aRe.exec(html)) !== null) put(fileName(m[1]), m[2]);

  // 2. JSON/RSC metadata: a "head"/"title"/"name" field followed shortly by a "path"/"url"/"id" ending in .pdf
  //    (Emera uses {"head":"Salgsoppgave Bruktbolig",...,"path":".../x.pdf"})
  const unescaped = html.replace(/\\"/g, '"');
  const jRe = /"(?:head|title|name|label|fileName|displayName)"\s*:\s*"([^"]+)"[\s\S]{0,200}?"(?:path|url|href|id)"\s*:\s*"[^"]*?([\w%-]+\.pdf)"/gi;
  while ((m = jRe.exec(unescaped)) !== null) put(m[2], m[1]);

  return map;
}

type Doc = { url: string; label: string; score: number };

function collectDocs(html: string, estateId?: string): Doc[] {
  const labelMap = buildLabelMap(html);
  let urls = extractPdfUrls(html);

  // Aktiv/Vitec: many PDFs share a CDN; the right salgsoppgave carries the estateId.
  if (estateId) {
    const idU = estateId.toUpperCase();
    const byId = urls.filter((p) => p.toUpperCase().includes(idU));
    if (byId.length) urls = byId;
  }

  return urls
    .map((url) => {
      const label = labelMap.get(fileName(url)) ?? '';
      const score = Math.max(rankLabel(label), rankPdf(url));
      return { url, label, score };
    })
    .sort((a, b) => b.score - a.score);
}

// PrivatMegleren gates the salgsoppgave behind a lead-capture form, but their GraphQL backend
// exposes the merged document via a public proxy URL. estateId is the short number in the megler link.
async function resolvePrivatMegleren(link: string): Promise<string | undefined> {
  const estateId = link.match(/privatmegleren\.no\/(?:registrerinteressent\/)?(\d{4,7})\b/)?.[1];
  if (!estateId) return undefined;

  const query = `{ estate(input:{brandId:"privatmegleren",estateId:"${estateId}",preview:false,refresh:false}){ documents{ list{ url description } } } }`;
  const res = await fetch('https://ds.privatmegleren.no/graphql', {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: 'https://privatmegleren.no',
      Referer: 'https://privatmegleren.no/',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 0 },
  });
  if (!res.ok) return undefined;
  const json = await res.json().catch(() => null);
  const list: { url: string; description?: string }[] = json?.data?.estate?.documents?.list ?? [];
  if (!list.length) return undefined;

  const ranked = list
    .map((d) => ({ url: d.url, score: rankLabel(d.description ?? '') }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.url;
}

// The major Norwegian brokerage domains. Used as a last-resort way to locate the
// megler's listing page when Finn doesn't expose an explicit "salgsoppgave" link.
const MEGLER_DOMAINS = [
  'dnbeiendom.no', 'em1.no', 'eiendomsmegler1.no', 'krogsveen.no', 'privatmegleren.no',
  'aktiv.no', 'nordvikbolig.no', 'nordvik.no', 'eie.no', 'notar.no', 'garanti.no',
  'proaktiv.no', 'semogjohnsen.no', 'schala-partners.no', 'fossco.no', 'foss.no',
  'heimdaleiendom.no', 'sormegleren.no', 'exbo.no', 'meglerhuset-nylander.no',
  'webmegler.no', 'meglervisning.no', 'partners.no', 'inviso.no', 'z-eiendom.no',
];

// DNB Eiendom (Norway's largest) serves a fully digital salgsoppgave — the
// "autoprospekt" page — with the complete tilstandsrapport text inline and NO
// downloadable PDF. We strip that page to plain text instead of hunting for a PDF.
function htmlToText(html: string): string {
  return html
    .replace(/\\u002[fF]/gi, '/')
    .replace(/\\r\\n|\\r|\\n/g, '\n')
    // Keep <script> content: DNB's digital salgsoppgave text lives inside the SPA's
    // inline JSON state, not in the HTML body. Only drop <style> (pure CSS noise).
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function resolveDnbText(link: string): Promise<string | undefined> {
  // The estate id is the first 6-9 digit run in the link's path (the path may be
  // /307260089, /bolig/307260089 or /Autoprospekt/307260089 depending on the CTA).
  const id = link.match(/dnbeiendom\.no\/[^?#]*?(\d{6,9})/i)?.[1];
  if (!id) return undefined;
  const res = await fetch(`https://dnbeiendom.no/autoprospekt/${id}`, {
    headers: HEADERS, redirect: 'follow', next: { revalidate: 0 },
  });
  if (!res.ok) return undefined;
  const text = htmlToText(await res.text());
  return text.replace(/\s/g, '').length > 2000 ? text : undefined;
}

async function findMeglerLink(finnUrl: string): Promise<{ link?: string; estateId?: string }> {
  const res = await fetch(finnUrl, { headers: HEADERS, next: { revalidate: 0 } });
  if (!res.ok) return {};
  const html = await res.text();

  let link: string | undefined;
  const m = html.match(/Salgsoppgaven beskriver[\s\S]{0,500}?<a[^>]+href="([^"]+)"/i);
  if (m) link = m[1];
  if (!link) {
    const m2 = html.match(/href="(https?:\/\/[^"]*(?:prospekt|salgsoppgave)[^"]*)"/i);
    if (m2) link = m2[1];
  }
  // Last resort: any external link to a known megler domain (DNB, EM1, Nordvik, Eie, …).
  // Finn always links out to the broker's own listing page, which hosts the salgsoppgave.
  if (!link) {
    const hrefs = html.match(/href="(https?:\/\/[^"]+)"/gi) ?? [];
    for (const h of hrefs) {
      const url = h.slice(6, -1);
      if (MEGLER_DOMAINS.some((d) => url.toLowerCase().includes(d))) { link = url; break; }
    }
  }
  if (link) link = link.replace(/&amp;/g, '&');

  let estateId: string | undefined;
  const e = (link || html).match(/estateId=([0-9a-fA-F-]{36})/);
  if (e) estateId = e[1];

  return { link, estateId };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const finnUrl = searchParams.get('url');
  if (!finnUrl || !finnUrl.includes('finn.no')) {
    return Response.json({ found: false, reason: 'invalid-url' }, { status: 400 });
  }

  try {
    const { link, estateId } = await findMeglerLink(finnUrl);
    if (!link) return Response.json({ found: false, reason: 'no-megler-link' }, { status: 200 });

    const megler = new URL(link).hostname.replace(/^www\./, '');

    // DNB: no PDF exists — pull the salgsoppgave text from the digital autoprospekt page.
    if (megler.includes('dnbeiendom.no')) {
      const text = await resolveDnbText(link);
      if (text) return Response.json({ found: true, megler, pdfUrl: '', text: text.slice(0, 200_000) });
    }

    // Resolve PDF url — the link is either a direct PDF or a megler prospekt page
    let pdfUrl: string | undefined;
    if (megler.includes('privatmegleren.no')) {
      pdfUrl = await resolvePrivatMegleren(link);
    } else if (/\.pdf(\?|#|$)/i.test(link)) {
      pdfUrl = link;
    } else {
      const r = await fetch(link, { headers: HEADERS, redirect: 'follow', next: { revalidate: 0 } });
      if (r.ok) {
        const html = await r.text();
        const docs = collectDocs(html, estateId);
        if (docs.length && docs[0].score > 0) pdfUrl = docs[0].url;
        if (!pdfUrl) pdfUrl = extractEpaperUrl(html);
        // Relaxed fallback: hashed filenames (no label, no keyword) score 0 even when
        // they ARE the salgsoppgave. If nothing scored positive and no epaper, take the
        // best-ranked PDF that isn't a clearly-wrong document (negative score).
        if (!pdfUrl && docs.length && docs[0].score >= 0) pdfUrl = docs[0].url;
      }
    }

    if (!pdfUrl) return Response.json({ found: false, reason: 'no-pdf', megler }, { status: 200 });

    // Download + extract text server-side (PDF can be >4.5MB so we never return raw bytes)
    const pres = await fetch(pdfUrl, { headers: HEADERS, redirect: 'follow' });
    if (!pres.ok) return Response.json({ found: false, reason: 'pdf-fetch-failed', megler }, { status: 200 });
    const buf = new Uint8Array(await pres.arrayBuffer());
    if (buf[0] !== 0x25 || buf[1] !== 0x50) {
      return Response.json({ found: false, reason: 'not-pdf', megler }, { status: 200 });
    }

    const pdf = await getDocumentProxy(buf);
    const { text } = await extractText(pdf, { mergePages: true });
    const merged = Array.isArray(text) ? text.join('\n') : text;
    const clean = merged.slice(0, 200_000);
    if (clean.replace(/\s/g, '').length < 500) {
      return Response.json({ found: false, reason: 'no-text', megler }, { status: 200 });
    }

    return Response.json({ found: true, megler, pdfUrl, text: clean });
  } catch (err) {
    console.error('salgsoppgave error:', err);
    return Response.json({ found: false, reason: 'error' }, { status: 200 });
  }
}
