'use client';

import { useState, useMemo } from 'react';

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

function Toggle({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50 gap-1">
      {options.map(opt => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
            value === opt.value ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function TInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent" />
  );
}

function Metric({ label, value, sub, green }: { label: string; value: string; sub?: string; green?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-xl font-bold ${green ? 'text-emerald-600' : 'text-gray-900'}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState('');
  const [fetchErr, setFetchErr] = useState('');

  const [form, setForm] = useState({
    prisantydning: '', gjeld: '', bra: '', rooms: '2', year: '',
    city: 'oslo', rent: '', fellesutg: '',
    rate: '4.8', termYears: '30', ekPct: '15',
  });
  const setF = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }));

  const fetchFromFinn = async () => {
    if (!url.trim()) return;
    setFetching(true); setFetchMsg(''); setFetchErr('');
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.error) { setFetchErr(data.error); return; }
      const addr = (data.address || '').toLowerCase();
      setForm(p => ({
        ...p,
        prisantydning: String(data.prisantydning || ''),
        gjeld: String(data.gjeld || ''),
        bra: String(data.bra || ''),
        rooms: String(data.rooms || '2'),
        year: String(data.year || ''),
        fellesutg: String(data.fellesutg || ''),
        rent: String(data.rent || ''),
        city: addr.includes('oslo') ? 'oslo' : addr.includes('bergen') ? 'bergen'
          : addr.includes('stavanger') ? 'stavanger' : addr.includes('trondheim') ? 'trondheim' : 'annet',
      }));
      setFetchMsg('✓ Hentet fra Finn.no');
    } catch { setFetchErr('Kunne ikke hente. Prøv igjen.'); }
    finally { setFetching(false); }
  };

  const calc = useMemo(() => {
    const price = parseInt(form.prisantydning.replace(/\D/g, '')) || 0;
    if (!price) return null;
    const gjeld = parseInt(form.gjeld.replace(/\D/g, '')) || 0;
    const total = price + gjeld;
    const bra = parseInt(form.bra) || 50;
    const rooms = parseInt(form.rooms) || 2;
    const year = parseInt(form.year) || 2000;
    const rate = parseFloat(form.rate) || 4.8;
    const termYears = parseInt(form.termYears) || 30;
    const ekPct = parseInt(form.ekPct) || 15;
    const cityMult = CITIES[form.city] ?? 0.65;
    const osloBase = rooms <= 1 ? { base: 14444, typBra: 35 }
      : rooms === 2 ? { base: 18703, typBra: 55 }
      : { base: 23260, typBra: 75 };
    const estimatedRent = Math.round(
      osloBase.base * cityMult * (bra / osloBase.typBra) *
      (year >= 2020 ? 1.06 : year >= 2010 ? 1.03 : 1.0)
    );
    const rent = parseInt(form.rent.replace(/\D/g, '')) || estimatedRent;
    const fellesutg = parseInt(form.fellesutg.replace(/\D/g, '')) || Math.round(bra * 38);
    const equity = Math.round(total * ekPct / 100);
    const loan = total - equity;
    const pmt = calcPmt(loan, rate, termYears);
    const monthlyInterest = Math.round(loan * rate / 100 / 12);
    const monthlyPrincipal = pmt - monthlyInterest;
    const totalCosts = fellesutg + pmt;
    const preTaxCF = rent - totalCosts;
    const taxable = Math.max(0, rent - fellesutg - monthlyInterest);
    const monthlyTax = Math.round(taxable * 0.22);
    const afterTaxCF = preTaxCF - monthlyTax;
    const rentefradragAnnual = Math.round(monthlyInterest * 12 * 0.22);
    const grossYield = Math.round((rent * 12) / total * 1000) / 10;
    const netYield = Math.round(((rent - fellesutg) * 12 * 0.78) / total * 1000) / 10;
    const pricePerSqm = bra > 0 ? Math.round(total / bra) : 0;
    const coveragePct = (totalCosts + monthlyTax) > 0
      ? Math.round((rent / (totalCosts + monthlyTax)) * 100) : 0;
    return {
      total, bra, rent, fellesutg, loan, equity, ekPct, pmt,
      monthlyInterest, monthlyPrincipal, totalCosts, preTaxCF,
      monthlyTax, afterTaxCF, rentefradragAnnual,
      grossYield, netYield, pricePerSqm, coveragePct,
      estimatedRent, rate, termYears,
    };
  }, [form]);

  const isPos = calc ? calc.afterTaxCF >= 0 : false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="blob blob-3" /><div className="blob blob-4" />
        <div className="absolute inset-0 bg-white/75" />
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">UK</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Utleiekalkulator</span>
          </div>
          <span className="hidden md:block text-xs text-gray-400">Gratis · Ingen registrering</span>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT: INPUTS ── */}
          <div className="flex flex-col gap-5">

            {/* Finn.no */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Hent eiendom fra Finn.no</h2>
              <div className="flex gap-2">
                <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchFromFinn()}
                  placeholder="Lim inn Finn.no-lenke her..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent" />
                <button onClick={fetchFromFinn} disabled={fetching || !url.trim()}
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-all whitespace-nowrap">
                  {fetching ? '...' : 'Hent'}
                </button>
              </div>
              {fetchMsg && <p className="mt-2 text-emerald-600 text-xs font-medium">{fetchMsg}</p>}
              {fetchErr && <p className="mt-2 text-red-500 text-xs">{fetchErr}</p>}
            </div>

            {/* Eiendomsdetaljer */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-5">Eiendomsdetaljer</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prisantydning *">
                  <TInput value={form.prisantydning} onChange={setF('prisantydning')} placeholder="3 500 000 kr" />
                </Field>
                <Field label="Fellesgjeld">
                  <TInput value={form.gjeld} onChange={setF('gjeld')} placeholder="0 kr" />
                </Field>
                <Field label="Størrelse (m²)">
                  <TInput value={form.bra} onChange={setF('bra')} placeholder="60" />
                </Field>
                <Field label="Byggeår">
                  <TInput value={form.year} onChange={setF('year')} placeholder="2010" />
                </Field>
                <div className="col-span-2">
                  <Field label="Antall rom">
                    <Toggle
                      options={[{ label: '1 rom', value: '1' }, { label: '2 rom', value: '2' }, { label: '3 rom', value: '3' }, { label: '4+ rom', value: '4' }]}
                      value={form.rooms} onChange={setF('rooms')} />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="By">
                    <select value={form.city} onChange={e => setF('city')(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                      <option value="oslo">Oslo</option>
                      <option value="bergen">Bergen</option>
                      <option value="stavanger">Stavanger</option>
                      <option value="trondheim">Trondheim</option>
                      <option value="annet">Annet sted</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {/* Inntekt og kostnader */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-5">Inntekt og kostnader</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Leieinntekt pr mnd">
                    <TInput value={form.rent} onChange={setF('rent')}
                      placeholder={calc ? `Estimert: ${fmt(calc.estimatedRent)} kr` : 'Estimeres automatisk'} />
                    {calc && !form.rent && (
                      <p className="text-xs text-gray-400 mt-1">Estimat basert på hybel.no 2026</p>
                    )}
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Felleskostnader pr mnd">
                    <TInput value={form.fellesutg} onChange={setF('fellesutg')}
                      placeholder={calc ? `Estimert: ${fmt(calc.fellesutg)} kr` : 'Estimeres automatisk'} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Finansiering */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-5">Finansiering</h2>
              <div className="flex flex-col gap-6">

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Effektiv rente</span>
                    <span className="text-lg font-bold text-emerald-600">{form.rate}%</span>
                  </div>
                  <input type="range" min={2} max={10} step={0.1} value={form.rate}
                    onChange={e => setF('rate')(e.target.value)}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right,#10b981 ${((parseFloat(form.rate) - 2) / 8) * 100}%,#e5e7eb ${((parseFloat(form.rate) - 2) / 8) * 100}%)` }} />
                  <div className="flex justify-between text-xs text-gray-300 mt-1"><span>2%</span><span>10%</span></div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Egenkapital</span>
                    <span className="text-lg font-bold text-purple-600">
                      {calc ? fmt(calc.equity) : '—'} kr ({form.ekPct}%)
                    </span>
                  </div>
                  <input type="range" min={10} max={50} step={1} value={form.ekPct}
                    onChange={e => setF('ekPct')(e.target.value)}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right,#9333ea ${((parseInt(form.ekPct) - 10) / 40) * 100}%,#e5e7eb ${((parseInt(form.ekPct) - 10) / 40) * 100}%)` }} />
                  <div className="flex justify-between text-xs text-gray-300 mt-1"><span>10%</span><span>50%</span></div>
                </div>

                <Field label="Nedbetalingstid">
                  <Toggle
                    options={[{ label: '20 år', value: '20' }, { label: '25 år', value: '25' }, { label: '30 år', value: '30' }]}
                    value={form.termYears} onChange={setF('termYears')} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── RIGHT: RESULTS (sticky) ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            {!calc ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="text-5xl mb-4">🏠</div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Fyll inn prisantydning<br />for å se analysen
                </p>
              </div>
            ) : (
              <>
                {/* Verdict */}
                <div className="rounded-2xl p-6 text-center" style={{
                  background: isPos ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
                  border: `2px solid ${isPos ? '#86efac' : '#fca5a5'}`,
                }}>
                  <div className="text-sm text-gray-500 mb-1">
                    {isPos ? 'Du tjener' : 'Dette koster deg'}
                  </div>
                  <div className="text-5xl font-black mb-1" style={{ color: isPos ? '#16a34a' : '#dc2626' }}>
                    {isPos ? '+' : ''}{fmt(calc.afterTaxCF)} kr
                  </div>
                  <div className="text-xs text-gray-400">per måned, etter skatt</div>
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500" style={{ borderColor: isPos ? '#86efac' : '#fca5a5' }}>
                    Leien dekker {calc.coveragePct}% av kostnadene {isPos ? '👍' : ''}
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Brutto yield" value={`${calc.grossYield}%`}
                    sub={calc.grossYield >= 5 ? '✅ Over 5% grense' : '⚠️ Under 5%'}
                    green={calc.grossYield >= 5} />
                  <Metric label="Netto yield" value={`${calc.netYield}%`} sub="Etter skatt og kostn." />
                  <Metric label="Egenkapital" value={`${fmt(calc.equity)} kr`} sub={`${calc.ekPct}% av totalpris`} />
                  <Metric label="Pris per m²" value={`${fmt(calc.pricePerSqm)} kr`} sub={`${calc.bra} m²`} />
                </div>

                {/* Monthly breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Månedlig</h3>
                  <div className="flex flex-col">
                    <div className="flex justify-between py-2.5 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Leieinntekt</span>
                      <span className="text-sm font-semibold text-emerald-600">+{fmt(calc.rent)} kr</span>
                    </div>
                    {[
                      { label: '💸 Renter', value: calc.monthlyInterest },
                      { label: '🏦 Avdrag', value: calc.monthlyPrincipal },
                      { label: '🏢 Felleskost', value: calc.fellesutg },
                      { label: '📋 Skatt (22%)', value: calc.monthlyTax },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-100">
                        <span className="text-sm text-gray-500">{row.label}</span>
                        <span className="text-sm font-semibold text-gray-700">−{fmt(row.value)} kr</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 pb-1">
                      <span className="text-sm font-bold text-gray-900">Netto kontantstrøm</span>
                      <span className="text-sm font-black" style={{ color: isPos ? '#16a34a' : '#dc2626' }}>
                        {calc.afterTaxCF >= 0 ? '+' : ''}{fmt(calc.afterTaxCF)} kr
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-dashed border-emerald-200 flex justify-between items-center">
                    <span className="text-xs text-emerald-600 font-medium">🇳🇴 Rentefradrag</span>
                    <span className="text-xs font-bold text-emerald-600">+{fmt(calc.rentefradragAnnual)} kr/år</span>
                  </div>
                </div>

                {/* Loan summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm">Lån</h3>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Lånebeløp', value: `${fmt(calc.loan)} kr` },
                      { label: 'Månedlig betaling', value: `${fmt(calc.pmt)} kr` },
                      { label: 'Herav renter', value: `${fmt(calc.monthlyInterest)} kr` },
                      { label: 'Herav avdrag', value: `${fmt(calc.monthlyPrincipal)} kr` },
                      { label: 'Rente', value: `${calc.rate}%` },
                      { label: 'Løpetid', value: `${calc.termYears} år` },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-gray-400">{row.label}</span>
                        <span className="font-medium text-gray-700">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto" aria-label="Ofte stilte spørsmål">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Vanlige spørsmål om utleiebolig</h2>
        <div className="flex flex-col gap-4">
          {[
            { q: 'Hva er brutto yield på utleiebolig?', a: 'Brutto yield er den årlige leieinntekten delt på kjøpesummen, oppgitt i prosent. En bolig til 3 millioner kroner med 15 000 kr i månedlig leie gir en brutto yield på 6 %. I Norge regnes 5 % eller mer som et godt utgangspunkt.' },
            { q: 'Hva er rentefradrag og hvor mye sparer jeg?', a: 'Når du leier ut bolig, kan du trekke fra renteutgiftene på skatten. Staten dekker 22 % av rentekostnadene dine. Har du 10 000 kr i månedlige renter, sparer du 26 400 kr i året — penger som kommer tilbake som skatteoppgjør.' },
            { q: 'Lønner det seg å leie ut bolig i Norge?', a: 'Det avhenger av kjøpspris, leieinntekt og finansiering. Utleie kan gi god avkastning i pressede boligmarkeder som Oslo, Bergen og Stavanger. Kalkulatoren viser kontantstrøm per måned etter skatt, slik at du ser om det faktisk lønner seg.' },
            { q: 'Hva er kontantstrøm på en utleiebolig?', a: 'Kontantstrøm er det du sitter igjen med hver måned etter at alle kostnader er betalt — lån, felleskostnader og skatt. Positiv kontantstrøm betyr at leien overstiger kostnadene. Negativ betyr at du må legge til penger selv.' },
            { q: 'Kan jeg bruke kalkulatoren på Finn.no-annonser?', a: 'Ja! Lim inn en Finn.no-lenke øverst, trykk «Hent», og alle tall hentes automatisk — pris, størrelse, fellesgjeld og felleskostnader. Du kan justere tallene manuelt etterpå.' },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/80 backdrop-blur px-6 py-8 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Utleiekalkulator · Leiepriser fra hybel.no · Rente fra Fana Sparebank · Ikke finansiell rådgivning
        </p>
      </footer>
    </div>
  );
}
