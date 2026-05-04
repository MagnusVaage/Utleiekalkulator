'use client';

import { useState, useRef, useMemo } from 'react';

interface Result {
  totalPrice: number; prisantydning: number; gjeld: number;
  bra: number; rooms: number; year: number;
  rent: number; fellesutg: number;
  loan: number; pmt: number;
  address: string; title: string;
  pricePerSqm: number; rate: number; termYears: number;
}

interface ManualInput {
  prisantydning: string; gjeld: string; bra: string; rooms: string;
  year: string; fellesutg: string; rent: string; city: string;
}

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));

function calcPmt(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

const CITIES: Record<string, number> = {
  oslo: 1.0, bergen: 0.82, stavanger: 0.80, trondheim: 0.73, annet: 0.65,
};

function computeManual(m: ManualInput): Result | null {
  const price = parseInt(m.prisantydning.replace(/\D/g, '')) || 0;
  if (!price) return null;
  const gjeld = parseInt(m.gjeld.replace(/\D/g, '')) || 0;
  const total = price + gjeld;
  const bra = parseInt(m.bra) || 50;
  const rooms = parseInt(m.rooms) || 2;
  const year = parseInt(m.year) || 2000;
  const cityMult = CITIES[m.city] ?? 0.65;
  const osloBase = rooms <= 1 ? { base: 14444, typBra: 35 } : rooms === 2 ? { base: 18703, typBra: 55 } : { base: 23260, typBra: 75 };
  const estimatedRent = Math.round(osloBase.base * cityMult * (bra / osloBase.typBra) * (year >= 2020 ? 1.06 : year >= 2010 ? 1.03 : 1.0));
  const rent = parseInt(m.rent.replace(/\D/g, '')) || estimatedRent;
  const fellesutg = parseInt(m.fellesutg.replace(/\D/g, '')) || Math.round(bra * 38);
  const rate = 4.8; const termYears = 30;
  const loan = total * 0.85;
  const pmt = calcPmt(loan, rate, termYears);
  return { totalPrice: total, prisantydning: price, gjeld, bra, rooms, year, rent, fellesutg, loan: Math.round(loan), pmt, address: m.city, title: '', pricePerSqm: Math.round(total / bra), rate, termYears };
}

function MoneyBar({ income, costs }: { income: number; costs: number }) {
  const max = Math.max(income, costs);
  const incPct = (income / max) * 100;
  const costPct = (costs / max) * 100;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-24 shrink-0 text-right">Leieinntekt</span>
        <div className="flex-1 h-10 bg-gray-100 rounded-xl overflow-hidden">
          <div className="h-full bg-blue-400 rounded-xl flex items-center px-3 transition-all duration-500" style={{ width: `${incPct}%` }}>
            <span className="text-white text-sm font-bold whitespace-nowrap">{fmt(income)} kr</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-24 shrink-0 text-right">Alle kostnader</span>
        <div className="flex-1 h-10 bg-gray-100 rounded-xl overflow-hidden">
          <div className="h-full bg-red-400 rounded-xl flex items-center px-3 transition-all duration-500" style={{ width: `${costPct}%` }}>
            <span className="text-white text-sm font-bold whitespace-nowrap">{fmt(costs)} kr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [fetchMsg, setFetchMsg] = useState('');
  const [rentAdj, setRentAdj] = useState(100);
  const [ekPct, setEkPct] = useState(15);
  const resultRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState<ManualInput>({
    prisantydning: '', gjeld: '', bra: '', rooms: '2',
    year: '', fellesutg: '', rent: '', city: 'oslo',
  });
  const setM = (k: keyof ManualInput) => (v: string) => setManual(p => ({ ...p, [k]: v }));

  const fetchFromFinn = async () => {
    if (!url.trim()) return;
    setFetching(true); setFetchMsg(''); setError('');
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      const addr = (data.address || '').toLowerCase();
      setManual({
        prisantydning: String(data.prisantydning || ''),
        gjeld: String(data.gjeld || ''),
        bra: String(data.bra || ''),
        rooms: String(data.rooms || '2'),
        year: String(data.year || ''),
        fellesutg: String(data.fellesutg || ''),
        rent: String(data.rent || ''),
        city: addr.includes('oslo') ? 'oslo' : addr.includes('bergen') ? 'bergen' : addr.includes('stavanger') ? 'stavanger' : addr.includes('trondheim') ? 'trondheim' : 'annet',
      });
      setFetchMsg('✓ Hentet! Sjekk tallene og trykk Beregn.');
    } catch { setError('Kunne ikke hente. Prøv igjen.'); }
    finally { setFetching(false); }
  };

  const compute = () => {
    setError(''); setResult(null); setRentAdj(100); setEkPct(15);
    const r = computeManual(manual);
    if (!r) { setError('Fyll inn prisantydning for å beregne.'); return; }
    setResult(r);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const adj = useMemo(() => {
    if (!result) return null;
    const rent = Math.round(result.rent * rentAdj / 100);
    const equity = result.totalPrice * ekPct / 100;
    const loan = result.totalPrice - equity;
    const monthlyPmt = calcPmt(loan, result.rate, result.termYears);
    const monthlyInterest = Math.round(loan * result.rate / 100 / 12);
    const monthlyPrincipal = monthlyPmt - monthlyInterest;
    const maintenance = Math.round(rent * 0.03);
    const totalCosts = result.fellesutg + maintenance + monthlyPmt;
    const preTaxCF = rent - totalCosts;
    const annualInterest = loan * result.rate / 100;
    const taxable = Math.max(0, (rent - result.fellesutg - maintenance) * 12 - annualInterest);
    const monthlyTax = Math.round(taxable * 0.22 / 12);
    const afterTaxCF = preTaxCF - monthlyTax;
    const coveragePct = Math.round((rent / (totalCosts + monthlyTax)) * 100);
    const grossYield = Math.round((rent * 12) / result.totalPrice * 1000) / 10;
    return { rent, equity, loan, monthlyPmt, monthlyInterest, monthlyPrincipal, totalCosts, preTaxCF, monthlyTax, afterTaxCF, coveragePct, grossYield, maintenance };
  }, [result, rentAdj, ekPct]);

  const isPositive = adj ? adj.afterTaxCF >= 0 : false;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="blob blob-3" /><div className="blob blob-4" />
        <div className="absolute inset-0 bg-white/65" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">UK</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Utleiekalkulator</span>
          </div>
          <span className="hidden md:block text-xs text-gray-400">Gratis · Ingen registrering</span>
        </div>
      </header>

      {/* Hero */}
      <div className="px-6 pt-14 pb-6 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
          Vil denne boligen<br />
          <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">lønne seg å leie ut?</span>
        </h1>
        <p className="text-gray-400">Fyll inn tallene — vi regner ut hva du sitter igjen med.</p>
      </div>

      {/* Input card */}
      <div className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="mb-5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-2">Hent automatisk fra Finn.no</label>
            <div className="flex gap-2">
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchFromFinn()}
                placeholder="Lim inn Finn.no-lenke her..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
              />
              <button onClick={fetchFromFinn} disabled={fetching || !url.trim()}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-all whitespace-nowrap">
                {fetching ? '...' : 'Hent'}
              </button>
            </div>
            {fetchMsg && <p className="mt-2 text-emerald-600 text-xs font-medium">{fetchMsg}</p>}
          </div>

          <div className="border-t border-gray-100 pt-5">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block mb-4">Eller fyll inn selv</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {([
                { key: 'prisantydning', label: 'Prisantydning *', placeholder: '3 500 000 kr' },
                { key: 'gjeld', label: 'Fellesgjeld', placeholder: '0 kr' },
                { key: 'bra', label: 'Størrelse', placeholder: '60 m²' },
                { key: 'rooms', label: 'Antall rom', placeholder: '2' },
                { key: 'year', label: 'Byggeår', placeholder: '2010' },
                { key: 'fellesutg', label: 'Felleskost/mnd', placeholder: 'Estimeres' },
                { key: 'rent', label: 'Leieinntekt/mnd', placeholder: 'Estimeres' },
              ] as { key: keyof ManualInput; label: string; placeholder: string }[]).map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 font-medium block mb-1">{f.label}</label>
                  <input type="text" value={manual[f.key]} onChange={e => setM(f.key)(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && compute()}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">By</label>
                <select value={manual.city} onChange={e => setM('city')(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                  <option value="oslo">Oslo</option>
                  <option value="bergen">Bergen</option>
                  <option value="stavanger">Stavanger</option>
                  <option value="trondheim">Trondheim</option>
                  <option value="annet">Annet sted</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button onClick={compute}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-base rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm">
              Beregn →
            </button>
          </div>
        </div>
      </div>

      {/* ── RESULTS ── */}
      {result && adj && (
        <div ref={resultRef} className="px-6 pb-24 max-w-2xl mx-auto flex flex-col gap-5">

          {/* 1. VERDICT — big, emotional, clear */}
          <div className="rounded-2xl p-8 text-center" style={{
            background: isPositive ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
            border: `2px solid ${isPositive ? '#86efac' : '#fca5a5'}`,
          }}>
            <div className="text-5xl mb-4">{isPositive ? '🎉' : '📉'}</div>
            <div className="text-lg text-gray-500 mb-2">
              {isPositive ? 'Du tjener' : 'Dette koster deg'}
            </div>
            <div className="text-6xl font-black mb-3" style={{ color: isPositive ? '#16a34a' : '#dc2626' }}>
              {isPositive ? '+' : ''}{fmt(adj.afterTaxCF)} kr
            </div>
            <div className="text-sm text-gray-400">per måned, etter skatt og alle kostnader</div>

            <div className="mt-5 pt-5 border-t text-sm" style={{ borderColor: isPositive ? '#86efac' : '#fca5a5' }}>
              {isPositive
                ? `Leien dekker ${adj.coveragePct}% av kostnadene — dette er en god start 👍`
                : `Leien dekker bare ${adj.coveragePct}% av kostnadene — du må betale resten selv`
              }
            </div>
          </div>

          {/* 2. VISUAL — income vs costs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-5">Hva skjer med de {fmt(adj.rent)} kr i månedlig leie?</h3>
            <MoneyBar income={adj.rent} costs={adj.totalCosts + adj.monthlyTax} />
            <div className="mt-5 flex flex-col gap-2">
              {[
                { label: '💸 Renter', value: adj.monthlyInterest },
                { label: '🏦 Avdrag (nedbetaling)', value: adj.monthlyPrincipal },
                { label: '🏢 Felleskost', value: result.fellesutg },
                { label: '🔧 Vedlikehold (3%)', value: adj.maintenance },
                { label: '📋 Skatt (22%)', value: adj.monthlyTax },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-semibold text-gray-700">−{fmt(row.value)} kr</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 mt-1">
                <span className="font-bold text-gray-900">Du sitter igjen med</span>
                <span className="text-xl font-black" style={{ color: isPositive ? '#16a34a' : '#dc2626' }}>
                  {adj.afterTaxCF >= 0 ? '+' : ''}{fmt(adj.afterTaxCF)} kr
                </span>
              </div>
            </div>
          </div>

          {/* 3. WHAT IF — sliders, natural language */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-1">Hva om tallene er litt annerledes?</h3>
            <p className="text-sm text-gray-400 mb-6">Dra i sliderne og se hva som skjer</p>

            <div className="flex flex-col gap-6">
              {/* Rent slider */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm text-gray-600">Leieinntekt</span>
                  <span className="text-lg font-bold text-blue-600">{fmt(result.rent * rentAdj / 100)} kr/mnd</span>
                </div>
                <input type="range" min={70} max={130} step={1} value={rentAdj}
                  onChange={e => setRentAdj(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right,#3b82f6 ${((rentAdj - 70) / 60) * 100}%,#e5e7eb ${((rentAdj - 70) / 60) * 100}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>Lav</span><span>Høy</span>
                </div>
              </div>

              {/* EK slider */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm text-gray-600">Egenkapital du legger inn</span>
                  <span className="text-lg font-bold text-purple-600">{fmt(result.totalPrice * ekPct / 100)} kr ({ekPct}%)</span>
                </div>
                <input type="range" min={10} max={40} step={1} value={ekPct}
                  onChange={e => setEkPct(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right,#9333ea ${((ekPct - 10) / 30) * 100}%,#e5e7eb ${((ekPct - 10) / 30) * 100}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>Minimum (10%)</span><span>Mye (40%)</span>
                </div>
              </div>

              {/* Live result after sliders */}
              <div className="rounded-xl p-4 text-center" style={{
                background: isPositive ? '#f0fdf4' : '#fff1f2',
                border: `1.5px solid ${isPositive ? '#86efac' : '#fca5a5'}`,
              }}>
                <div className="text-xs text-gray-400 mb-1">Med disse tallene sitter du igjen med</div>
                <div className="text-3xl font-black" style={{ color: isPositive ? '#16a34a' : '#dc2626' }}>
                  {adj.afterTaxCF >= 0 ? '+' : ''}{fmt(adj.afterTaxCF)} kr/mnd
                </div>
              </div>
            </div>
          </div>

          {/* 4. KEY FACTS — 3 friendly sentences */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Kort oppsummert</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <span className="text-xl shrink-0">🏠</span>
                <p className="text-sm text-gray-600">Totalpris er <strong className="text-gray-900">{fmt(result.totalPrice)} kr</strong>. Du trenger <strong className="text-gray-900">{fmt(adj.equity)} kr</strong> på konto — banken låner deg resten.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl shrink-0">📅</span>
                <p className="text-sm text-gray-600">Lånet på <strong className="text-gray-900">{fmt(adj.loan)} kr</strong> koster deg <strong className="text-gray-900">{fmt(adj.monthlyPmt)} kr per måned</strong> i 30 år med 4,8% rente.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl shrink-0">📈</span>
                <p className="text-sm text-gray-600">Brutto avkastning er <strong className="text-gray-900">{adj.grossYield}%</strong> — {adj.grossYield >= 5 ? 'over' : 'under'} det som regnes som lønnsomt i Norge ({adj.grossYield >= 5 ? '✅' : 'typisk trenger du 5%+ ⚠️'}).</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-300 text-xs">
            Leiepriser fra hybel.no · Rente fra Finansportalen (Fana Sparebank) · Ikke finansiell rådgivning
          </p>
        </div>
      )}
    </div>
  );
}
