'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadSaved, deleteProperty, type SavedProperty } from '../lib/savedProperties';

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));
const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

function MetricBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className={`text-sm font-bold ${color || 'text-white'}`}>{value}</span>
    </div>
  );
}

export default function Page() {
  const [list, setList] = useState<SavedProperty[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setList(loadSaved());
    setLoaded(true);
  }, []);

  const refresh = () => setList(loadSaved());

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`Slette "${name}"?`)) return;
    deleteProperty(id);
    refresh();
  };

  const sumPrice = list.reduce((s, p) => s + p.snapshot.price, 0);
  const sumCF = list.reduce((s, p) => s + p.snapshot.arligNettofortjeneste, 0);
  const avgYield = list.length > 0 ? list.reduce((s, p) => s + p.snapshot.nettoYield, 0) / list.length : 0;
  const sumEquity = list.reduce((s, p) => s + p.snapshot.equity, 0);

  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <header className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <Link href="/" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>
            Ny beregning
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">Dashbord</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Mine boliger</h1>
        <p className="text-slate-400 text-sm mb-8">
          Lagret lokalt i nettleseren din. Data synker ikke på tvers av enheter.
        </p>

        {loaded && list.length === 0 && (
          <div className="rounded-2xl p-10 text-center" style={cardStyle}>
            <p className="text-slate-400 text-base mb-4">Du har ikke lagret noen boliger ennå.</p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#2563eb' }}>
              Start din første beregning
            </Link>
          </div>
        )}

        {list.length > 0 && (
          <>
            {/* KPI-strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 rounded-2xl p-5" style={cardStyle}>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Antall boliger</p>
                <p className="text-2xl font-black text-white mt-1">{list.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total kjøpssum</p>
                <p className="text-2xl font-black text-white mt-1">{fmt(sumPrice / 1_000_000).replace(',', '.')}M</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Snitt yield</p>
                <p className={`text-2xl font-black mt-1 ${avgYield >= 5 ? 'text-emerald-400' : 'text-white'}`}>
                  {avgYield.toFixed(1).replace('.', ',')} %
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Årlig kontantstrøm</p>
                <p className={`text-2xl font-black mt-1 ${sumCF >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sumCF >= 0 ? '+' : ''}{fmt(sumCF)} kr
                </p>
              </div>
            </div>

            {/* Kort per bolig */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {list.map(p => (
                <div key={p.id} className="rounded-2xl p-5" style={cardStyle}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(p.savedAt).toLocaleDateString('nb-NO')} · {fmt(p.snapshot.price)} kr
                      </p>
                    </div>
                    <button onClick={() => onDelete(p.id, p.name)} className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded">
                      Slett
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <MetricBox label="Kontantstrøm/mnd" value={`${p.snapshot.afterTaxCF >= 0 ? '+' : ''}${fmt(p.snapshot.afterTaxCF)} kr`}
                      color={p.snapshot.afterTaxCF >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <MetricBox label="Yield (netto)" value={`${p.snapshot.nettoYield.toString().replace('.', ',')} %`} />
                    <MetricBox label="ROI" value={`${p.snapshot.roi.toString().replace('.', ',')} %`}
                      color={p.snapshot.roi > 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <MetricBox label="Egenkapital" value={`${fmt(p.snapshot.equity)} kr`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Sammenligning */}
            {list.length >= 2 && (
              <div className="rounded-2xl p-5 overflow-x-auto" style={cardStyle}>
                <h2 className="font-semibold text-white mb-1">Sammenligning</h2>
                <p className="text-xs text-slate-500 mb-4">Alle boliger side om side</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 font-medium">Bolig</th>
                      <th className="pb-3 font-medium text-right">Kjøpssum</th>
                      <th className="pb-3 font-medium text-right">Yield</th>
                      <th className="pb-3 font-medium text-right">ROI</th>
                      <th className="pb-3 font-medium text-right">Kontantstrøm/mnd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <td className="py-3 text-white">{p.name}</td>
                        <td className="py-3 text-right text-slate-300">{fmt(p.snapshot.price)} kr</td>
                        <td className="py-3 text-right text-slate-300">{p.snapshot.nettoYield.toString().replace('.', ',')} %</td>
                        <td className={`py-3 text-right font-semibold ${p.snapshot.roi > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {p.snapshot.roi.toString().replace('.', ',')} %
                        </td>
                        <td className={`py-3 text-right font-semibold ${p.snapshot.afterTaxCF >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {p.snapshot.afterTaxCF >= 0 ? '+' : ''}{fmt(p.snapshot.afterTaxCF)} kr
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
