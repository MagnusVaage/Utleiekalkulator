'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

async function extractTextFromPDF(file: File): Promise<string> {
  // Dynamic import so pdfjs-dist only loads when needed
  const pdfjsLib = await import('pdfjs-dist');
  // Served from public/ — copied there by the prebuild script
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? (item as { str: string }).str : ''))
      .join(' ');
    pages.push(pageText);
  }
  return pages.join('\n');
}

interface TGItem {
  grad: 0 | 1 | 2 | 3;
  kategori: string;
  beskrivelse: string;
}

interface RapportResult {
  adresse: string;
  sammendrag: string;
  tg: TGItem[];
  positive: string[];
  negative: string[];
}

const TG_CONFIG = {
  3: { label: 'TG3', badgeBg: '#dc2626', rowBg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)', text: '#fca5a5', desc: 'Alvorlig' },
  2: { label: 'TG2', badgeBg: '#ea580c', rowBg: 'rgba(234,88,12,0.12)', border: 'rgba(234,88,12,0.3)', text: '#fdba74', desc: 'Betydelig' },
  1: { label: 'TG1', badgeBg: '#ca8a04', rowBg: 'rgba(202,138,4,0.12)', border: 'rgba(202,138,4,0.3)', text: '#fde68a', desc: 'Liten' },
  0: { label: 'TG0', badgeBg: '#16a34a', rowBg: 'rgba(22,163,74,0.10)', border: 'rgba(22,163,74,0.25)', text: '#86efac', desc: 'Ingen' },
} as const;

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function RapportPage() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RapportResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') { setError('Kun PDF-filer støttes'); return; }
    setFile(f); setError(''); setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const [step, setStep] = useState('');

  const analyse = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    try {
      setStep('Leser PDF...');
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        setError('Kunne ikke lese tekst fra PDF-en. Filen kan være skannet eller passordbeskyttet.');
        return;
      }
      setStep('Analyserer rapport...');
      const res = await fetch('/api/rapport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt. Prøv igjen.');
    } finally {
      setLoading(false); setStep('');
    }
  };

  // Sort TG items: 3 first, then 2, 1, 0
  const sortedTg = result
    ? [...result.tg].sort((a, b) => b.grad - a.grad)
    : [];

  const tgCounts = result
    ? { 3: result.tg.filter(t => t.grad === 3).length, 2: result.tg.filter(t => t.grad === 2).length, 1: result.tg.filter(t => t.grad === 1).length, 0: result.tg.filter(t => t.grad === 0).length }
    : null;

  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>

      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
              ← Kalkulator
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">TR</span>
              </div>
              <span className="font-semibold text-white text-sm">Tilstandsrapport-analyse</span>
            </div>
          </div>
          <span className="hidden md:block text-xs text-slate-500">AI-drevet · Gratis</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-3">
            Analyser din <span className="text-blue-400">tilstandsrapport</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Last opp PDF fra boligsalgsrapporten — AI-en leser gjennom og gir deg en ryddig oversikt over TG1, TG2 og TG3 funn.
          </p>
        </div>

        {/* Upload */}
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className="rounded-xl p-10 text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragging ? '#3b82f6' : 'rgba(255,255,255,0.15)'}`,
              background: dragging ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.2)',
            }}>
            <input ref={inputRef} type="file" accept=".pdf" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="text-4xl mb-3">{file ? '📄' : '📂'}</div>
            {file ? (
              <div>
                <p className="text-white font-semibold text-sm mb-1">{file.name}</p>
                <p className="text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB · Klikk for å bytte fil</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-300 text-sm font-medium mb-1">Dra og slipp PDF her</p>
                <p className="text-slate-600 text-xs">eller klikk for å velge fil</p>
              </div>
            )}
          </div>

          {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}

          <button onClick={analyse} disabled={!file || loading}
            className="mt-4 w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                {step || 'Laster...'}
              </span>
            ) : 'Analyser rapport →'}
          </button>

          {loading && (
            <p className="text-center text-slate-500 text-xs mt-2">
              {step === 'Leser PDF...' ? 'Trekker ut tekst fra PDF — tar 5–20 sek avhengig av størrelse' : 'AI analyserer innholdet — tar vanligvis 10–20 sek'}
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-5">

            {/* Summary card */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
              {result.adresse && (
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">{result.adresse}</p>
              )}
              <p className="text-white text-sm leading-relaxed">{result.sammendrag}</p>

              {/* TG count badges */}
              {tgCounts && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {([3, 2, 1, 0] as const).map(g => (
                    tgCounts[g] > 0 && (
                      <div key={g} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                        style={{ background: TG_CONFIG[g].rowBg, border: `1px solid ${TG_CONFIG[g].border}` }}>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{ background: TG_CONFIG[g].badgeBg }}>
                          TG{g}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: TG_CONFIG[g].text }}>
                          {tgCounts[g]} funn
                        </span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* TG Table */}
            <div className="rounded-2xl overflow-hidden" style={cardStyle}>
              <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="font-semibold text-white">Tilstandsgrader</h2>
                <p className="text-xs text-slate-500 mt-0.5">Sortert etter alvorlighetsgrad</p>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[80px_1fr_2fr] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-600"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span>Grad</span>
                <span>Kategori</span>
                <span>Beskrivelse</span>
              </div>

              {/* Rows */}
              {sortedTg.map((item, i) => {
                const cfg = TG_CONFIG[item.grad];
                return (
                  <div key={i}
                    className="grid grid-cols-[80px_1fr_2fr] px-6 py-3.5 items-center"
                    style={{
                      background: cfg.rowBg,
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                    <div>
                      <span className="text-xs font-bold px-2 py-1 rounded text-white" style={{ background: cfg.badgeBg }}>
                        TG{item.grad}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white">{item.kategori}</span>
                    <span className="text-sm" style={{ color: cfg.text }}>{item.beskrivelse}</span>
                  </div>
                );
              })}
            </div>

            {/* Positive / Negative */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Positive */}
              <div className="rounded-2xl p-5" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✅</span> Positivt
                </h3>
                <ul className="flex flex-col gap-2">
                  {result.positive.map((p, i) => (
                    <li key={i} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-emerald-500 shrink-0">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Negative */}
              <div className="rounded-2xl p-5" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Vær oppmerksom
                </h3>
                <ul className="flex flex-col gap-2">
                  {result.negative.map((n, i) => (
                    <li key={i} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-red-500 shrink-0">·</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* New analysis button */}
            <button onClick={() => { setResult(null); setFile(null); setError(''); }}
              className="text-slate-500 hover:text-slate-300 text-sm text-center transition-colors py-2">
              ← Analyser en annen rapport
            </button>

          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs text-slate-700">
          AI-analyse er veiledende og ikke juridisk rådgivning · Les alltid rapporten i sin helhet
        </p>
      </footer>
    </div>
  );
}
