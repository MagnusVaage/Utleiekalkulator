import { headers } from 'next/headers';
import AnalyseClient, { type Metric, type RapportResult } from './AnalyseClient';

// Allow time for the server-side AI analysis to complete.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function getBase(): Promise<string> {
  const h = await headers();
  const host = h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

// Fetch the salgsoppgave and run the AI analysis on the server, so the page
// renders the result as plain HTML even when the browser can't run JavaScript
// (e.g. behind a corporate web filter).
async function fetchRisk(base: string, finn: string) {
  const out = { risk: null as RapportResult | null, megler: '', pdfUrl: '' };
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 45_000);
    const so = await fetch(`${base}/api/salgsoppgave?url=${encodeURIComponent(finn)}`, {
      cache: 'no-store', signal: ctrl.signal,
    }).then(r => r.json()).catch(() => ({}));
    out.megler = so.megler || '';
    out.pdfUrl = so.pdfUrl || '';
    if (so.found && so.text) {
      const rep = await fetch(`${base}/api/rapport`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: so.text }), cache: 'no-store', signal: ctrl.signal,
      }).then(r => r.json()).catch(() => ({ error: true }));
      if (!rep.error) out.risk = rep as RapportResult;
    }
    clearTimeout(timeout);
  } catch { /* leave nulls — client will retry when JS is available */ }
  return out;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ finn?: string }> }) {
  const finn = (await searchParams).finn ?? '';

  let metric: Metric | null = null;
  let risk: RapportResult | null = null;
  let megler = '';
  let pdfUrl = '';

  if (finn) {
    const base = await getBase();
    const [metricRes, riskRes] = await Promise.all([
      fetch(`${base}/api/analyze?url=${encodeURIComponent(finn)}`, { cache: 'no-store' })
        .then(r => r.json()).catch(() => null),
      fetchRisk(base, finn),
    ]);
    if (metricRes && !metricRes.error) metric = metricRes;
    risk = riskRes.risk;
    megler = riskRes.megler;
    pdfUrl = riskRes.pdfUrl;
  }

  return (
    <AnalyseClient
      finn={finn}
      initialMetric={metric}
      initialRisk={risk}
      initialMegler={megler}
      initialPdfUrl={pdfUrl}
    />
  );
}
