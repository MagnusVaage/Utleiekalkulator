'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));
const card = { background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };
const inputStyle = { border: '1px solid rgba(15,23,42,0.15)' };

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

const TINGLYSING_SKJOTE = 585;
const TINGLYSING_PANT = 585;

export default function Dokumentavgift() {
  const [kjopesum, setKjopesum] = useState(3000000);
  const [type, setType] = useState<'selveier' | 'borettslag'>('selveier');
  const [harLaan, setHarLaan] = useState(true);

  const r = useMemo(() => {
    const dokavgift = type === 'selveier' ? kjopesum * 0.025 : 0;
    const pant = harLaan ? TINGLYSING_PANT : 0;
    const total = dokavgift + TINGLYSING_SKJOTE + pant;
    return { dokavgift, pant, total };
  }, [kjopesum, type, harLaan]);

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
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 mt-6">Dokumentavgift-kalkulator</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Regn ut hva du må betale i dokumentavgift (2,5 %) og tinglysingsgebyr når du kjøper bolig.
        </p>

        <div className="rounded-2xl p-5 sm:p-6" style={card}>
          <NumField label="Kjøpesum" value={kjopesum} onChange={setKjopesum} />

          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Boligtype</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {([['selveier', 'Selveier'], ['borettslag', 'Borettslag / aksje']] as const).map(([v, t]) => (
                  <button key={v} onClick={() => setType(v)}
                    className={`h-11 rounded-xl text-sm font-semibold transition-all ${type === v ? 'text-white' : 'text-slate-600'}`}
                    style={type === v ? { background: '#2563eb' } : { ...inputStyle, background: '#fff' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tar du opp lån?</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {([['ja', true], ['nei', false]] as const).map(([t, v]) => (
                  <button key={t} onClick={() => setHarLaan(v)}
                    className={`h-11 rounded-xl text-sm font-semibold transition-all capitalize ${harLaan === v ? 'text-white' : 'text-slate-600'}`}
                    style={harLaan === v ? { background: '#2563eb' } : { ...inputStyle, background: '#fff' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 space-y-2" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
            <Row label="Dokumentavgift (2,5 %)" value={r.dokavgift} muted={type === 'borettslag'} />
            <Row label="Tinglysingsgebyr – skjøte" value={TINGLYSING_SKJOTE} />
            {harLaan && <Row label="Tinglysingsgebyr – pantedokument" value={r.pant} />}
            <div className="pt-3 mt-2 flex justify-between items-baseline" style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}>
              <span className="font-bold">Totale omkostninger</span>
              <span className="text-2xl font-black text-blue-600">{fmt(r.total)} kr</span>
            </div>
          </div>

          {type === 'borettslag' && (
            <p className="text-xs text-emerald-700 mt-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(5,150,105,0.08)' }}>
              ✓ Borettslags- og aksjeleiligheter har <strong>ingen dokumentavgift</strong> — du kjøper en andel, ikke en tinglyst eiendom.
            </p>
          )}
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Dokumentavgiften er 2,5 % av kjøpesummen (markedsverdien) ved tinglysing av skjøte på selveierbolig. Nye boliger på egen tomt
            kan ha avgift kun på tomteverdien. Veiledende tall — sjekk med megler/Kartverket for ditt tilfelle.
          </p>
        </div>

        <div className="rounded-2xl p-6 mt-10 text-center" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.25)' }}>
          <h3 className="text-lg font-bold mb-1.5">Skal du kjøpe denne boligen?</h3>
          <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">Lim inn Finn-lenken, så avdekker AI-en risiko i salgsoppgaven (TG1/TG2/TG3) og regner yield og kontantstrøm — på sekunder.</p>
          <Link href="/analyse" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-transform hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
            Analyser salgsoppgaven gratis →
          </Link>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Flere kalkulatorer</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/kalkulatorer" className="text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors" style={card}>🧮 Alle kalkulatorer</Link>
            <Link href="/boliglanskalkulator" className="text-sm px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-colors" style={card}>🏦 Boliglånskalkulator</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="flex justify-between items-baseline text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold tabular-nums ${muted ? 'text-slate-400' : 'text-slate-900'}`}>{fmt(value)} kr</span>
    </div>
  );
}
