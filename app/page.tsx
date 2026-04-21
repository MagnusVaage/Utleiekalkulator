'use client';

import { useState, useRef, useMemo } from 'react';

interface WfItem { label: string; value: number; type: string; }

interface Result {
  score: number; label: string; labelColor: string;
  totalPrice: number; prisantydning: number; gjeld: number;
  bra: number; rooms: number; year: number;
  rent: number; fellesutg: number; monthlyCF: number;
  grossYield: number; netYield: number;
  equity: number; roeCash: number; paybackYears: number;
  loan: number; pmt: number; wf: WfItem[];
  address: string; title: string; energy: string;
  pricePerSqm: number; rate: number; termYears: number;
}

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));

function calcPmt(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function Gauge({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 80, cx = 110, cy = 105;
  const arc = (a: number) => ({ x: cx + r * Math.cos(Math.PI + a * Math.PI), y: cy + r * Math.sin(Math.PI + a * Math.PI) });
  const p = score / 100;
  const a1 = arc(0), a2 = arc(p);
  const bg1 = arc(0), bg2 = arc(1);
  const np = arc(p - 0.01);
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="220" height="120" viewBox="0 0 220 120">
        <path d={`M ${bg1.x} ${bg1.y} A ${r} ${r} 0 1 1 ${bg2.x} ${bg2.y}`} fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
        {p > 0 && <path d={`M ${a1.x} ${a1.y} A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${a2.x} ${a2.y}`} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />}
        <line x1={cx} y1={cy} x2={np.x} y2={np.y} stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="#6b7280" />
        <text x={cx} y={cy - 20} textAnchor="middle" fill="#111827" fontSize="34" fontWeight="bold">{score}</text>
      </svg>
      <span className="text-xs font-bold tracking-widest px-4 py-1.5 rounded-full" style={{ color, background: color + '15', border: `1.5px solid ${color}40` }}>{label}</span>
    </div>
  );
}

function Card({ title, value, sub, color = '#2563eb', big }: { title: string; value: string; sub?: string; color?: string; big?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1.5">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{title}</div>
      <div className={`font-bold ${big ? 'text-3xl' : 'text-2xl'}`} style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function Waterfall({ items }: { items: WfItem[] }) {
  const max = Math.max(...items.map(i => Math.abs(i.value)));
  return (
    <div className="flex flex-col gap-2.5">
      {items.map(item => {
        const pct = Math.abs(item.value) / max;
        const isNeg = item.value < 0;
        const isNet = item.type.startsWith('net');
        const color = isNet ? (item.value >= 0 ? '#16a34a' : '#ef4444') : isNeg ? '#f97316' : '#3b82f6';
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="text-xs text-gray-400 w-24 text-right shrink-0">{item.label}</div>
            <div className="flex-1 h-7 bg-gray-50 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 h-full rounded-lg" style={{ width: `${pct * 100}%`, backgroundColor: color + 'cc', left: isNeg ? 'auto' : 0, right: isNeg ? 0 : 'auto' }} />
            </div>
            <div className="text-xs font-semibold w-24 text-right shrink-0" style={{ color }}>
              {isNeg ? '−' : '+'}{fmt(Math.abs(item.value))} kr
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreBar({ label, pts, max }: { label: string; pts: number; max: number }) {
  const pct = (pts / max) * 100;
  const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-gray-500 w-28 shrink-0">{label}</div>
      <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="text-xs text-gray-400 w-10 text-right">{pts}/{max}</div>
    </div>
  );
}

function Slider({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <span className="text-sm font-bold text-gray-800">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right,#16a34a ${pct}%,#e5e7eb ${pct}%)` }}
      />
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [rentAdj, setRentAdj] = useState(100);
  const [ekPct, setEkPct] = useState(15);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(''); setResult(null); setRentAdj(100); setEkPct(15);
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setResult(data); setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }
    } catch { setError('Nettverksfeil. Prøv igjen.'); }
    finally { setLoading(false); }
  };

  const adj = useMemo(() => {
    if (!result) return null;
    const rent = Math.round(result.rent * rentAdj / 100);
    const equity = result.totalPrice * ekPct / 100;
    const loan = result.totalPrice - equity;
    const monthlyPmt = calcPmt(loan, result.rate, result.termYears);
    const vacancy = Math.round(rent * 0.04);
    const maintenance = Math.round(rent * 0.03);
    const monthlyCF = Math.round(rent - result.fellesutg - vacancy - maintenance - monthlyPmt);
    const grossYield = (rent * 12) / result.totalPrice * 100;
    const roeCash = equity > 0 ? (monthlyCF * 12) / equity * 100 : 0;
    const paybackYears = monthlyCF > 0 ? equity / (monthlyCF * 12) : 99;
    const wf: WfItem[] = [
      { label: 'Leieinntekt', value: rent, type: 'income' },
      { label: 'Felleskost', value: -result.fellesutg, type: 'expense' },
      { label: 'Ledighet', value: -vacancy, type: 'expense' },
      { label: 'Vedlikehold', value: -maintenance, type: 'expense' },
      { label: 'Lånekostnad', value: -monthlyPmt, type: 'expense' },
      { label: 'Netto CF', value: monthlyCF, type: monthlyCF >= 0 ? 'net-pos' : 'net-neg' },
    ];
    return { rent, equity, loan, monthlyPmt, monthlyCF, grossYield: Math.round(grossYield * 10) / 10, roeCash: Math.round(roeCash * 10) / 10, paybackYears: Math.round(paybackYears * 10) / 10, wf };
  }, [result, rentAdj, ekPct]);

  const scoreBreakdown = result ? [
    { label: 'Brutto yield', pts: result.grossYield >= 8 ? 30 : result.grossYield >= 6 ? 22 : result.grossYield >= 5 ? 15 : result.grossYield >= 4 ? 8 : 3, max: 30 },
    { label: 'Kontantstrøm', pts: result.monthlyCF >= 3000 ? 20 : result.monthlyCF >= 1000 ? 15 : result.monthlyCF >= 0 ? 8 : 2, max: 20 },
    { label: 'Pris per kvm', pts: result.pricePerSqm < 50000 ? 20 : result.pricePerSqm < 75000 ? 14 : result.pricePerSqm < 100000 ? 8 : 3, max: 20 },
    { label: 'Byggeår', pts: result.year >= 2015 ? 10 : result.year >= 2000 ? 7 : result.year >= 1990 ? 5 : 2, max: 10 },
    { label: 'Fellesgjeld', pts: (result.gjeld / result.totalPrice) < 0.1 ? 10 : (result.gjeld / result.totalPrice) < 0.2 ? 7 : (result.gjeld / result.totalPrice) < 0.35 ? 4 : 1, max: 10 },
    { label: 'Antall rom', pts: result.rooms >= 3 ? 10 : result.rooms >= 2 ? 7 : 3, max: 10 },
  ] : [];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="absolute inset-0 bg-white/55" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-sm">UK</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">Utleiekalkulator</div>
              <div className="text-[10px] text-gray-400">Norsk eiendomsanalyse</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            Hybel.no-priser · Fana Sparebank 4,8% · 30 år
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className="px-8 py-10">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Er dette en god deal?</h1>
          <p className="text-gray-500">Lim inn en Finn.no-lenke og få øyeblikkelig lønnsomhetsanalyse</p>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex gap-3">
          <input
            type="url" value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="https://www.finn.no/realestate/homes/ad.html?finnkode=..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
          />
          <button onClick={analyze} disabled={loading || !url.trim()}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold text-sm rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 transition-all shadow-sm whitespace-nowrap">
            {loading ? 'Analyserer...' : 'Analyser →'}
          </button>
        </div>
        {error && <div className="max-w-3xl mx-auto mt-3 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
          <div className="text-gray-400 text-sm">Henter data fra Finn.no...</div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '📊', title: 'Deal Score', desc: 'Automatisk score 0–100 basert på yield, kontantstrøm og pris' },
              { icon: '💰', title: 'Kontantstrøm', desc: 'Se hva du sitter igjen med hver måned etter alle kostnader' },
              { icon: '🎚️', title: 'Justerbare forutsetninger', desc: 'Endre leie og egenkapital med sliders og se effekten live' },
            ].map(c => (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <div className="text-4xl mb-3">{c.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{c.title}</div>
                <div className="text-sm text-gray-400">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && adj && (
        <div ref={resultRef} className="px-8 pb-20">

          {/* Property banner */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 mb-0.5">{result.address}</div>
                <h2 className="font-bold text-gray-900 text-xl leading-snug">{result.title || 'Finn.no-annonse'}</h2>
                <div className="text-sm text-gray-400 mt-1">{result.bra} m² · {result.rooms} rom · Bygget {result.year}{result.energy ? ` · Energi ${result.energy}` : ''}</div>
              </div>
              <div className="flex flex-wrap gap-6 shrink-0">
                <div><div className="text-[10px] text-gray-400 uppercase mb-0.5">Prisantydning</div><div className="font-bold text-gray-900 text-lg">{fmt(result.prisantydning)} kr</div></div>
                {result.gjeld > 0 && <div><div className="text-[10px] text-gray-400 uppercase mb-0.5">Fellesgjeld</div><div className="font-bold text-orange-500 text-lg">{fmt(result.gjeld)} kr</div></div>}
                <div><div className="text-[10px] text-gray-400 uppercase mb-0.5">Totalpris</div><div className="font-bold text-gray-900 text-lg">{fmt(result.totalPrice)} kr</div></div>
                <div><div className="text-[10px] text-gray-400 uppercase mb-0.5">Kr/kvm</div><div className="font-bold text-gray-900 text-lg">{fmt(result.pricePerSqm)} kr</div></div>
              </div>
            </div>
          </div>

          {/* Main 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT column */}
            <div className="flex flex-col gap-5">

              {/* Gauge + score */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
                <Gauge score={result.score} label={result.label} color={result.labelColor} />
                <div className="w-full flex flex-col gap-3 pt-2 border-t border-gray-50">
                  {scoreBreakdown.map(b => <ScoreBar key={b.label} {...b} />)}
                </div>
              </div>

              {/* Sliders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-5">Juster forutsetninger</div>
                <div className="flex flex-col gap-6">
                  <Slider label="Leieinntekt" value={rentAdj} min={60} max={140} step={1}
                    display={`${fmt(result.rent * rentAdj / 100)} kr/mnd (${rentAdj}%)`}
                    onChange={setRentAdj} />
                  <Slider label="Egenkapital" value={ekPct} min={10} max={40} step={1}
                    display={`${ekPct}% = ${fmt(result.totalPrice * ekPct / 100)} kr`}
                    onChange={setEkPct} />
                </div>
              </div>

              {/* Forutsetninger */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Forutsetninger</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['Belåning', `${100 - ekPct}%`],
                    ['Rente', `${result.rate}% p.a.`],
                    ['Løpetid', `${result.termYears} år`],
                    ['Lån', `${fmt(adj.loan)} kr`],
                    ['Terminbeløp', `${fmt(adj.monthlyPmt)} kr/mnd`],
                    ['Felleskost', `${fmt(result.fellesutg)} kr/mnd`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] text-gray-400 uppercase mb-0.5">{k}</div>
                      <div className="text-sm font-semibold text-gray-700">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT column */}
            <div className="flex flex-col gap-5">

              {/* 6 metric cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card title="Estimert mnd. leie" value={`${fmt(adj.rent)} kr`} sub={`${fmt(adj.rent / result.bra)} kr/kvm/mnd`} color="#2563eb" />
                <Card title="Månedlig overskudd" value={`${adj.monthlyCF >= 0 ? '+' : ''}${fmt(adj.monthlyCF)} kr`} sub={`${fmt(adj.monthlyCF * 12)} kr/år`} color={adj.monthlyCF >= 0 ? '#16a34a' : '#ef4444'} />
                <Card title="Brutto yield" value={`${adj.grossYield}%`} sub="Leie vs totalpris" color={adj.grossYield >= 6 ? '#16a34a' : adj.grossYield >= 4 ? '#f59e0b' : '#ef4444'} />
                <Card title="Egenkapital inn" value={`${fmt(adj.equity)} kr`} sub={`${ekPct}% av totalpris`} color="#7c3aed" />
                <Card title="Avkastning på EK" value={`${adj.roeCash}%`} sub="Kontantstrøm vs EK" color={adj.roeCash >= 8 ? '#16a34a' : adj.roeCash >= 4 ? '#f59e0b' : '#ef4444'} />
                <Card title="Nedbetalt på" value={adj.paybackYears < 99 ? `${adj.paybackYears} år` : '—'} sub="Tid til EK er tilbake" color="#ea580c" />
              </div>

              {/* Waterfall */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-5">Månedlig kontantstrøm</div>
                <Waterfall items={adj.wf} />
              </div>

            </div>
          </div>

          <div className="text-center text-gray-300 text-xs mt-8">
            Leiepriser fra hybel.no · Rente fra Finansportalen (Fana Sparebank) · Ikke finansiell rådgivning
          </div>
        </div>
      )}
    </div>
  );
}

