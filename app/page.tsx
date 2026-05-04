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
const fmtPct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

function calcPmt(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function remainingLoan(principal: number, annualRate: number, totalYears: number, yearsPaid: number) {
  const r = annualRate / 100 / 12;
  const n = totalYears * 12;
  const k = yearsPaid * 12;
  if (r === 0) return Math.max(0, principal * (1 - k / n));
  return Math.max(0, Math.round(principal * (Math.pow(1 + r, n) - Math.pow(1 + r, k)) / (Math.pow(1 + r, n) - 1)));
}

function Gauge({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 80, cx = 110, cy = 105;
  const arc = (a: number) => ({ x: cx + r * Math.cos(Math.PI + a * Math.PI), y: cy + r * Math.sin(Math.PI + a * Math.PI) });
  const p = score / 100;
  const bg2 = arc(1), a1 = arc(0), a2 = arc(p), np = arc(Math.max(0.01, p) - 0.01);
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="220" height="120" viewBox="0 0 220 120">
        <path d={`M ${arc(0).x} ${arc(0).y} A ${r} ${r} 0 1 1 ${bg2.x} ${bg2.y}`} fill="none" stroke="#f3f4f6" strokeWidth="18" strokeLinecap="round" />
        {p > 0 && <path d={`M ${a1.x} ${a1.y} A ${r} ${r} 0 ${p > 0.5 ? 1 : 0} 1 ${a2.x} ${a2.y}`} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" />}
        <line x1={cx} y1={cy} x2={np.x} y2={np.y} stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="#9ca3af" />
        <text x={cx} y={cy - 18} textAnchor="middle" fill="#111827" fontSize="36" fontWeight="bold">{score}</text>
        <text x="18" y="112" fill="#d1d5db" fontSize="9">0</text>
        <text x="184" y="112" fill="#d1d5db" fontSize="9">100</text>
      </svg>
      <span className="text-xs font-bold tracking-widest px-4 py-1.5 rounded-full" style={{ color, background: color + '18', border: `1.5px solid ${color}50` }}>{label}</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="font-bold text-base" style={{ color: color || '#111827' }}>{value}</div>
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
              <div className="absolute top-0 h-full rounded-lg transition-all duration-500" style={{ width: `${pct * 100}%`, backgroundColor: color + 'cc', left: isNeg ? 'auto' : 0, right: isNeg ? 0 : 'auto' }} />
            </div>
            <div className="text-xs font-semibold w-24 text-right shrink-0" style={{ color }}>{isNeg ? '−' : '+'}{fmt(Math.abs(item.value))} kr</div>
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
      <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="text-xs text-gray-400 w-10 text-right">{pts}/{max}</div>
    </div>
  );
}

function Slider({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number; display: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
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

interface ManualInput {
  prisantydning: string; gjeld: string; bra: string; rooms: string;
  year: string; fellesutg: string; rent: string; city: string;
}

const CITIES: Record<string, number> = {
  oslo: 1.0, bergen: 0.82, stavanger: 0.80, trondheim: 0.73, annet: 0.65,
};

function computeManual(m: ManualInput): Result | null {
  const price = parseInt(m.prisantydning.replace(/\s/g, '')) || 0;
  if (!price) return null;
  const gjeld = parseInt(m.gjeld.replace(/\s/g, '')) || 0;
  const total = price + gjeld;
  const bra = parseInt(m.bra) || 50;
  const rooms = parseInt(m.rooms) || 2;
  const year = parseInt(m.year) || 2000;
  const fellesutg = parseInt(m.fellesutg.replace(/\s/g, '')) || Math.round(bra * 38);

  const cityMult = CITIES[m.city] ?? 0.65;
  const osloBase = rooms <= 1 ? { base: 14444, typBra: 35 } : rooms === 2 ? { base: 18703, typBra: 55 } : { base: 23260, typBra: 75 };
  const estimatedRent = Math.round(osloBase.base * cityMult * (bra / osloBase.typBra) * (year >= 2020 ? 1.06 : year >= 2010 ? 1.03 : 1.0));
  const rent = parseInt(m.rent.replace(/\s/g, '')) || estimatedRent;

  const rate = 4.8; const termYears = 30;
  const loan = total * 0.85; const equity = total * 0.15;
  const r = rate / 100 / 12; const n = termYears * 12;
  const pmt = Math.round(loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const vacancy = Math.round(rent * 0.04); const maintenance = Math.round(rent * 0.03);
  const monthlyCF = Math.round(rent - fellesutg - vacancy - maintenance - pmt);
  const grossYield = (rent * 12) / total * 100;
  const netYield = ((rent - fellesutg - vacancy - maintenance) * 12) / total * 100;
  const roeCash = equity > 0 ? (monthlyCF * 12) / equity * 100 : 0;
  const paybackYears = monthlyCF > 0 ? equity / (monthlyCF * 12) : 99;
  const pricePerSqm = bra > 0 ? Math.round(total / bra) : 0;

  let score = 0;
  score += grossYield >= 8 ? 30 : grossYield >= 6 ? 22 : grossYield >= 5 ? 15 : grossYield >= 4 ? 8 : 3;
  score += monthlyCF >= 3000 ? 20 : monthlyCF >= 1000 ? 15 : monthlyCF >= 0 ? 8 : 2;
  score += pricePerSqm < 50000 ? 20 : pricePerSqm < 75000 ? 14 : pricePerSqm < 100000 ? 8 : 3;
  score += year >= 2015 ? 10 : year >= 2000 ? 7 : year >= 1990 ? 5 : 2;
  score += (gjeld / total) < 0.1 ? 10 : (gjeld / total) < 0.2 ? 7 : (gjeld / total) < 0.35 ? 4 : 1;
  score += rooms >= 3 ? 10 : rooms >= 2 ? 7 : 3;
  score = Math.min(100, Math.max(0, score));

  const label = score >= 75 ? 'STERK DEAL' : score >= 60 ? 'SOLID' : score >= 45 ? 'NØYTRAL' : score >= 30 ? 'SVAK' : 'UNNGÅ';
  const labelColor = score >= 75 ? '#22c55e' : score >= 60 ? '#84cc16' : score >= 45 ? '#eab308' : score >= 30 ? '#f97316' : '#ef4444';
  const wf: WfItem[] = [
    { label: 'Leieinntekt', value: rent, type: 'income' },
    { label: 'Felleskost', value: -fellesutg, type: 'expense' },
    { label: 'Ledighet', value: -vacancy, type: 'expense' },
    { label: 'Vedlikehold', value: -maintenance, type: 'expense' },
    { label: 'Lånekostnad', value: -pmt, type: 'expense' },
    { label: 'Netto CF', value: monthlyCF, type: monthlyCF >= 0 ? 'net-pos' : 'net-neg' },
  ];
  return {
    score, label, labelColor, totalPrice: total, prisantydning: price, gjeld, bra, rooms, year,
    rent, fellesutg, monthlyCF, grossYield: Math.round(grossYield * 10) / 10,
    netYield: Math.round(netYield * 10) / 10, equity: Math.round(equity), roeCash: Math.round(roeCash * 10) / 10,
    paybackYears: Math.round(paybackYears * 10) / 10, loan: Math.round(loan), pmt, wf,
    address: m.city.charAt(0).toUpperCase() + m.city.slice(1), title: 'Manuell analyse',
    energy: '', pricePerSqm, rate, termYears,
  };
}

const FEATURES = [
  { icon: '⚡', title: 'Øyeblikkelig analyse', desc: 'Lim inn Finn.no-lenken — alt beregnes automatisk på sekunder' },
  { icon: '🏦', title: 'Skatt inkludert', desc: '22% skatt på utleieinntekt beregnes automatisk — se hva du faktisk sitter igjen med' },
  { icon: '📈', title: '10-år prognose', desc: 'Se egenkapitalvekst, boligverdi og kontantstrøm år for år' },
  { icon: '🎚️', title: 'Justerbar kalkulator', desc: 'Endre leie og egenkapital med sliders og se effekten live' },
];

export default function Home() {
  const [mode, setMode] = useState<'url' | 'manual'>('url');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [rentAdj, setRentAdj] = useState(100);
  const [ekPct, setEkPct] = useState(15);
  const resultRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState<ManualInput>({
    prisantydning: '', gjeld: '', bra: '', rooms: '2', year: '',
    fellesutg: '', rent: '', city: 'oslo',
  });
  const setM = (k: keyof ManualInput) => (v: string) => setManual(p => ({ ...p, [k]: v }));

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true); setError(''); setResult(null); setRentAdj(100); setEkPct(15);
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setResult(data); setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150); }
    } catch { setError('Nettverksfeil. Prøv igjen.'); }
    finally { setLoading(false); }
  };

  const analyzeManual = () => {
    setError(''); setResult(null); setRentAdj(100); setEkPct(15);
    const r = computeManual(manual);
    if (!r) { setError('Fyll inn minst prisantydning.'); return; }
    setResult(r);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
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

    // Tax: 22% on (rent - fellesutg - maintenance - vacancy - interest)*12
    const annualInterest = loan * result.rate / 100;
    const taxableAnnual = Math.max(0, (rent - result.fellesutg - maintenance - vacancy) * 12 - annualInterest);
    const monthlyTax = Math.round(taxableAnnual * 0.22 / 12);
    const afterTaxCF = monthlyCF - monthlyTax;
    const afterTaxRoeCash = equity > 0 ? (afterTaxCF * 12) / equity * 100 : 0;

    const wf: WfItem[] = [
      { label: 'Leieinntekt', value: rent, type: 'income' },
      { label: 'Felleskost', value: -result.fellesutg, type: 'expense' },
      { label: 'Ledighet', value: -vacancy, type: 'expense' },
      { label: 'Vedlikehold', value: -maintenance, type: 'expense' },
      { label: 'Lånekostnad', value: -monthlyPmt, type: 'expense' },
      { label: 'Skatt (22%)', value: -monthlyTax, type: 'expense' },
      { label: 'Etter skatt', value: afterTaxCF, type: afterTaxCF >= 0 ? 'net-pos' : 'net-neg' },
    ];

    // 10-year prognosis (3% annual property value growth)
    let cumulativeCF = 0;
    const prognosis = Array.from({ length: 10 }, (_, i) => {
      const yr = i + 1;
      const propValue = Math.round(result.totalPrice * Math.pow(1.03, yr));
      const remLoan = remainingLoan(loan, result.rate, result.termYears, yr);
      const eq = propValue - remLoan;
      cumulativeCF += afterTaxCF * 12;
      return { yr, propValue, remLoan, equity: eq, cumulativeCF: Math.round(cumulativeCF) };
    });

    return {
      rent, equity, loan, monthlyPmt, monthlyCF, monthlyTax, afterTaxCF,
      grossYield: Math.round(grossYield * 10) / 10,
      roeCash: Math.round(roeCash * 10) / 10,
      afterTaxRoeCash: Math.round(afterTaxRoeCash * 10) / 10,
      paybackYears: Math.round(paybackYears * 10) / 10,
      wf, prognosis,
    };
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
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="blob blob-3" /><div className="blob blob-4" />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">UK</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Utleiekalkulator</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Hybel.no · Finansportalen · Oppdatert 2026
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="px-8 pt-16 pb-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Gratis · Ingen registrering · Resultater på sekunder
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Er dette en god<br />
          <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">utleieinvestering?</span>
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
          Lim inn en Finn.no-lenke og få øyeblikkelig analyse av yield, skatt, kontantstrøm og 10-år prognose.
        </p>

        {/* Tab toggle */}
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-5">
          {(['url', 'manual'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setResult(null); setError(''); }}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              {m === 'url' ? '🔗 Finn.no-lenke' : '✏️ Manuelt'}
            </button>
          ))}
        </div>

        {/* URL input */}
        {mode === 'url' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 flex flex-col sm:flex-row gap-3">
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                placeholder="https://www.finn.no/realestate/homes/ad.html?finnkode=..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
              />
              <button onClick={analyze} disabled={loading || !url.trim()}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 transition-all shadow-sm whitespace-nowrap">
                {loading ? 'Analyserer...' : 'Analyser gratis →'}
              </button>
            </div>
          </div>
        )}

        {/* Manual input */}
        {mode === 'manual' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {([
                { key: 'prisantydning', label: 'Prisantydning (kr) *', placeholder: '3 500 000' },
                { key: 'gjeld', label: 'Fellesgjeld (kr)', placeholder: '0' },
                { key: 'bra', label: 'Bruksareal (m²)', placeholder: '60' },
                { key: 'rooms', label: 'Antall rom', placeholder: '2' },
                { key: 'year', label: 'Byggeår', placeholder: '2010' },
                { key: 'fellesutg', label: 'Felleskost/mnd (kr)', placeholder: 'Estimeres' },
                { key: 'rent', label: 'Leieinntekt/mnd (kr)', placeholder: 'Estimeres fra hybel.no' },
              ] as { key: keyof ManualInput; label: string; placeholder: string }[]).map(f => (
                <div key={f.key} className={f.key === 'rent' ? 'col-span-2 sm:col-span-1' : ''}>
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">{f.label}</label>
                  <input type="text" value={manual[f.key]} onChange={e => setM(f.key)(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  />
                </div>
              ))}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">By</label>
                <select value={manual.city} onChange={e => setM('city')(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="oslo">Oslo</option>
                  <option value="bergen">Bergen</option>
                  <option value="stavanger">Stavanger</option>
                  <option value="trondheim">Trondheim</option>
                  <option value="annet">Annet</option>
                </select>
              </div>
            </div>
            <button onClick={analyzeManual}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm">
              Analyser gratis →
            </button>
          </div>
        )}

        {error && <div className="max-w-3xl mx-auto mt-3 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Henter og analyserer boligen...</p>
        </div>
      )}

      {/* Empty state feature cards */}
      {!result && !loading && (
        <div className="px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{f.icon}</div>
                <div className="font-bold text-gray-900 mb-2">{f.title}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && adj && (
        <div ref={resultRef} className="px-8 pb-24 max-w-7xl mx-auto">

          {/* Verdict banner */}
          <div className="rounded-3xl p-1 mb-6" style={{ background: `linear-gradient(135deg, ${result.labelColor}22, ${result.labelColor}08)`, border: `1.5px solid ${result.labelColor}30` }}>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-0.5">{result.address}</div>
                  <h2 className="font-bold text-gray-900 text-xl leading-snug">{result.title || 'Finn.no-annonse'}</h2>
                  <div className="text-sm text-gray-400 mt-1">{result.bra} m² · {result.rooms} rom · Bygget {result.year}{result.energy ? ` · Energi ${result.energy}` : ''}</div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <MiniStat label="Prisantydning" value={`${fmt(result.prisantydning)} kr`} />
                  {result.gjeld > 0 && <MiniStat label="Fellesgjeld" value={`${fmt(result.gjeld)} kr`} color="#f97316" />}
                  <MiniStat label="Totalpris" value={`${fmt(result.totalPrice)} kr`} />
                  <MiniStat label="Kr/kvm" value={`${fmt(result.pricePerSqm)} kr`} />
                </div>
                <div className="text-center px-6 border-l border-gray-100">
                  <div className="text-xs text-gray-400 mb-1">Etter skatt / mnd</div>
                  <div className="text-4xl font-extrabold" style={{ color: adj.afterTaxCF >= 0 ? '#16a34a' : '#ef4444' }}>
                    {adj.afterTaxCF >= 0 ? '+' : ''}{fmt(adj.afterTaxCF)} kr
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{fmt(adj.afterTaxCF * 12)} kr/år</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-col */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">

            {/* LEFT: gauge + breakdown + sliders */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-5">
                <Gauge score={result.score} label={result.label} color={result.labelColor} />
                <div className="w-full flex flex-col gap-3 pt-3 border-t border-gray-50">
                  {scoreBreakdown.map(b => <ScoreBar key={b.label} {...b} />)}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-5">Juster forutsetninger</div>
                <div className="flex flex-col gap-6">
                  <Slider label="Leieinntekt" value={rentAdj} min={60} max={140} step={1}
                    display={`${fmt(result.rent * rentAdj / 100)} kr (${rentAdj}%)`}
                    onChange={setRentAdj} />
                  <Slider label="Egenkapital" value={ekPct} min={10} max={40} step={1}
                    display={`${ekPct}% · ${fmt(result.totalPrice * ekPct / 100)} kr`}
                    onChange={setEkPct} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Forutsetninger</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Belåning', `${100 - ekPct}%`],
                    ['Rente', `${result.rate}% (Fana)`],
                    ['Løpetid', `${result.termYears} år`],
                    ['Lån', `${fmt(adj.loan)} kr`],
                    ['Terminbeløp', `${fmt(adj.monthlyPmt)} kr/mnd`],
                    ['Skatt', '22% av overskudd'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] text-gray-400 uppercase mb-0.5">{k}</div>
                      <div className="text-sm font-semibold text-gray-700">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: metrics + waterfall */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Estimert mnd. leie', value: `${fmt(adj.rent)} kr`, sub: `${fmt(adj.rent / result.bra)} kr/kvm`, color: '#2563eb' },
                  { title: 'Før skatt', value: `${adj.monthlyCF >= 0 ? '+' : ''}${fmt(adj.monthlyCF)} kr`, sub: `${fmt(adj.monthlyCF * 12)} kr/år`, color: adj.monthlyCF >= 0 ? '#16a34a' : '#ef4444' },
                  { title: 'Etter skatt', value: `${adj.afterTaxCF >= 0 ? '+' : ''}${fmt(adj.afterTaxCF)} kr`, sub: `Skatt: ${fmt(adj.monthlyTax)} kr/mnd`, color: adj.afterTaxCF >= 0 ? '#16a34a' : '#ef4444' },
                  { title: 'Brutto yield', value: `${adj.grossYield}%`, sub: 'Leieinntekt vs totalpris', color: adj.grossYield >= 6 ? '#16a34a' : adj.grossYield >= 4 ? '#f59e0b' : '#ef4444' },
                  { title: 'Avkastning EK (etter skatt)', value: fmtPct(adj.afterTaxRoeCash), sub: `EK inn: ${fmt(adj.equity)} kr`, color: adj.afterTaxRoeCash >= 6 ? '#16a34a' : adj.afterTaxRoeCash >= 3 ? '#f59e0b' : '#ef4444' },
                  { title: 'Nedbetalt på', value: adj.paybackYears < 99 ? `${adj.paybackYears} år` : '—', sub: 'Tid til EK er tilbakebetalt', color: '#ea580c' },
                ].map(c => (
                  <div key={c.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{c.title}</div>
                    <div className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-5">Månedlig kontantstrøm</div>
                <Waterfall items={adj.wf} />
              </div>
            </div>
          </div>

          {/* 10-year prognosis — full width */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-baseline justify-between mb-5">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">10-år prognose</div>
              <div className="text-xs text-gray-400">Antatt 3% boligprisvekst per år</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['År', 'Boligverdi', 'Gjenstående lån', 'Egenkapital', 'Kumulativ CF (etter skatt)'].map(h => (
                      <th key={h} className="text-left text-[10px] text-gray-400 uppercase tracking-wider pb-3 pr-4 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adj.prognosis.map((row, i) => {
                    const isGood = row.cumulativeCF > 0;
                    return (
                      <tr key={row.yr} className={`border-b border-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                        <td className="py-2.5 pr-4 font-bold text-gray-700">År {row.yr}</td>
                        <td className="py-2.5 pr-4 text-gray-800">{fmt(row.propValue)} kr</td>
                        <td className="py-2.5 pr-4 text-gray-500">{fmt(row.remLoan)} kr</td>
                        <td className="py-2.5 pr-4 font-semibold text-emerald-600">{fmt(row.equity)} kr</td>
                        <td className="py-2.5 pr-4 font-semibold" style={{ color: isGood ? '#16a34a' : '#ef4444' }}>
                          {row.cumulativeCF >= 0 ? '+' : ''}{fmt(row.cumulativeCF)} kr
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center text-gray-300 text-xs mt-8">
            Leiepriser fra hybel.no · Rente fra Finansportalen (Fana Sparebank 4,8%) · Ikke finansiell rådgivning
          </div>
        </div>
      )}
    </div>
  );
}
