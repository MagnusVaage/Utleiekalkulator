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
  const price = parseInt(m.prisantydning.replace(/\s/g, '')) || 0;
  if (!price) return null;
  const gjeld = parseInt(m.gjeld.replace(/\s/g, '')) || 0;
  const total = price + gjeld;
  const bra = parseInt(m.bra) || 50;
  const rooms = parseInt(m.rooms) || 2;
  const year = parseInt(m.year) || 2000;
  const cityMult = CITIES[m.city] ?? 0.65;
  const osloBase = rooms <= 1 ? { base: 14444, typBra: 35 } : rooms === 2 ? { base: 18703, typBra: 55 } : { base: 23260, typBra: 75 };
  const estimatedRent = Math.round(osloBase.base * cityMult * (bra / osloBase.typBra) * (year >= 2020 ? 1.06 : year >= 2010 ? 1.03 : 1.0));
  const rent = parseInt(m.rent.replace(/\s/g, '')) || estimatedRent;
  const fellesutgRaw = parseInt(m.fellesutg.replace(/\s/g, '')) || 0;
  const fellesutg = fellesutgRaw || Math.round(bra * 38);
  const rate = 4.8; const termYears = 30;
  const loan = total * 0.85;
  const pmt = calcPmt(loan, rate, termYears);
  return { totalPrice: total, prisantydning: price, gjeld, bra, rooms, year, rent, fellesutg, loan: Math.round(loan), pmt, address: m.city, title: '', pricePerSqm: Math.round(total / bra), rate, termYears };
}

function Verdict({ cf, score }: { cf: number; score: number }) {
  if (cf >= 2000) return <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-full px-5 py-2 text-sm font-bold">✅ Lønnsom investering</div>;
  if (cf >= 0) return <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-5 py-2 text-sm font-bold">⚠️ Nøytral — nesten i null</div>;
  if (cf >= -3000) return <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-5 py-2 text-sm font-bold">📉 Taper litt penger</div>;
  return <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-full px-5 py-2 text-sm font-bold">🚫 Ulønnsom — stor kostnad</div>;
  score;
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
    const vacancy = Math.round(rent * 0.04);
    const maintenance = Math.round(rent * 0.03);
    const preTaxCF = Math.round(rent - result.fellesutg - vacancy - maintenance - monthlyPmt);
    const annualInterest = loan * result.rate / 100;
    const taxable = Math.max(0, (rent - result.fellesutg - maintenance - vacancy) * 12 - annualInterest);
    const monthlyTax = Math.round(taxable * 0.22 / 12);
    const afterTaxCF = preTaxCF - monthlyTax;
    const grossYield = (rent * 12) / result.totalPrice * 100;
    return { rent, equity, loan, monthlyPmt, preTaxCF, monthlyTax, afterTaxCF, grossYield: Math.round(grossYield * 10) / 10 };
  }, [result, rentAdj, ekPct]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="blob blob-3" /><div className="blob blob-4" />
        <div className="absolute inset-0 bg-white/65" />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">UK</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Utleiekalkulator</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Gratis · Ingen registrering
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="px-6 pt-14 pb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
          Vil denne boligen<br />
          <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">lønne seg å leie ut?</span>
        </h1>
        <p className="text-gray-400 text-base">Fyll inn tallene — vi regner ut hva du sitter igjen med.</p>
      </div>

      {/* Input card */}
      <div className="px-6 pb-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

          {/* Finn.no auto-fill */}
          <div className="mb-6">
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

            <div className="grid grid-cols-2 gap-3 mb-3">
              {([
                { key: 'prisantydning', label: 'Prisantydning', placeholder: '3 500 000 kr', required: true },
                { key: 'gjeld', label: 'Fellesgjeld', placeholder: '0 kr' },
                { key: 'bra', label: 'Størrelse', placeholder: '60 m²' },
                { key: 'rooms', label: 'Antall rom', placeholder: '2' },
                { key: 'year', label: 'Byggeår', placeholder: '2010' },
                { key: 'fellesutg', label: 'Felleskost/mnd', placeholder: 'Estimeres automatisk' },
                { key: 'rent', label: 'Leieinntekt/mnd', placeholder: 'Estimeres automatisk' },
              ] as { key: keyof ManualInput; label: string; placeholder: string; required?: boolean }[]).map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 font-medium block mb-1">
                    {f.label}{f.required ? ' *' : ''}
                  </label>
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

      {/* Results */}
      {result && adj && (
        <div ref={resultRef} className="px-6 pb-24 max-w-2xl mx-auto flex flex-col gap-5">

          {/* THE main number */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <Verdict cf={adj.afterTaxCF} score={0} />
            <div className="mt-5 mb-1">
              <div className="text-sm text-gray-400 mb-2">Du sitter igjen med hver måned (etter skatt)</div>
              <div className="text-6xl font-extrabold" style={{ color: adj.afterTaxCF >= 0 ? '#16a34a' : '#ef4444' }}>
                {adj.afterTaxCF >= 0 ? '+' : ''}{fmt(adj.afterTaxCF)} kr
              </div>
              <div className="text-sm text-gray-400 mt-2">{fmt(adj.afterTaxCF * 12)} kr per år</div>
            </div>
          </div>

          {/* 4 simple stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Estimert leieinntekt', value: `${fmt(adj.rent)} kr/mnd`, color: '#2563eb', desc: `${fmt(adj.rent / result.bra)} kr per kvm` },
              { label: 'Lånekostnad', value: `${fmt(adj.monthlyPmt)} kr/mnd`, color: '#f97316', desc: `${fmt(adj.loan)} kr i lån` },
              { label: 'Felleskost + avgifter', value: `${fmt(result.fellesutg)} kr/mnd`, color: '#f97316', desc: 'Løpende kostnader' },
              { label: 'Brutto avkastning', value: `${adj.grossYield}%`, color: adj.grossYield >= 5 ? '#16a34a' : adj.grossYield >= 3.5 ? '#f59e0b' : '#ef4444', desc: 'Leie vs kjøpspris' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Simple monthly breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-700 mb-4">Hva skjer med leieinntekten?</div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Leieinntekt', value: adj.rent, pos: true },
                { label: 'Lånekostnad', value: -adj.monthlyPmt, pos: false },
                { label: 'Felleskost', value: -result.fellesutg, pos: false },
                { label: 'Ledighet (4%)', value: -Math.round(adj.rent * 0.04), pos: false },
                { label: 'Vedlikehold (3%)', value: -Math.round(adj.rent * 0.03), pos: false },
                { label: 'Skatt (22%)', value: -adj.monthlyTax, pos: false },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className="text-sm font-semibold" style={{ color: row.pos ? '#2563eb' : '#6b7280' }}>
                    {row.pos ? '+' : '−'}{fmt(Math.abs(row.value))} kr
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 mt-1">
                <span className="text-sm font-bold text-gray-900">Du sitter igjen med</span>
                <span className="text-lg font-extrabold" style={{ color: adj.afterTaxCF >= 0 ? '#16a34a' : '#ef4444' }}>
                  {adj.afterTaxCF >= 0 ? '+' : ''}{fmt(adj.afterTaxCF)} kr
                </span>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-sm font-semibold text-gray-700 mb-5">Hva om tallene er litt annerledes?</div>
            <div className="flex flex-col gap-6">
              {[
                {
                  label: 'Leieinntekt', value: rentAdj, min: 70, max: 130, step: 1,
                  display: `${fmt(result.rent * rentAdj / 100)} kr/mnd`,
                  onChange: setRentAdj,
                },
                {
                  label: 'Egenkapital', value: ekPct, min: 10, max: 40, step: 1,
                  display: `${ekPct}% = ${fmt(result.totalPrice * ekPct / 100)} kr`,
                  onChange: setEkPct,
                },
              ].map(s => {
                const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
                return (
                  <div key={s.label} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-sm font-bold text-gray-800">{s.display}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                      onChange={e => s.onChange(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right,#16a34a ${pct}%,#e5e7eb ${pct}%)` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Property details (collapsed) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Forutsetninger</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Totalpris', `${fmt(result.totalPrice)} kr`],
                ['Egenkapital', `${fmt(adj.equity)} kr (${ekPct}%)`],
                ['Lån', `${fmt(adj.loan)} kr`],
                ['Rente', `${result.rate}% (Fana Sparebank)`],
                ['Løpetid', `${result.termYears} år`],
                ['Terminbeløp', `${fmt(adj.monthlyPmt)} kr/mnd`],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-gray-400 text-xs">{k}</div>
                  <div className="font-semibold text-gray-700">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-gray-300 text-xs">
            Leiepriser fra hybel.no · Rente fra Finansportalen · Ikke finansiell rådgivning
          </p>
        </div>
      )}
    </div>
  );
}
