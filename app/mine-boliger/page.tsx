'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadAnalyses, deleteAnalysis, type SavedAnalysis } from '../lib/savedAnalyses';

const fmt = (n: number) => new Intl.NumberFormat('nb-NO').format(Math.round(n));
const card = { background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };

const TG_STYLE: Record<string, { bg: string; bd: string; col: string }> = {
  tg3: { bg: 'rgba(220,38,38,0.08)', bd: 'rgba(220,38,38,0.25)', col: '#b91c1c' },
  tg2: { bg: 'rgba(234,88,12,0.08)', bd: 'rgba(234,88,12,0.25)', col: '#c2410c' },
  tg1: { bg: 'rgba(202,138,4,0.1)', bd: 'rgba(202,138,4,0.25)', col: '#a16207' },
};

export default function Page() {
  const [list, setList] = useState<SavedAnalysis[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setList(loadAnalyses());
    setLoaded(true);
  }, []);

  const onDelete = (id: string, name: string) => {
    if (!window.confirm(`Slette "${name}"?`)) return;
    deleteAnalysis(id);
    setList(loadAnalyses());
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#f7f8fa' }}>
      <header className="px-4 sm:px-6 py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(247,248,250,0.9)', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="" className="w-7 h-7" />
            <span className="font-bold text-sm">Utleiekalkulator</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-transform hover:scale-[1.02] whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
            + Ny analyse
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-10">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Dashbord</p>
        <h1 className="text-3xl sm:text-4xl font-black mb-2">Mine boliger</h1>
        <p className="text-slate-500 text-sm mb-8">
          Boliger du har analysert. Lagret lokalt i nettleseren din.
        </p>

        {loaded && list.length === 0 && (
          <div className="rounded-2xl p-10 text-center" style={card}>
            <p className="text-slate-500 text-base mb-4">Du har ikke analysert noen boliger ennå.</p>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
              Start din første analyse
            </Link>
          </div>
        )}

        {list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(a => (
              <div key={a.id} className="rounded-2xl overflow-hidden flex flex-col" style={card}>
                <div className="h-40 relative" style={{ background: 'linear-gradient(135deg,#e2e8f0,#cbd5e1)' }}>
                  {a.image && <img src={a.image} alt={a.address || 'Lagret bolig'} onError={e => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />}
                  <button onClick={() => onDelete(a.id, a.address)}
                    className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-md text-slate-700"
                    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
                    Slett
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="font-bold text-sm truncate">{a.address}</p>
                  <div className="flex justify-between items-baseline mt-1">
                    {a.price > 0 && <span className="font-black text-slate-900">{fmt(a.price)} kr</span>}
                    <span className="text-xs text-slate-500">{new Date(a.savedAt).toLocaleDateString('nb-NO')}</span>
                  </div>
                  {(a.counts.tg3 + a.counts.tg2 + a.counts.tg1 > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {a.counts.tg3 > 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: TG_STYLE.tg3.bg, border: `1px solid ${TG_STYLE.tg3.bd}`, color: TG_STYLE.tg3.col }}>TG3: {a.counts.tg3}</span>}
                      {a.counts.tg2 > 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: TG_STYLE.tg2.bg, border: `1px solid ${TG_STYLE.tg2.bd}`, color: TG_STYLE.tg2.col }}>TG2: {a.counts.tg2}</span>}
                      {a.counts.tg1 > 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: TG_STYLE.tg1.bg, border: `1px solid ${TG_STYLE.tg1.bd}`, color: TG_STYLE.tg1.col }}>TG1: {a.counts.tg1}</span>}
                    </div>
                  )}
                  {a.summary && <p className="text-xs text-slate-500 leading-relaxed mt-3 line-clamp-3">{a.summary}</p>}
                  <Link href={`/analyse?finn=${encodeURIComponent(a.finnUrl)}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-3 inline-block">
                    Åpne analyse →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
