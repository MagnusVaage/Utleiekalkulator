'use client';

import { useState, useRef, useMemo } from 'react';

interface WfItem {
  label: string;
  value: number;
  type: string;
}

interface Result {
  score: number;
  label: string;
  labelColor: string;
  totalPrice: number;
  prisantydning: number;
  gjeld: number;
  bra: number;
  rooms: number;
  year: number;
  rent: number;
  fellesutg: number;
  monthlyCF: number;
  grossYield: number;
  netYield: number;
  equity: number;
  roeCash: number;
  paybackYears: number;
  loan: number;
  pmt: number;
  wf: WfItem[];
  address: string;
  title: string;
  energy: string;
  pricePerSqm: number;
  rate: number;
  termYears: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat('nb-NO').format(Math.round(n));
}

function pmt(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function Gauge({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 72;
  const cx = 100;
  const cy = 100;
  const startAngle = Math.PI;
  const totalArc = Math.PI;
  const filledArc = totalArc * (score / 100);

  const arcPath = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleAngle = startAngle + filledArc;
  const nx = cx + (r - 8) * Math.cos(needleAngle);
  const ny = cy + (r - 8) * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="200" height="115" viewBox="0 0 200 115">
        <path d={arcPath(startAngle, startAngle + totalArc)} fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
        <path d={arcPath(startAngle, startAngle + filledArc)} fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="#374151" />
        <text x={cx} y={cy - 16} textAnchor="middle" fill="#111827" fontSize="30" fontWeight="bold">{score}</text>
        <text x="18" y="112" fill="#9ca3af" fontSize="9">0</text>
        <text x="184" y="112" fill="#9ca3af" fontSize="9">100</text>
      </svg>
      <span className="text-xs font-bold tracking-widest px-3 py-1 rounded-full" style={{ color, backgroundColor: color + '18', border: `1.5px solid ${color}50` }}>
        {label}
      </span>
    </div>
  );
}

function MetricCard({ title, value, sub, color = '#2563eb' }: { title: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{title}</div>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
    </div>
  );
}

function Waterfall({ items }: { items: WfItem[] }) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)));
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const pct = Math.abs(item.value) / max;
        const isNeg = item.value < 0;
        const isNet = item.type.startsWith('net');
        const color = isNet ? (item.value >= 0 ? '#16a34a' : '#ef4444') : isNeg ? '#f97316' : '#3b82f6';
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="text-[11px] text-gray-400 w-24 text-right shrink-0">{item.label}</div>
            <div className="flex-1 relative h-6 bg-gray-50 rounded-lg overflow-hidden">
              <div className="absolute top-0 h-full rounded-lg" style={{ width: `${pct * 100}%`, backgroundColor: color + 'cc', left: isNeg ? 'auto' : 0, right: isNeg ? 0 : 'auto' }} />
            </div>
            <div className="text-[11px] font-semibold w-20 text-right shrink-0" style={{ color }}>
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
      <div className="text-[11px] text-gray-500 w-28 shrink-0">{label}</div>
      <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="text-[11px] text-gray-400 w-10 text-right">{pts}/{max}</div>
    </div>
  );
}

function Slider({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-bold text-gray-800">{format(value)}</span>
      </div>
      <div className="relative">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #16a34a ${pct}%, #e5e7eb ${pct}%)` }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const [rentAdj, setRentAdj] = useState(100);
  const [ekPct, setEkPct] = useState(15);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setRentAdj(100);
    setEkPct(15);
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setResult(data);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch {
      setError('Nettverksfeil. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const adj = useMemo(() => {
    if (!result) return null;
    const rent = Math.round(result.rent * rentAdj / 100);
    const equity = result.totalPrice * ekPct / 100;
    const loan = result.totalPrice - equity;
    const monthlyPmt = pmt(loan, result.rate, result.termYears);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">YS</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm tracking-tight">YieldScout</div>
              <div className="text-[10px] text-gray-400">Norsk eiendomsanalyse</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Live · Hybel.no-priser · Fana Sparebank 4,8%
          </div>
        </div>
      </header>

      {/* Hero + input */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Er dette en god deal?</h1>
          <p className="text-gray-500 text-sm">Lim inn en Finn.no-lenke og få øyeblikkelig lønnsomhetsanalyse</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="https://www.finn.no/realestate/homes/ad.html?finnkode=..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition"
          />
          <button
            onClick={analyze}
            disabled={loading || !url.trim()}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? 'Analyserer...' : 'Analyser →'}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
          <div className="text-gray-400 text-sm">Henter data fra Finn.no...</div>
        </div>
      )}

      {/* Results */}
      {result && adj && (
        <div ref={resultRef} className="max-w-3xl mx-auto px-6 pb-20 flex flex-col gap-5">

          {/* Property header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs text-gray-400 mb-1">{result.address}</div>
            <div className="font-bold text-gray-900 text-lg leading-snug">{result.title || 'Finn.no-annonse'}</div>
            <div className="text-sm text-gray-400 mt-1">{result.bra} m² · {result.rooms} rom · Bygget {result.year}{result.energy ? ` · Energi ${result.energy}` : ''}</div>
            <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-50">
              <div>
                <div className="text-[10px] text-gray-400 uppercase mb-0.5">Prisantydning</div>
                <div className="font-bold text-gray-900">{fmt(result.prisantydning)} kr</div>
              </div>
              {result.gjeld > 0 && (
                <div>
                  <div className="text-[10px] text-gray-400 uppercase mb-0.5">Fellesgjeld</div>
                  <div className="font-bold text-orange-500">{fmt(result.gjeld)} kr</div>
                </div>
              )}
              <div>
                <div className="text-[10px] text-gray-400 uppercase mb-0.5">Totalpris</div>
                <div className="font-bold text-gray-900">{fmt(result.totalPrice)} kr</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase mb-0.5">Kr/kvm</div>
                <div className="font-bold text-gray-900">{fmt(result.pricePerSqm)} kr</div>
              </div>
            </div>
          </div>

          {/* Gauge + metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex justify-center">
              <Gauge score={result.score} label={result.label} color={result.labelColor} />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              <MetricCard title="Estimert mnd. leie" value={`${fmt(adj.rent)} kr`} sub={`${fmt(adj.rent / result.bra)} kr/kvm`} color="#2563eb" />
              <MetricCard
                title="Månedlig overskudd"
                value={`${adj.monthlyCF >= 0 ? '+' : ''}${fmt(adj.monthlyCF)} kr`}
                sub={`${fmt(adj.monthlyCF * 12)} kr/år`}
                color={adj.monthlyCF >= 0 ? '#16a34a' : '#ef4444'}
              />
              <MetricCard
                title="Brutto yield"
                value={`${adj.grossYield}%`}
                sub="Leie vs totalpris"
                color={adj.grossYield >= 6 ? '#16a34a' : adj.grossYield >= 4 ? '#f59e0b' : '#ef4444'}
              />
              <MetricCard title="Egenkapital inn" value={`${fmt(adj.equity)} kr`} sub={`${ekPct}% av totalpris`} color="#7c3aed" />
              <MetricCard
                title="Avkastning på EK"
                value={`${adj.roeCash}%`}
                sub="Kontantstrøm vs EK"
                color={adj.roeCash >= 8 ? '#16a34a' : adj.roeCash >= 4 ? '#f59e0b' : '#ef4444'}
              />
              <MetricCard
                title="Nedbetalt på"
                value={adj.paybackYears < 99 ? `${adj.paybackYears} år` : '—'}
                sub="Tid til EK er tilbake"
                color="#ea580c"
              />
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-5 font-medium">Juster forutsetninger</div>
            <div className="flex flex-col gap-5">
              <Slider
                label="Leieinntekt"
                value={rentAdj}
                min={60}
                max={140}
                step={1}
                format={(v) => `${fmt(result.rent * v / 100)} kr/mnd (${v}%)`}
                onChange={setRentAdj}
              />
              <Slider
                label="Egenkapital"
                value={ekPct}
                min={10}
                max={40}
                step={1}
                format={(v) => `${v}% = ${fmt(result.totalPrice * v / 100)} kr`}
                onChange={setEkPct}
              />
            </div>
          </div>

          {/* Cashflow waterfall */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-medium">Månedlig kontantstrøm</div>
            <Waterfall items={adj.wf} />
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-medium">Deal Score — {result.score}/100</div>
            <div className="flex flex-col gap-3">
              {scoreBreakdown.map((b) => <ScoreBar key={b.label} {...b} />)}
            </div>
          </div>

          {/* Forutsetninger */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Forutsetninger</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ['Belåning', `${100 - ekPct}%`],
                ['Rente', `${result.rate}% (Fana Sparebank)`],
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

          <div className="text-center text-gray-300 text-xs pt-2">
            Leieestimater fra hybel.no · Rente fra Finansportalen · Ikke finansiell rådgivning
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <div className="text-gray-400 text-sm">Analyser en bolig ved å lime inn en Finn.no-lenke ovenfor</div>
        </div>
      )}
    </div>
  );
}
