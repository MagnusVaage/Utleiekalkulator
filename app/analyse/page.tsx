import type { Metadata } from 'next';
import { headers } from 'next/headers';
import AnalyseClient, { type Metric } from './AnalyseClient';

export const metadata: Metadata = {
  title: 'Boliganalyse av Finn-annonse – AI sjekker salgsoppgaven | Utleiekalkulator',
  description:
    'Lim inn en Finn-lenke og få en gratis boliganalyse på sekunder: TG2- og TG3-funn i salgsoppgaven, spørsmål til megler, yield og kontantstrøm. Ingen registrering.',
  keywords: ['boliganalyse', 'salgsoppgave analyse', 'finn.no boliganalyse', 'tilstandsrapport TG2 TG3', 'sjekke bolig før budrunde'],
  alternates: { canonical: '/analyse' },
  openGraph: {
    title: 'Boliganalyse av Finn-annonse – AI sjekker salgsoppgaven',
    description: 'Lim inn en Finn-lenke og få gratis boliganalyse på sekunder: TG-funn, meglerspørsmål, yield og kontantstrøm.',
    url: 'https://utleiekalkulatoren.no/analyse',
    type: 'website',
  },
};

// Allow time for the server-side AI analysis to complete.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

async function getBase(): Promise<string> {
  const h = await headers();
  const host = h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  return `${proto}://${host}`;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ finn?: string }> }) {
  const finn = (await searchParams).finn ?? '';

  // Only the FAST Finn metadata is fetched server-side, so the property header
  // (image, price, key facts) renders in ~2s. The slow salgsoppgave + AI risk
  // analysis is fetched client-side by AnalyseClient and streams in afterwards,
  // so it never blocks the header behind a long loading screen.
  let metric: Metric | null = null;
  if (finn) {
    const base = await getBase();
    const metricRes = await fetch(`${base}/api/analyze?url=${encodeURIComponent(finn)}`, { cache: 'no-store' })
      .then(r => r.json()).catch(() => null);
    if (metricRes && !metricRes.error) metric = metricRes;
  }

  return (
    <AnalyseClient
      finn={finn}
      initialMetric={metric}
      initialRisk={null}
      initialMegler=""
      initialPdfUrl=""
    />
  );
}
