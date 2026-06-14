'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));
const card = { background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };
const inputStyle = { border: '1px solid rgba(15,23,42,0.15)' };
const effektivRente = (nominell: number) => (Math.pow(1 + nominell / 100 / 12, 12) - 1) * 100;

// Number field with live thousand-separators (600 000 instead of 600000).
function NumField({ label, value, onChange, suffix = 'kr' }:
  { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      <div className="relative mt-1.5">
        <input type="text" inputMode="numeric" value={fmt(value)}
          onChange={e => onChange(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
          className="w-full h-12 pl-3 pr-10 rounded-xl text-base bg-white outline-none focus:border-blue-400 text-right font-bold tabular-nums"
          style={inputStyle} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">{suffix}</span>
      </div>
    </div>
  );
}

export default function BoliglanKalkulator() {
  const [mode, setMode] = useState<'laane' | 'koste'>('laane');

  // «Hvor mye kan jeg låne?»
  const [inntekt, setInntekt] = useState(600000);
  const [gjeld, setGjeld] = useState(0);

  // «Hvor mye koster lånet?»
  const [kjopesum, setKjopesum] = useState(3000000);
  const [egenkapital, setEgenkapital] = useState(450000);
  const [rente, setRente] = useState(5.5);
  const [aar, setAar] = useState(25);

  const laane = useMemo(() => {
    const maks = Math.max(0, inntekt * 5 - gjeld); // 5×-regelen (utlånsforskriften)
    const bolig = maks / 0.85; // med 15 % egenkapital
    return { maks, bolig };
  }, [inntekt, gjeld]);

  const koste = useMemo(() => {
    const laan = Math.max(0, kjopesum - egenkapital);
    const r = rente / 100 / 12;
    const n = aar * 12;
    const M = n === 0 ? 0 : (r === 0 ? laan / n : (laan * r) / (1 - Math.pow(1 + r, -n)));
    const total = M * n;
    const etterFradrag = M - laan * r * 0.22; // 22 % rentefradrag (første måned)
    const ekPct = kjopesum > 0 ? (egenkapital / kjopesum) * 100 : 0;
    return { laan, M, total, etterFradrag, ekPct };
  }, [kjopesum, egenkapital, rente, aar]);

  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#f7f8fa' }}>
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="" className="w-7 h-7" />
            <span className="font-bold text-sm">Utleiekalkulator</span>
          </Link>
          <Link href="/kalkulatorer" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">← Alle kalkulatorer</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 mt-6">Boliglånskalkulator</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Regn ut hvor mye du kan låne, og hva lånet vil koste deg i måneden. Gratis og uforpliktende.
        </p>

        {/* Tabs */}
        <div className="inline-flex p-1 rounded-full mb-6" style={{ background: 'rgba(15,23,42,0.05)' }}>
          {([['laane', 'Hvor mye kan jeg låne?'], ['koste', 'Hvor mye koster lånet?']] as const).map(([m, t]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${mode === m ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              style={mode === m ? { background: '#2563eb' } : undefined}>
              {t}
            </button>
          ))}
        </div>

        {mode === 'laane' ? (
          <div className="rounded-2xl p-5 sm:p-6" style={card}>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumField label="Samlet årsinntekt før skatt" value={inntekt} onChange={setInntekt} />
              <NumField label="Samlet lån og gjeld i dag" value={gjeld} onChange={setGjeld} />
            </div>
            <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <p className="text-sm text-slate-500">Du kan trolig låne rundt</p>
              <p className="text-4xl font-black text-blue-600 my-1">{fmt(laane.maks)} kr</p>
              <p className="text-sm text-slate-500">Det rekker til en bolig på ca. <strong className="text-slate-700">{fmt(laane.bolig)} kr</strong> med 15 % egenkapital.</p>
            </div>
            <p className="text-xs text-slate-400 mt-5 leading-relaxed">
              Basert på «5×-regelen»: lånet kan normalt ikke overstige fem ganger samlet årsinntekt. Banken vurderer i tillegg
              at du tåler en renteøkning på 3 prosentpoeng. Dette er et veiledende estimat, ikke et lånetilbud.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl p-5 sm:p-6" style={card}>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumField label="Kjøpesum" value={kjopesum} onChange={setKjopesum} />
              <NumField label="Egenkapital" value={egenkapital} onChange={setEgenkapital} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nominell rente</label>
                  <span className="text-sm font-bold">{rente.toString().replace('.', ',')} %</span>
                </div>
                <input type="range" min={1} max={10} step={0.1} value={rente}
                  onChange={e => setRente(Number(e.target.value))} className="w-full mt-2 accent-blue-600" />
                <p className="text-xs text-slate-400 mt-1.5">Tilsvarer {effektivRente(rente).toFixed(2).replace('.', ',')} % effektiv rente</p>
              </div>
              <div>
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nedbetalingstid</label>
                  <span className="text-sm font-bold">{aar} år</span>
                </div>
                <input type="range" min={1} max={30} step={1} value={aar}
                  onChange={e => setAar(Number(e.target.value))} className="w-full mt-2 accent-blue-600" />
              </div>
            </div>

            <div className="mt-6 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <Result label="Lånebeløp" value={`${fmt(koste.laan)} kr`} />
              <Result label="Per måned" value={`${fmt(koste.M)} kr`} highlight />
              <Result label="Etter skattefradrag" value={`${fmt(koste.etterFradrag)} kr`} sub="22 % rentefradrag" />
              <Result label="Totalt å betale" value={`${fmt(koste.total)} kr`} />
            </div>
            {koste.ekPct < 15 && koste.laan > 0 && (
              <p className="text-xs text-amber-600 mt-4">
                Egenkapitalen din er {koste.ekPct.toFixed(0)} % — bankene krever normalt minst 15 %.
              </p>
            )}
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Annuitetslån med lik månedlig betaling. Veiledende tall — faktisk rente og kostnad avhenger av banken.
            </p>
          </div>
        )}

        {/* Subtil kryss-lenking */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Flere kalkulatorer</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/kalkulatorer" className="text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors" style={card}>🧮 Alle kalkulatorer</Link>
            <Link href="/kalkulator" className="text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors" style={card}>📊 Utleiekalkulator</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Result({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl p-3" style={{ background: highlight ? 'rgba(37,99,235,0.06)' : '#f8fafc', border: `1px solid ${highlight ? 'rgba(37,99,235,0.2)' : 'rgba(15,23,42,0.06)'}` }}>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`text-lg font-black mt-0.5 ${highlight ? 'text-blue-600' : 'text-slate-900'}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
