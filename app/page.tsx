'use client';

import { useState, useMemo } from 'react';

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));

function calcAnnuitet(principal: number, annualRate: number, years: number) {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

const CITIES: Record<string, number> = {
  oslo: 1.0, bergen: 0.82, stavanger: 0.80, trondheim: 0.73, annet: 0.65,
};

// ─── Small components ────────────────────────────────────────────────────────

function Toggle({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-xl p-1 gap-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {options.map(opt => (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
            value === opt.value ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
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
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls = [
  'w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
].join(' ');

const inputStyle = { background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' };

function TInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} className={inputCls} style={inputStyle} />
  );
}

function SliderRow({ label, value, onChange, min, max, step }: {
  label: string; value: string; onChange: (v: string) => void;
  min: number; max: number; step: number;
}) {
  const num = parseFloat(value) || 0;
  const pct = Math.min(100, Math.max(0, ((num - min) / (max - min)) * 100));
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        <span className="text-base font-bold text-blue-400">{value}%</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right,#3b82f6 ${pct}%,rgba(255,255,255,0.1) ${pct}%)` }} />
      <div className="flex justify-between text-xs text-slate-600 mt-1"><span>{min}%</span><span>{max}%</span></div>
    </div>
  );
}

function SRow({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className={`text-sm ${bold ? 'font-semibold text-white' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-sm font-bold ${color || 'text-white'}`}>{value}</span>
    </div>
  );
}

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 ${className || ''}`} style={cardStyle}>
      {children}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Home() {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState('');
  const [fetchErr, setFetchErr] = useState('');
  const [avdragsfrihet, setAvdragsfrihet] = useState(false);

  const [form, setForm] = useState({
    // Eiendom
    prisantydning: '', gjeld: '', bra: '', rooms: '2', city: 'oslo',
    // Klassifisering
    eierskap: 'privat', eierform: 'selveier',
    // Inntekt
    rent: '', ledighetsrate: '0',
    // Driftskostnader
    fellesutg: '', kommunale: '', eiendomsskatt: '',
    avfall: '', forsikring: '', wifi: '', strom: '', andreKostnader: '',
    vedlikehold: '0', forvaltning: '0',
    // Oppussing
    renovering: '', renoveringLaan: '0', verdtEtterRenovering: '',
    // Finansiering
    rate: '4.8', termYears: '30', ekPct: '15',
    laanetype: 'annuitet', refinansiering: '0',
    // Prognoser
    inflasjon: '2.5', eiendomsvekst: '3',
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
        // Use raw values: fellesutg is monthly, kommunale is annual
        fellesutg: String(data.fellesutgRaw || ''),
        kommunale: String(data.kommunaleRaw || ''),
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

    const gjeld    = parseInt(form.gjeld.replace(/\D/g, '')) || 0;
    const total    = price + gjeld;
    const bra      = parseInt(form.bra) || 50;
    const rooms    = parseInt(form.rooms) || 2;
    const rate     = parseFloat(form.rate) || 4.8;
    const termYears = parseInt(form.termYears) || 30;
    const ekPct    = parseInt(form.ekPct) || 15;
    const cityMult = CITIES[form.city] ?? 0.65;

    const osloBase = rooms <= 1 ? { base: 14444, typBra: 35 }
      : rooms === 2   ? { base: 18703, typBra: 55 }
                      : { base: 23260, typBra: 75 };
    const estimatedRent = Math.round(osloBase.base * cityMult * (bra / osloBase.typBra) * 1.03);
    const rentRaw = parseInt(form.rent.replace(/\D/g, '')) || estimatedRent;
    const ledighetsratePct = parseFloat(form.ledighetsrate) || 0;
    const effectiveRent = Math.round(rentRaw * (1 - ledighetsratePct / 100));

    const fellesutg         = parseInt(form.fellesutg.replace(/\D/g, '')) || Math.round(bra * 38);
    const kommunale_mnd     = Math.round((parseInt(form.kommunale.replace(/\D/g, '')) || 0) / 12);
    const eiendomsskatt_mnd = Math.round((parseInt(form.eiendomsskatt.replace(/\D/g, '')) || 0) / 12);
    const avfall            = parseInt(form.avfall.replace(/\D/g, '')) || 0;
    const forsikring        = parseInt(form.forsikring.replace(/\D/g, '')) || 0;
    const wifi              = parseInt(form.wifi.replace(/\D/g, '')) || 0;
    const strom             = parseInt(form.strom.replace(/\D/g, '')) || 0;
    const andreKostnader    = parseInt(form.andreKostnader.replace(/\D/g, '')) || 0;
    const vedlikehold_kr    = Math.round(effectiveRent * (parseFloat(form.vedlikehold) || 0) / 100);
    const forvaltning_kr    = Math.round(effectiveRent * (parseFloat(form.forvaltning) || 0) / 100);

    const operatingCosts = fellesutg + kommunale_mnd + eiendomsskatt_mnd
      + avfall + forsikring + wifi + strom + andreKostnader + vedlikehold_kr + forvaltning_kr;

    const renovering        = parseInt(form.renovering.replace(/\D/g, '')) || 0;
    const renoveringLaan_kr = Math.round(renovering * (parseFloat(form.renoveringLaan) || 0) / 100);
    const verdtEtterRen     = parseInt(form.verdtEtterRenovering.replace(/\D/g, '')) || 0;

    const equity = Math.round(total * ekPct / 100);
    const refinansiering_kr = verdtEtterRen > 0
      ? Math.round(verdtEtterRen * (parseFloat(form.refinansiering) || 0) / 100) : 0;
    const loan = Math.max(0, total - equity + renoveringLaan_kr - refinansiering_kr);

    const monthlyInterest = Math.round(loan * rate / 100 / 12);
    let pmt!: number, monthlyPrincipal!: number;
    if (avdragsfrihet) {
      pmt = monthlyInterest; monthlyPrincipal = 0;
    } else if (form.laanetype === 'serie') {
      monthlyPrincipal = Math.round(loan / (termYears * 12));
      pmt = monthlyPrincipal + monthlyInterest;
    } else {
      pmt = calcAnnuitet(loan, rate, termYears);
      monthlyPrincipal = Math.max(0, pmt - monthlyInterest);
    }

    const totalCosts    = operatingCosts + pmt;
    const preTaxCF      = effectiveRent - totalCosts;
    const deductible    = operatingCosts + monthlyInterest;
    const taxable       = Math.max(0, effectiveRent - deductible);
    const monthlyTax    = Math.round(taxable * 0.22);
    const rentefradragAnnual = Math.round(monthlyInterest * 12 * 0.22);
    const afterTaxCF    = preTaxCF - monthlyTax;
    const bruttoCF      = preTaxCF;

    const kontantbehov      = equity + renovering - renoveringLaan_kr;
    const marketValue       = verdtEtterRen > 0 ? verdtEtterRen : total;
    const gjeldsgrad        = total > 0 ? Math.round(loan / total * 1000) / 10 : 0;
    const netOperatingIncome = (effectiveRent - operatingCosts) * 12;
    const grossYield        = total > 0 ? Math.round((effectiveRent * 12) / total * 1000) / 10 : 0;
    const nettoYieldKost    = total > 0 ? Math.round(netOperatingIncome / total * 1000) / 10 : 0;
    const nettoYieldMarked  = marketValue > 0 ? Math.round(netOperatingIncome / marketValue * 1000) / 10 : 0;
    const arligNettofortjeneste = afterTaxCF * 12;
    const roi = kontantbehov > 0
      ? Math.round((arligNettofortjeneste + monthlyPrincipal * 12) / kontantbehov * 1000) / 10 : 0;
    const gjenvaerende = Math.round(kontantbehov - afterTaxCF * 12 * 10);

    return {
      total, bra, rooms, effectiveRent, fellesutg, operatingCosts,
      loan, equity, ekPct, pmt, monthlyInterest, monthlyPrincipal,
      totalCosts, preTaxCF, bruttoCF, monthlyTax, afterTaxCF, rentefradragAnnual,
      grossYield, nettoYieldKost, nettoYieldMarked, gjeldsgrad,
      arligNettofortjeneste, kontantbehov, roi, gjenvaerende,
      marketValue, rate, termYears, estimatedRent,
    };
  }, [form, avdragsfrihet]);

  const isPos = calc ? calc.afterTaxCF >= 0 : false;

  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>

      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-sm">UK</span>
            </div>
            <span className="font-bold text-white text-lg">Utleiekalkulator</span>
          </div>
          <span className="hidden md:block text-xs text-slate-500">Gratis · Ingen registrering</span>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-6 items-start">

          {/* ── LEFT: INPUTS ── */}
          <div className="flex flex-col gap-5">

            {/* Finn.no */}
            <Card>
              <h2 className="font-semibold text-white mb-4">Hent eiendom fra Finn.no</h2>
              <div className="flex gap-2">
                <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchFromFinn()}
                  placeholder="Lim inn Finn.no-lenke her..."
                  className={inputCls} style={inputStyle} />
                <button onClick={fetchFromFinn} disabled={fetching || !url.trim()}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 disabled:opacity-40 transition-all whitespace-nowrap">
                  {fetching ? '...' : 'Hent'}
                </button>
              </div>
              {fetchMsg && <p className="mt-2 text-emerald-400 text-xs font-medium">{fetchMsg}</p>}
              {fetchErr && <p className="mt-2 text-red-400 text-xs">{fetchErr}</p>}
            </Card>

            {/* Eierskap */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Eierskap og type</h2>
              <div className="flex flex-col gap-4">
                <Field label="Eierskap">
                  <Toggle options={[{ label: 'Privat', value: 'privat' }, { label: 'Selskap', value: 'selskap' }]}
                    value={form.eierskap} onChange={setF('eierskap')} />
                </Field>
                <Field label="Eierform">
                  <Toggle options={[{ label: 'Selveier', value: 'selveier' }, { label: 'Andel/aksje', value: 'andel' }]}
                    value={form.eierform} onChange={setF('eierform')} />
                </Field>
              </div>
            </Card>

            {/* Eiendomsdetaljer */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Eiendomsdetaljer</h2>
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
                <Field label="By">
                  <select value={form.city} onChange={e => setF('city')(e.target.value)}
                    className={inputCls} style={inputStyle}>
                    <option value="oslo">Oslo</option>
                    <option value="bergen">Bergen</option>
                    <option value="stavanger">Stavanger</option>
                    <option value="trondheim">Trondheim</option>
                    <option value="annet">Annet sted</option>
                  </select>
                </Field>
                <div className="col-span-2">
                  <Field label="Antall rom">
                    <Toggle
                      options={[{ label: '1 rom', value: '1' }, { label: '2 rom', value: '2' }, { label: '3 rom', value: '3' }, { label: '4+ rom', value: '4' }]}
                      value={form.rooms} onChange={setF('rooms')} />
                  </Field>
                </div>
              </div>
            </Card>

            {/* Leieinntekt */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Leieinntekt</h2>
              <div className="flex flex-col gap-5">
                <Field label="Leieinntekt pr mnd">
                  <TInput value={form.rent} onChange={setF('rent')}
                    placeholder={calc ? `Estimert: ${fmt(calc.estimatedRent)} kr` : 'Estimeres automatisk'} />
                  {calc && !form.rent && <p className="text-xs text-slate-500 mt-1">Estimat basert på hybel.no 2026</p>}
                </Field>
                <SliderRow label="Ledighetsrate" value={form.ledighetsrate} onChange={setF('ledighetsrate')}
                  min={0} max={20} step={0.5} />
              </div>
            </Card>

            {/* Driftskostnader */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Driftskostnader</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Felleskost pr mnd">
                  <TInput value={form.fellesutg} onChange={setF('fellesutg')}
                    placeholder={calc ? `Est. ${fmt(calc.fellesutg)} kr` : 'Estimeres'} />
                </Field>
                <Field label="Kommunale avg. pr år">
                  <TInput value={form.kommunale} onChange={setF('kommunale')} placeholder="0 kr" />
                </Field>
                <Field label="Eiendomsskatt pr år">
                  <TInput value={form.eiendomsskatt} onChange={setF('eiendomsskatt')} placeholder="0 kr" />
                </Field>
                <Field label="Avfallshåndtering pr mnd">
                  <TInput value={form.avfall} onChange={setF('avfall')} placeholder="0 kr" />
                </Field>
                <Field label="Forsikring pr mnd">
                  <TInput value={form.forsikring} onChange={setF('forsikring')} placeholder="0 kr" />
                </Field>
                <Field label="WiFi/TV pr mnd">
                  <TInput value={form.wifi} onChange={setF('wifi')} placeholder="0 kr" />
                </Field>
                <Field label="Strøm pr mnd">
                  <TInput value={form.strom} onChange={setF('strom')} placeholder="0 kr" />
                </Field>
                <Field label="Andre kostnader pr mnd">
                  <TInput value={form.andreKostnader} onChange={setF('andreKostnader')} placeholder="0 kr" />
                </Field>
                <div className="col-span-2">
                  <SliderRow label="Vedlikeholdskostnader" value={form.vedlikehold} onChange={setF('vedlikehold')}
                    min={0} max={10} step={0.5} />
                </div>
                <div className="col-span-2">
                  <SliderRow label="Forvaltningshonorar" value={form.forvaltning} onChange={setF('forvaltning')}
                    min={0} max={15} step={0.5} />
                </div>
              </div>
            </Card>

            {/* Oppussing */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Oppussing</h2>
              <div className="flex flex-col gap-5">
                <Field label="Renoveringskostnader">
                  <TInput value={form.renovering} onChange={setF('renovering')} placeholder="0 kr" />
                </Field>
                <SliderRow label="Lånefinansiering av renovering" value={form.renoveringLaan}
                  onChange={setF('renoveringLaan')} min={0} max={100} step={5} />
                <Field label="Verdi etter renovering">
                  <TInput value={form.verdtEtterRenovering} onChange={setF('verdtEtterRenovering')} placeholder="0 kr" />
                </Field>
              </div>
            </Card>

            {/* Finansiering */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Finansiering</h2>
              <div className="flex flex-col gap-5">
                <SliderRow label="Effektiv rente" value={form.rate} onChange={setF('rate')} min={2} max={10} step={0.1} />
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Egenkapital</span>
                    <span className="text-base font-bold text-purple-400">
                      {calc ? `${fmt(calc.equity)} kr` : '—'} ({form.ekPct}%)
                    </span>
                  </div>
                  <input type="range" min={10} max={50} step={1} value={form.ekPct}
                    onChange={e => setF('ekPct')(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right,#9333ea ${((parseInt(form.ekPct) - 10) / 40) * 100}%,rgba(255,255,255,0.1) ${((parseInt(form.ekPct) - 10) / 40) * 100}%)` }} />
                  <div className="flex justify-between text-xs text-slate-600 mt-1"><span>10%</span><span>50%</span></div>
                </div>
                <Field label="Nedbetalingstid">
                  <Toggle options={[{ label: '20 år', value: '20' }, { label: '25 år', value: '25' }, { label: '30 år', value: '30' }]}
                    value={form.termYears} onChange={setF('termYears')} />
                </Field>
                <Field label="Lånetype">
                  <Toggle options={[{ label: 'Annuitetslån', value: 'annuitet' }, { label: 'Serielån', value: 'serie' }]}
                    value={form.laanetype} onChange={setF('laanetype')} />
                </Field>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={avdragsfrihet} onChange={e => setAvdragsfrihet(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-500" />
                  <span className="text-sm text-slate-300">Avdragsfrihet</span>
                </label>
                <SliderRow label="Refinansiering av verdi" value={form.refinansiering}
                  onChange={setF('refinansiering')} min={0} max={85} step={5} />
              </div>
            </Card>

            {/* Fremtidsprognoser */}
            <Card>
              <h2 className="font-semibold text-white mb-5">Fremtidsprognoser</h2>
              <div className="flex flex-col gap-5">
                <SliderRow label="Økning i leie og kostnader (inflasjon)" value={form.inflasjon}
                  onChange={setF('inflasjon')} min={0} max={10} step={0.5} />
                <SliderRow label="Forventet vekst i eiendomsverdi" value={form.eiendomsvekst}
                  onChange={setF('eiendomsvekst')} min={0} max={10} step={0.5} />
              </div>
            </Card>
          </div>

          {/* ── RIGHT: RESULTS (sticky) ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            {!calc ? (
              <Card className="text-center py-12">
                <div className="text-5xl mb-4">🏠</div>
                <p className="text-slate-400 text-sm leading-relaxed">Fyll inn prisantydning<br />for å se analysen</p>
              </Card>
            ) : (
              <>
                {/* Verdict */}
                <div className="rounded-2xl p-6 text-center" style={{
                  background: isPos ? 'linear-gradient(135deg,#052e16,#14532d)' : 'linear-gradient(135deg,#3b0a0a,#7f1d1d)',
                  border: `1.5px solid ${isPos ? '#16a34a' : '#dc2626'}`,
                }}>
                  <div className="text-sm text-slate-300 mb-1">{isPos ? 'Du tjener' : 'Dette koster deg'}</div>
                  <div className="text-5xl font-black mb-1" style={{ color: isPos ? '#34d399' : '#f87171' }}>
                    {isPos ? '+' : ''}{fmt(calc.afterTaxCF)} kr
                  </div>
                  <div className="text-xs text-slate-400">per måned, etter skatt</div>
                </div>

                {/* Oppsummering */}
                <Card>
                  <h3 className="font-semibold text-white mb-1 text-sm">Oppsummering</h3>
                  <div>
                    <SRow label="Månedlig netto kontantstrøm" bold
                      value={`${isPos ? '+' : ''}${fmt(calc.afterTaxCF)} kr`}
                      color={isPos ? 'text-emerald-400' : 'text-red-400'} />
                    <SRow label="Årlig nettofortjeneste"
                      value={`${calc.arligNettofortjeneste >= 0 ? '+' : ''}${fmt(calc.arligNettofortjeneste)} kr`}
                      color={calc.arligNettofortjeneste >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <SRow label="Kontantbehov" value={`${fmt(calc.kontantbehov)} kr`} />
                    <SRow label="Eiendomsverdi" value={`${fmt(calc.total)} kr`} />
                    <SRow label="Egenkapital" value={`${fmt(calc.equity)} kr`} />
                    <SRow label="Gjeld" value={`${fmt(calc.loan)} kr`} />
                    <SRow label="Gjeldsgrad" value={`${calc.gjeldsgrad}%`} />
                    <SRow label="Gjenværende inv. kapital (10 år)" value={`${fmt(calc.gjenvaerende)} kr`} />
                    <SRow label="ROI" value={`${calc.roi}%`} color={calc.roi > 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <SRow label="Netto yield (kost)" value={`${calc.nettoYieldKost}%`} />
                    <SRow label="Netto yield (marked)" value={`${calc.nettoYieldMarked}%`} />
                  </div>
                </Card>

                {/* Månedlig */}
                <Card>
                  <h3 className="font-semibold text-white mb-1 text-sm">Månedlig</h3>
                  <div>
                    <SRow label="Leieinntekt pr mnd" value={`+${fmt(calc.effectiveRent)} kr`} color="text-emerald-400" />
                    <SRow label="Utgifter (sum)" value={`−${fmt(calc.totalCosts)} kr`} />
                    <SRow label="↳ Renter" value={`−${fmt(calc.monthlyInterest)} kr`} />
                    <SRow label="↳ Avdrag" value={`−${fmt(calc.monthlyPrincipal)} kr`} />
                    <SRow label="Brutto kontantstrøm"
                      value={`${calc.bruttoCF >= 0 ? '+' : ''}${fmt(calc.bruttoCF)} kr`}
                      color={calc.bruttoCF >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <SRow label="Skatt (22%)" value={`−${fmt(calc.monthlyTax)} kr`} />
                    <SRow label="🇳🇴 Rentefradrag" value={`+${fmt(calc.rentefradragAnnual)} kr/år`} color="text-emerald-400" />
                    <SRow label="Netto kontantstrøm" bold
                      value={`${isPos ? '+' : ''}${fmt(calc.afterTaxCF)} kr`}
                      color={isPos ? 'text-emerald-400' : 'text-red-400'} />
                  </div>
                </Card>

                {/* Lån */}
                <Card>
                  <h3 className="font-semibold text-white mb-3 text-sm">Lån</h3>
                  <div className="flex flex-col gap-2.5">
                    {([
                      { label: 'Lånetype', value: avdragsfrihet ? 'Avdragsfrihet' : form.laanetype === 'serie' ? 'Serielån' : 'Annuitetslån' },
                      { label: 'Eiendomsverdi', value: `${fmt(calc.total)} kr` },
                      { label: 'Gjeldsgrad', value: `${calc.gjeldsgrad}%` },
                      { label: 'Egenkapital', value: `${fmt(calc.equity)} kr` },
                      { label: 'Lån', value: `${fmt(calc.loan)} kr` },
                      { label: 'Effektiv rente', value: `${calc.rate}%` },
                      { label: 'Nedbetalingstid lån', value: `${calc.termYears} år` },
                      { label: 'Månedlig betaling', value: `${fmt(calc.pmt)} kr` },
                      { label: 'Herav renter', value: `${fmt(calc.monthlyInterest)} kr` },
                      { label: 'Herav avdrag', value: `${fmt(calc.monthlyPrincipal)} kr` },
                    ] as { label: string; value: string }[]).map(row => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-slate-400">{row.label}</span>
                        <span className="font-medium text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Vanlige spørsmål om utleiebolig</h2>
        <div className="flex flex-col gap-4">
          {[
            { q: 'Hva er brutto yield på utleiebolig?', a: 'Brutto yield er den årlige leieinntekten delt på kjøpesummen, oppgitt i prosent. En bolig til 3 millioner kroner med 15 000 kr i månedlig leie gir en brutto yield på 6 %. I Norge regnes 5 % eller mer som et godt utgangspunkt.' },
            { q: 'Hva er rentefradrag og hvor mye sparer jeg?', a: 'Når du leier ut bolig, kan du trekke fra renteutgiftene på skatten. Staten dekker 22 % av rentekostnadene dine. Har du 10 000 kr i månedlige renter, sparer du 26 400 kr i året — penger som kommer tilbake som skatteoppgjør.' },
            { q: 'Hva er forskjellen på annuitetslån og serielån?', a: 'Annuitetslån har fast månedlig betaling — mer renter i starten, mer avdrag mot slutten. Serielån har fast avdrag og synkende renter, noe som gir høyere betaling i starten men lavere totalkostnad over tid.' },
            { q: 'Hva betyr ledighetsrate?', a: 'Ledighetsrate er andelen tid boligen står tom mellom leieforhold. En ledighetsrate på 4 % tilsvarer ca. 2 uker per år uten leie. Kalkulatoren trekker dette fra leieinntekten automatisk.' },
            { q: 'Kan jeg bruke kalkulatoren på Finn.no-annonser?', a: 'Ja! Lim inn en Finn.no-lenke øverst, trykk «Hent», og alle tall hentes automatisk. Du kan justere tallene manuelt etterpå.' },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-2xl p-5" style={cardStyle}>
              <h3 className="font-semibold text-white mb-2 text-sm">{q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Utleiekalkulator · Leiepriser fra hybel.no · Rente fra Fana Sparebank · Ikke finansiell rådgivning
        </p>
      </footer>
    </div>
  );
}
