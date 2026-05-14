'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600 mt-0.5">{hint}</p>}
    </div>
  );
}

const inputCls = [
  'w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600',
  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
].join(' ');

const inputStyle = { background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' };

function TInput({ value, onChange, placeholder, readOnly }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean;
}) {
  return (
    <input type="text" value={value} onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder} readOnly={readOnly}
      className={`${inputCls} ${readOnly ? 'opacity-60 cursor-default' : ''}`} style={inputStyle} />
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

function MetricBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className={`text-base font-bold ${color || 'text-white'}`}>{value}</span>
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
  const [leieTab, setLeieTab] = useState('fast');

  const [form, setForm] = useState({
    adresse: '',
    // Grunnlag
    prisantydning: '', gjeld: '', ekPct: '15',
    // Eiendomsinfo (for leieestimat)
    bra: '', rooms: '2', city: 'oslo',
    // Lån
    nominellRente: '4.80', termYears: '25', laanetype: 'annuitet',
    // Utgifter
    kommunale: '', eiendomsskatt: '', vedlikeholdKr: '', fellesutg: '',
    wifi: '', strom: '', forsikring: '', utleiemegler: '',
    // Leieinntekter
    rent: '', maanederUtleid: '12',
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
        adresse: data.address || '',
        prisantydning: String(data.prisantydning || ''),
        gjeld: String(data.gjeld || ''),
        bra: String(data.bra || ''),
        rooms: String(data.rooms || '2'),
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

    const gjeld = parseInt(form.gjeld.replace(/\D/g, '')) || 0;
    const total = price + gjeld;
    const bra = parseInt(form.bra) || 50;
    const rooms = parseInt(form.rooms) || 2;
    const nominellRente = parseFloat(form.nominellRente) || 4.80;
    const effektivRente = Math.round(((Math.pow(1 + nominellRente / 100 / 12, 12) - 1) * 100) * 100) / 100;
    const termYears = parseInt(form.termYears) || 25;
    const ekPct = parseInt(form.ekPct) || 15;

    const dokumentavgift = Math.round(price * 0.025);

    const cityMult = CITIES[form.city] ?? 0.65;
    const osloBase = rooms <= 1 ? { base: 14444, typBra: 35 } : rooms === 2 ? { base: 18703, typBra: 55 } : { base: 23260, typBra: 75 };
    const estimatedRent = Math.round(osloBase.base * cityMult * (bra / osloBase.typBra) * 1.03);
    const rentRaw = parseInt(form.rent.replace(/\D/g, '')) || estimatedRent;
    const maanederUtleid = parseInt(form.maanederUtleid) || 12;
    const effectiveRent = Math.round(rentRaw * maanederUtleid / 12);

    const fellesutg = parseInt(form.fellesutg.replace(/\D/g, '')) || Math.round(bra * 38);
    const kommunale_mnd = Math.round((parseInt(form.kommunale.replace(/\D/g, '')) || 0) / 12);
    const eiendomsskatt_mnd = Math.round((parseInt(form.eiendomsskatt.replace(/\D/g, '')) || 0) / 12);
    const vedlikehold_mnd = Math.round((parseInt(form.vedlikeholdKr.replace(/\D/g, '')) || 0) / 12);
    const forsikring = parseInt(form.forsikring.replace(/\D/g, '')) || 0;
    const wifi = parseInt(form.wifi.replace(/\D/g, '')) || 0;
    const strom = parseInt(form.strom.replace(/\D/g, '')) || 0;
    const utleiemegler = parseInt(form.utleiemegler.replace(/\D/g, '')) || 0;

    const operatingCosts = fellesutg + kommunale_mnd + eiendomsskatt_mnd + vedlikehold_mnd + forsikring + wifi + strom + utleiemegler;

    const equity = Math.round(total * ekPct / 100);
    const loan = Math.max(0, total - equity);

    const monthlyInterest = Math.round(loan * nominellRente / 100 / 12);
    let pmt = 0, monthlyPrincipal = 0;
    if (avdragsfrihet) {
      pmt = monthlyInterest; monthlyPrincipal = 0;
    } else if (form.laanetype === 'serie') {
      monthlyPrincipal = Math.round(loan / (termYears * 12));
      pmt = monthlyPrincipal + monthlyInterest;
    } else {
      pmt = calcAnnuitet(loan, nominellRente, termYears);
      monthlyPrincipal = Math.max(0, pmt - monthlyInterest);
    }

    const totalCosts = operatingCosts + pmt;
    const preTaxCF = effectiveRent - totalCosts;
    const taxable = Math.max(0, effectiveRent - operatingCosts - monthlyInterest);
    const monthlyTax = Math.round(taxable * 0.22);
    const rentefradragAnnual = Math.round(monthlyInterest * 12 * 0.22);
    const afterTaxCF = preTaxCF - monthlyTax;

    const netOperatingIncome = (effectiveRent - operatingCosts) * 12;
    const nettoYield = total > 0 ? Math.round(netOperatingIncome / total * 1000) / 10 : 0;
    const arligNettofortjeneste = afterTaxCF * 12;
    const roi = equity > 0 ? Math.round((arligNettofortjeneste + monthlyPrincipal * 12) / equity * 1000) / 10 : 0;

    const totalLoanPayment = pmt * termYears * 12;
    const totalInterest = Math.max(0, totalLoanPayment - loan);

    return {
      total, dokumentavgift, effectiveRent, estimatedRent, effektivRente,
      fellesutg, operatingCosts,
      loan, equity, pmt, monthlyInterest, monthlyPrincipal,
      totalCosts, afterTaxCF, monthlyTax, rentefradragAnnual,
      nettoYield, arligNettofortjeneste, roi,
      totalLoanPayment, totalInterest,
    };
  }, [form, avdragsfrihet]);

  const isPos = calc ? calc.afterTaxCF >= 0 : false;
  const ekPct_frac = ((parseInt(form.ekPct) - 10) / 40) * 100;
  const termPct = ((parseInt(form.termYears) - 5) / 25) * 100;
  const maanederPct = ((parseInt(form.maanederUtleid) - 1) / 11) * 100;

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
          <div className="flex items-center gap-4">
            <Link href="/rapport"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              📄 Tilstandsrapport
            </Link>
            <span className="hidden md:block text-xs text-slate-600">Gratis · Ingen registrering</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-6 items-start">

          {/* ── LEFT: INPUTS ── */}
          <div className="flex flex-col gap-5">

            {/* 1. Informasjon */}
            <Card>
              <h2 className="font-semibold text-white mb-1">Informasjon</h2>
              <p className="text-xs text-slate-500 mb-4">Boliginformasjon fra FINN</p>
              <div className="flex flex-col gap-4">
                <Field label="Finn-link">
                  <div className="flex gap-2">
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && fetchFromFinn()}
                      placeholder="https://www.finn.no/realestate/..."
                      className={inputCls} style={inputStyle} />
                    <button onClick={fetchFromFinn} disabled={fetching || !url.trim()}
                      className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-500 disabled:opacity-40 transition-all whitespace-nowrap">
                      {fetching ? '...' : '🔒 Hent fra FINN'}
                    </button>
                  </div>
                  {fetchMsg && <p className="mt-1 text-emerald-400 text-xs font-medium">{fetchMsg}</p>}
                  {fetchErr && <p className="mt-1 text-red-400 text-xs">{fetchErr}</p>}
                </Field>
                <Field label="Adresse">
                  <TInput value={form.adresse} onChange={setF('adresse')} placeholder="Adresse" />
                </Field>
              </div>
            </Card>

            {/* 2. Grunnlag */}
            <Card>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-white">Grunnlag</h2>
                <span className="text-xs text-slate-500">Formatering og autofyll</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Kjøpssum">
                  <TInput value={form.prisantydning} onChange={setF('prisantydning')} placeholder="1 000 000" />
                </Field>
                <Field label="Dokumentavgift og tinglysing (2,5%)">
                  <TInput value={calc ? `${fmt(calc.dokumentavgift)} kr` : ''} placeholder="25 000 kr" readOnly />
                </Field>
                <div className="col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Egenkapital %</label>
                    <div className="flex gap-3 items-center">
                      <input type="range" min={10} max={50} step={1} value={form.ekPct}
                        onChange={e => setF('ekPct')(e.target.value)}
                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right,#3b82f6 ${ekPct_frac}%,rgba(255,255,255,0.1) ${ekPct_frac}%)` }} />
                      <div className="flex items-center gap-1">
                        <input type="number" value={form.ekPct} onChange={e => setF('ekPct')(e.target.value)}
                          className="w-14 text-center rounded-lg py-1.5 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={inputStyle} min={10} max={50} />
                        <span className="text-sm text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Field label="Egenkapital (beløp)"
                  hint="Beregnes fra kjøpssum × % – justeres mht. oppussing ved lån.">
                  <TInput value={calc ? `${fmt(calc.equity)} kr` : ''} placeholder="175 000 kr" readOnly />
                </Field>
                <Field label="Fellesgjeld">
                  <TInput value={form.gjeld} onChange={setF('gjeld')} placeholder="0 kr" />
                </Field>
              </div>
            </Card>

            {/* 3. Utgifter */}
            <Card>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-white">Utgifter</h2>
                <span className="text-xs text-slate-500">Standard + egendefinerte</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-5">
                <Field label="Kommunale avg. (år)">
                  <TInput value={form.kommunale} onChange={setF('kommunale')} placeholder="100" />
                </Field>
                <Field label="Eiendomsskatt (år)">
                  <TInput value={form.eiendomsskatt} onChange={setF('eiendomsskatt')} placeholder="" />
                </Field>
                <Field label="Vedlikehold (år)">
                  <TInput value={form.vedlikeholdKr} onChange={setF('vedlikeholdKr')} placeholder="" />
                </Field>
                <Field label="Felleskostn. (mnd)">
                  <TInput value={form.fellesutg} onChange={setF('fellesutg')}
                    placeholder={calc ? `${fmt(calc.fellesutg)}` : '100'} />
                </Field>
                <Field label="Wifi/TV (mnd)">
                  <TInput value={form.wifi} onChange={setF('wifi')} placeholder="" />
                </Field>
                <Field label="Strøm (mnd)">
                  <TInput value={form.strom} onChange={setF('strom')} placeholder="100" />
                </Field>
                <Field label="Forsikring (mnd)">
                  <TInput value={form.forsikring} onChange={setF('forsikring')} placeholder="" />
                </Field>
                <Field label="Utleiemegler (mnd)">
                  <TInput value={form.utleiemegler} onChange={setF('utleiemegler')} placeholder="" />
                </Field>
              </div>
              <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="text-sm font-medium text-white">Egendefinerte utgifter</p>
                  <p className="text-xs text-slate-500 mt-0.5">Velg månedlig eller årlig. Beløp formateres automatisk.</p>
                </div>
                <button className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg"
                  style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
                  Legg til utgift
                </button>
              </div>
            </Card>

            {/* 4. Leieinntekter */}
            <Card>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-white">Leieinntekter</h2>
                <span className="text-xs text-slate-500">Velg modell</span>
              </div>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl mb-5"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { id: 'korttid', label: 'Korttidsleie' },
                  { id: 'fast', label: 'Fast månedsleie' },
                  { id: 'kollektiv', label: 'Kollektiv' },
                  { id: 'langkorttid', label: 'Lang og korttidsleie' },
                ].map(tab => (
                  <button key={tab.id} type="button" onClick={() => setLeieTab(tab.id)}
                    className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                      leieTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {leieTab === 'fast' ? (
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Månedsleie">
                      <TInput value={form.rent} onChange={setF('rent')}
                        placeholder={calc ? `${fmt(calc.estimatedRent)}` : ''} />
                    </Field>
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Antall måneder utleid per år</label>
                        <div className="flex items-center gap-1">
                          <span className="text-base font-bold text-blue-400">{form.maanederUtleid}</span>
                          <span className="text-sm text-slate-400">mnd</span>
                        </div>
                      </div>
                      <input type="range" min={1} max={12} step={1} value={form.maanederUtleid}
                        onChange={e => setF('maanederUtleid')(e.target.value)}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right,#3b82f6 ${maanederPct}%,rgba(255,255,255,0.1) ${maanederPct}%)` }} />
                      <div className="flex justify-between text-xs text-slate-600 mt-1"><span>1 mnd</span><span>12 mnd</span></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Sammenlign utleiepriser:</p>
                    <div className="flex gap-2">
                      <a href="https://www.finn.no/realestate/lettings/search.html" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:opacity-80"
                        style={{ background: 'rgba(0,80,200,0.25)', border: '1px solid rgba(0,100,220,0.4)' }}>
                        🔵 Søk på FINN
                      </a>
                      <a href="https://hybel.no" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white transition-all hover:opacity-80"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        🏠 Søk på Hybel
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Denne modellen kommer snart
                </div>
              )}
            </Card>

            {/* 5. Lån */}
            <Card>
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-white">Lån</h2>
                <span className="text-xs text-slate-500">Nominell → Effektiv beregnes automatisk</span>
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nominell rente (p.a.)">
                    <TInput value={form.nominellRente} onChange={setF('nominellRente')} placeholder="4,80 %" />
                  </Field>
                  <Field label="Effektiv rente (p.a.)" hint="Beregnes fra nominell">
                    <TInput value={calc ? `${calc.effektivRente} %` : ''} placeholder="5,07 %" readOnly />
                  </Field>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Løpetid (år)</label>
                    <div className="flex items-center gap-1">
                      <span className="text-base font-bold text-blue-400">{form.termYears}</span>
                      <span className="text-sm text-slate-400">år</span>
                    </div>
                  </div>
                  <input type="range" min={5} max={30} step={1} value={form.termYears}
                    onChange={e => setF('termYears')(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right,#3b82f6 ${termPct}%,rgba(255,255,255,0.1) ${termPct}%)` }} />
                  <div className="flex justify-between text-xs text-slate-600 mt-1"><span>5 år</span><span>30 år</span></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div className="relative inline-block w-10 h-6" onClick={() => setAvdragsfrihet(v => !v)}>
                    <div className={`w-10 h-6 rounded-full transition-colors ${avdragsfrihet ? 'bg-blue-600' : 'bg-slate-700'}`} />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${avdragsfrihet ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm text-white">Avdragsfritt lån (kun rentebetaling)</span>
                </label>
              </div>
            </Card>

          </div>

          {/* ── RIGHT: RESULTS (sticky) ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            {!calc ? (
              <Card className="text-center py-12">
                <div className="text-5xl mb-4">🏠</div>
                <p className="text-slate-400 text-sm leading-relaxed">Fyll inn kjøpssum<br />for å se analysen</p>
              </Card>
            ) : (
              <>
                {/* Resultat */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white">Resultat</h3>
                    <span className="text-xs text-slate-500">Oppsummering</span>
                  </div>
                  <div className="text-center mb-5 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Månedlig kontantstrøm</p>
                    <p className={`text-4xl font-black ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPos ? '+' : ''}{fmt(calc.afterTaxCF)} kr
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Netto (etter alle utgifter)</p>
                  </div>
                  <div>
                    <SRow label="Årlig kontantstrøm"
                      value={`${calc.arligNettofortjeneste >= 0 ? '+' : ''}${fmt(calc.arligNettofortjeneste)} kr`}
                      color={calc.arligNettofortjeneste >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <SRow label="Yield (netto)" value={`${calc.nettoYield} %`} />
                    <SRow label="ROI (netto)" value={`${calc.roi} %`}
                      color={calc.roi > 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <SRow label="Utgifter i året" value={`${fmt(calc.operatingCosts * 12)} kr`} />
                  </div>
                </Card>

                {/* Lån details */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white">Lån</h3>
                    <span className="text-xs text-slate-500">Detaljer</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricBox label="Lån i måneden" value={`${fmt(calc.pmt)} kr`} color="text-red-400" />
                    <MetricBox label="Renter i måneden" value={`${fmt(calc.monthlyInterest)} kr`} color="text-red-400" />
                    <MetricBox label="Avdrag i måneden" value={`${fmt(calc.monthlyPrincipal)} kr`} color="text-red-400" />
                    <MetricBox label="Rentefradrag" value={`${fmt(calc.rentefradragAnnual)} kr`} color="text-emerald-400" />
                    <MetricBox label="Totalpris på lån" value={`${fmt(calc.totalLoanPayment)} kr`} />
                    <MetricBox label="Renter totalt" value={`${fmt(calc.totalInterest)} kr`} />
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
            { q: 'Hva betyr antall måneder utleid?', a: 'Antall måneder utleid per år lar deg justere for perioder boligen står tom. 12 måneder betyr full utleie. 11 måneder tilsvarer ca. 8 % ledighet — omtrent 2 uker per halvår.' },
            { q: 'Kan jeg bruke kalkulatoren på Finn.no-annonser?', a: 'Ja! Lim inn en Finn.no-lenke øverst, trykk «Hent fra FINN», og alle tall hentes automatisk. Du kan justere tallene manuelt etterpå.' },
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
          © {new Date().getFullYear()} Utleiekalkulator · Leiepriser fra hybel.no · Ikke finansiell rådgivning
        </p>
      </footer>
    </div>
  );
}
