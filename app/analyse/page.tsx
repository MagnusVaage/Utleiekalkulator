'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { saveAnalysis, newId } from '../lib/savedAnalyses';

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));
const card = { background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };

const TEMA_ICON: Record<string, string> = {
  'Byggteknisk': '🔧', 'Våtrom': '🚿', 'Tekniske installasjoner': '⚡',
  'Fukt og råte': '💧', 'Brann og sikkerhet': '🔥', 'Dokumentasjon': '📄',
  'Utvendig': '🏠', 'Annet': '📌',
};

type Metric = {
  totalPrice: number; prisantydning: number; gjeld: number; bra: number; rooms: number;
  year: number; rent: number; monthlyCF: number; grossYield: number; netYield: number;
  equity: number; roeCash: number; pricePerSqm: number; pmt: number; fellesutgRaw: number;
  etasje: number; images: string[]; address: string; title: string; energy: string;
  error?: string;
};

interface TGItem { grad: 0|1|2|3; kategori: string; tema?: string; beskrivelse: string; sporsmal?: string; }
interface RapportResult { adresse: string; sammendrag: string; tg: TGItem[]; positive: string[]; negative: string[]; }

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map(it => ('str' in it ? (it as { str: string }).str : '')).join(' '));
  }
  return pages.join('\n');
}

function MetricBox({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid rgba(15,23,42,0.06)' }}>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`text-xl font-black mt-1 ${color || 'text-slate-900'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}

function Carousel({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  if (!images.length) return null;
  const n = images.length;
  return (
    <div className="relative h-56 sm:h-72 rounded-xl overflow-hidden mb-5" style={{ background: '#000' }}>
      <img src={images[i]} alt="" className="w-full h-full object-cover" />
      {n > 1 && (
        <>
          <button onClick={() => setI((i - 1 + n) % n)} aria-label="Forrige"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>‹</button>
          <button onClick={() => setI((i + 1) % n)} aria-label="Neste"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>›</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, k) => (
              <span key={k} className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: k === i ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
          <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-md text-white"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>{i + 1} / {n}</span>
        </>
      )}
    </div>
  );
}

const TG_STYLE: Record<number, { bg: string; bd: string; col: string }> = {
  3: { bg: 'rgba(220,38,38,0.08)', bd: 'rgba(220,38,38,0.25)', col: '#b91c1c' },
  2: { bg: 'rgba(234,88,12,0.08)', bd: 'rgba(234,88,12,0.25)', col: '#c2410c' },
  1: { bg: 'rgba(202,138,4,0.1)', bd: 'rgba(202,138,4,0.25)', col: '#a16207' },
};

function AnalyseInner() {
  const params = useSearchParams();
  const finn = params.get('finn') || '';

  const [metric, setMetric] = useState<Metric | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [metaErr, setMetaErr] = useState('');
  const [showCashflow, setShowCashflow] = useState(false);

  // risk flow: idle → fetching (auto) → analysing → done | manual
  const [riskState, setRiskState] = useState<'idle' | 'fetching' | 'analysing' | 'done' | 'manual'>('idle');
  const [autoMegler, setAutoMegler] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [autoFetched, setAutoFetched] = useState(false);
  const [risk, setRisk] = useState<RapportResult | null>(null);
  const [riskErr, setRiskErr] = useState('');

  // manual upload
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [step, setStep] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const runRapport = async (text: string) => {
    const res = await fetch('/api/rapport', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data as RapportResult;
  };

  // Fetch metadata
  useEffect(() => {
    if (!finn) return;
    setLoadingMeta(true); setMetaErr('');
    fetch(`/api/analyze?url=${encodeURIComponent(finn)}`)
      .then(r => r.json())
      .then(d => { if (d.error) setMetaErr(d.error); else setMetric(d); })
      .catch(() => setMetaErr('Kunne ikke hente annonsen.'))
      .finally(() => setLoadingMeta(false));
  }, [finn]);

  // Auto-fetch + analyse salgsoppgave
  useEffect(() => {
    if (!finn) return;
    let cancelled = false;
    (async () => {
      setRiskState('fetching'); setRiskErr('');
      try {
        const res = await fetch(`/api/salgsoppgave?url=${encodeURIComponent(finn)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.found && data.text) {
          setAutoMegler(data.megler || '');
          setPdfUrl(data.pdfUrl || '');
          setAutoFetched(true);
          setRiskState('analysing');
          try {
            const r = await runRapport(data.text);
            if (cancelled) return;
            setRisk(r); setRiskState('done');
          } catch (e) {
            if (cancelled) return;
            setRiskErr(e instanceof Error ? e.message : 'AI-analysen feilet.');
            setRiskState('manual');
          }
        } else {
          setAutoMegler(data.megler || '');
          setRiskState('manual');
        }
      } catch {
        if (!cancelled) setRiskState('manual');
      }
    })();
    return () => { cancelled = true; };
  }, [finn]);

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') { setRiskErr('Kun PDF-filer støttes'); return; }
    setFile(f); setRiskErr('');
  };
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, []);

  const analyseManual = async () => {
    if (!file) return;
    setAnalysing(true); setRiskErr('');
    try {
      setStep('Leser PDF…');
      const text = await extractTextFromPDF(file);
      if (!text.trim()) { setRiskErr('Kunne ikke lese tekst fra PDF-en (kan være skannet).'); return; }
      setStep('AI analyserer salgsoppgaven…');
      const r = await runRapport(text);
      setRisk(r); setRiskState('done');
    } catch (e) {
      setRiskErr(e instanceof Error ? e.message : 'Noe gikk galt.');
    } finally { setAnalysing(false); setStep(''); }
  };

  const risks = risk ? [...risk.tg].filter(t => t.grad >= 1).sort((a, b) => b.grad - a.grad) : [];
  const counts = risk ? { 3: risk.tg.filter(t=>t.grad===3).length, 2: risk.tg.filter(t=>t.grad===2).length, 1: risk.tg.filter(t=>t.grad===1).length } : null;

  // Persist analysed bolig to "Mine boliger"
  useEffect(() => {
    if (!risk || !finn) return;
    saveAnalysis({
      id: newId(), savedAt: Date.now(), finnUrl: finn,
      address: risk.adresse || metric?.address || metric?.title || 'Bolig',
      image: metric?.images?.[0] || '', price: metric?.totalPrice || 0,
      summary: risk.sammendrag || '',
      counts: {
        tg3: risk.tg.filter(t => t.grad === 3).length,
        tg2: risk.tg.filter(t => t.grad === 2).length,
        tg1: risk.tg.filter(t => t.grad === 1).length,
      },
    });
  }, [risk, metric, finn]);

  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#f7f8fa' }}>
      <header className="px-4 sm:px-6 py-4 sticky top-0 z-20 backdrop-blur" style={{ background: 'rgba(247,248,250,0.9)', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="" className="w-7 h-7" />
            <span className="font-bold text-sm">Utleiekalkulator</span>
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">+ Ny analyse</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!finn && (
          <div className="rounded-2xl p-8 text-center" style={card}>
            <p className="text-slate-500 mb-4">Ingen bolig valgt.</p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              Start en analyse
            </Link>
          </div>
        )}

        {finn && loadingMeta && (
          <div className="rounded-2xl p-8 text-center" style={card}>
            <span className="animate-spin inline-block w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full mb-3" />
            <p className="text-slate-500 text-sm">Henter boligdata fra Finn…</p>
          </div>
        )}

        {metaErr && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-red-600 text-sm">{metaErr}</p>
          </div>
        )}

        {/* ── Property hero ── */}
        {metric && (
          <div className="rounded-2xl p-5 sm:p-6 mb-6" style={card}>
            <Carousel images={metric.images || []} />

            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-black">{metric.address || metric.title || 'Bolig'}</h1>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-black">{fmt(metric.totalPrice)} kr</span>
                  {metric.pricePerSqm > 0 && <span className="text-sm text-slate-500">{fmt(metric.pricePerSqm)} kr/m²</span>}
                </div>
                {metric.pmt > 0 && (
                  <Link href={`/kalkulator?finn=${encodeURIComponent(finn)}`} className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block">
                    Opptil {fmt(metric.pmt)} kr/mnd i lånekostnad ›
                  </Link>
                )}
              </div>
              <div className="flex gap-2">
                <a href={finn} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5" style={card}>
                  🔗 Finn-annonse
                </a>
                {pdfUrl ? (
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5" style={card}>
                    📎 Salgsoppgave (PDF)
                  </a>
                ) : (
                  <button onClick={() => document.getElementById('risikoanalyse')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className="text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5" style={card}>
                    📎 Salgsoppgave
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <Fact label="Prisantydning" value={`${fmt(metric.prisantydning)} kr`} />
              {metric.fellesutgRaw > 0 && <Fact label="Felleskost/mnd" value={`${fmt(metric.fellesutgRaw)} kr`} />}
              <Fact label="Areal" value={`${metric.bra} m²`} />
              <Fact label="Soverom" value={String(metric.rooms || '–')} />
              {metric.etasje > 0 && <Fact label="Etasje" value={`${metric.etasje}.`} />}
              <Fact label="Byggeår" value={metric.year ? String(metric.year) : '–'} />
            </div>
          </div>
        )}

        {/* anchor for Salgsoppgave-knapp / risk section */}
        <div id="risikoanalyse" className="scroll-mt-20" />

        {/* ── Auto-fetch status ── */}
        {finn && (riskState === 'fetching' || riskState === 'analysing') && (
          <div className="rounded-2xl p-6 mb-6 text-center" style={card}>
            <span className="animate-spin inline-block w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full mb-3" />
            <p className="text-slate-700 text-sm font-medium">
              {riskState === 'fetching' ? 'Henter salgsoppgaven automatisk…' : 'AI analyserer salgsoppgaven…'}
            </p>
            {autoMegler && riskState === 'analysing' && <p className="text-slate-500 text-xs mt-1">Kilde: {autoMegler}</p>}
          </div>
        )}

        {/* ── Risk results ── */}
        {risk && (
          <div className="flex flex-col gap-5">
            {/* Kort oppsummert */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <p className="text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">Kort oppsummert</p>
              <p className="text-sm leading-relaxed text-slate-700">{risk.sammendrag}</p>
              {autoMegler && <p className="text-slate-500 text-xs mt-2">Basert på salgsoppgaven hentet fra {autoMegler}.</p>}
            </div>

            {/* Oversiktsrad — tre paneler */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Fordeling av tilstandsgrader */}
              {counts && (counts[1] + counts[2] + counts[3] > 0) && (
                <div className="rounded-2xl p-5" style={card}>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Fordeling av tilstandsgrader</h3>
                  <div className="flex h-2.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(15,23,42,0.06)' }}>
                    {counts[3] > 0 && <div style={{ flex: counts[3], background: '#dc2626' }} />}
                    {counts[2] > 0 && <div style={{ flex: counts[2], background: '#ea580c' }} />}
                    {counts[1] > 0 && <div style={{ flex: counts[1], background: '#ca8a04' }} />}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {counts[3] > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: TG_STYLE[3].bg, border: `1px solid ${TG_STYLE[3].bd}`, color: TG_STYLE[3].col }}>Alvorlig (TG3): {counts[3]}</span>}
                    {counts[2] > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: TG_STYLE[2].bg, border: `1px solid ${TG_STYLE[2].bd}`, color: TG_STYLE[2].col }}>Kan kreve tiltak (TG2): {counts[2]}</span>}
                    {counts[1] > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: TG_STYLE[1].bg, border: `1px solid ${TG_STYLE[1].bd}`, color: TG_STYLE[1].col }}>Mindre (TG1): {counts[1]}</span>}
                  </div>
                </div>
              )}

              {/* Viktigste funn (scannbare chips) */}
              {risks.length > 0 && (
                <div className="rounded-2xl p-5" style={card}>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Viktigste funn</h3>
                  <div className="flex flex-wrap gap-2">
                    {risks.map((item, i) => {
                      const s = TG_STYLE[item.grad];
                      return (
                        <a key={i} href={`#funn-${i}`}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-transform hover:scale-[1.03]"
                          style={{ background: s.bg, border: `1px solid ${s.bd}`, color: s.col }}>
                          {TEMA_ICON[item.tema || 'Annet'] || '📌'} {item.kategori} <span className="opacity-50">›</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Boligens sterke sider */}
              {risk.positive.length > 0 && (
                <div className="rounded-2xl p-5" style={card}>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">Boligens sterke sider</h3>
                  <div className="flex flex-wrap gap-2">
                    {risk.positive.map((p, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg text-emerald-700"
                        style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.22)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Funn å være obs på — to kolonner */}
            <div>
              <h3 className="text-lg font-black mb-1">Funn å være obs på</h3>
              <p className="text-slate-500 text-sm mb-4">Hentet ut av salgsoppgaven og tilstandsrapporten</p>
              <div className="grid md:grid-cols-2 gap-4">
                {risks.map((item, i) => {
                  const s = TG_STYLE[item.grad];
                  return (
                    <div key={i} id={`funn-${i}`} className="rounded-2xl p-5 scroll-mt-20" style={card}>
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h4 className="font-bold text-base">{i + 1}. {item.kategori}</h4>
                        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"
                          style={{ background: s.bg, border: `1px solid ${s.bd}`, color: s.col }}>
                          {TEMA_ICON[item.tema || 'Annet'] || '📌'} {item.tema || `TG${item.grad}`}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.beskrivelse}</p>
                      {item.sporsmal && (
                        <div className="pl-4" style={{ borderLeft: '2px solid rgba(37,99,235,0.5)' }}>
                          <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-1">Ta opp med megler</p>
                          <p className="text-sm font-medium text-slate-900">“{item.sporsmal}”</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sjekkliste før du byr */}
            {risk.negative.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <h3 className="font-semibold text-red-600 mb-3">Sjekkliste før du byr</h3>
                <ul className="flex flex-col gap-2">{risk.negative.map((n,i)=><li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-red-500 shrink-0">·</span>{n}</li>)}</ul>
              </div>
            )}

            {/* Monetisering placeholders */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.18)' }}>
                <h3 className="font-bold mb-1">Vurderer du å selge?</h3>
                <p className="text-sm text-slate-600 mb-3">Verdivurdering og meglertilbud kan vi koble deg til — ta kontakt så hjelper vi.</p>
                <Link href="/om-oss" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ta kontakt →</Link>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.18)' }}>
                <h3 className="font-bold mb-1">Betaler du for mye i rente?</h3>
                <p className="text-sm text-slate-600 mb-3">Oppdatert boligverdi kan gi bedre betingelser. Dette kan arrangeres — ta kontakt.</p>
                <Link href="/om-oss" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Ta kontakt →</Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Manual upload fallback ── */}
        {riskState === 'manual' && !risk && (
          <div className="rounded-2xl p-6 mb-6" style={card}>
            <h2 className="font-bold text-lg mb-1">Risikoanalyse av salgsoppgaven</h2>
            <p className="text-slate-600 text-sm mb-4">
              {autoFetched
                ? `Vi hentet salgsoppgaven automatisk fra ${autoMegler}, men AI-analysen feilet${riskErr ? ` (${riskErr})` : ''}. Last opp PDF-en manuelt for å prøve igjen.`
                : autoMegler
                ? `Vi klarte ikke å hente salgsoppgaven automatisk fra ${autoMegler}. Last den ned fra annonsen og slipp PDF-en her.`
                : 'Last opp salgsoppgaven (PDF) fra Finn-annonsen, så leser AI-en tilstandsrapporten og gir deg risikofunn + spørsmål til megler.'}
            </p>
            <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl p-8 text-center cursor-pointer transition-all"
              style={{ border: `2px dashed ${dragging ? '#2563eb' : 'rgba(15,23,42,0.15)'}`, background: dragging ? 'rgba(37,99,235,0.06)' : '#f8fafc' }}>
              <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <div className="text-3xl mb-2">{file ? '📄' : '📂'}</div>
              {file
                ? <p className="text-sm font-semibold">{file.name} <span className="text-slate-500 font-normal">· {(file.size/1024/1024).toFixed(1)} MB</span></p>
                : <p className="text-sm text-slate-600">Dra og slipp PDF her, eller klikk for å velge</p>}
            </div>
            {riskErr && <p className="mt-3 text-red-600 text-sm text-center">{riskErr}</p>}
            <button onClick={analyseManual} disabled={!file || analysing}
              className="mt-4 w-full py-3.5 font-bold text-white rounded-xl disabled:opacity-40 transition-transform hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              {analysing ? <span className="flex items-center justify-center gap-2"><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />{step}</span> : 'Analyser salgsoppgave →'}
            </button>
          </div>
        )}

        {/* ── Lønnsomhet ved utleie (skjult bak knapp, nederst) ── */}
        {metric && (
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => setShowCashflow(v => !v)}
              className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)', boxShadow: '0 8px 20px rgba(14,165,233,0.35)' }}>
              {showCashflow ? 'Skjul lønnsomhet ved utleie' : 'Se lønnsomhet i utleiekalkulatoren'}
              <span>{showCashflow ? '↑' : '↓'}</span>
            </button>
            {showCashflow && (
              <div className="rounded-2xl p-5 sm:p-6 mt-4" style={card}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-blue-700 font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)' }}>Investor-vinkel</span>
                  <span className="text-xs text-slate-500">estimert ved utleie</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <MetricBox label="Kontantstrøm/mnd" value={`${metric.monthlyCF >= 0 ? '+' : ''}${fmt(metric.monthlyCF)} kr`}
                    color={metric.monthlyCF >= 0 ? 'text-emerald-600' : 'text-red-600'} />
                  <MetricBox label="Netto yield" value={`${metric.netYield.toString().replace('.', ',')} %`}
                    color={metric.netYield >= 5 ? 'text-emerald-600' : 'text-slate-900'} />
                  <MetricBox label="Egenkapital (15%)" value={`${fmt(metric.equity)} kr`} />
                  <MetricBox label="Est. leie/mnd" value={`${fmt(metric.rent)} kr`} />
                </div>
                <Link href={`/kalkulator?finn=${encodeURIComponent(finn)}`} className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-3 inline-block">
                  Juster tallene i kalkulatoren →
                </Link>
              </div>
            )}
            <Link href={`/kalkulator${finn ? `?finn=${encodeURIComponent(finn)}` : ''}`}
              className="w-full text-center py-3.5 rounded-xl font-bold transition-transform hover:scale-[1.01]"
              style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.25)', color: '#1d4ed8' }}>
              Åpne full utleiekalkulator →
            </Link>
          </div>
        )}

        <p className="text-xs text-slate-500 text-center mt-8 leading-relaxed">
          AI-analyse er veiledende og ikke juridisk eller finansiell rådgivning. Les alltid salgsoppgaven i sin helhet.
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#f7f8fa' }} />}>
      <AnalyseInner />
    </Suspense>
  );
}
