'use client';

import { useState } from 'react';
import Link from 'next/link';

// Always-available menu (floating button) so the guides + "Analyser bolig"
// are reachable from every page, regardless of each page's own header.
export default function GuideMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="fixed bottom-5 left-5 z-50 print:hidden">
      {open && (
        <>
          <div className="fixed inset-0 -z-10" onClick={close} />
          <div className="absolute bottom-full mb-2 left-0 w-64 rounded-xl p-2 shadow-2xl"
            style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.1)' }}>
            <Link href="/" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-500/10 transition-colors">
              🔍 Analyser bolig
            </Link>
            <div className="h-px my-2" style={{ background: 'rgba(15,23,42,0.08)' }} />
            <p className="text-xs text-slate-500 uppercase tracking-wider px-3 py-2">Guider</p>
            <Link href="/lonner-det-seg-a-leie-ut" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-500/10 transition-colors">
              Lønner det seg å leie ut?
            </Link>
            <Link href="/skatt-leieinntekter" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-500/10 transition-colors">
              Skatt på utleie
            </Link>
            <Link href="/egenkapital-utleiebolig" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-sky-700 hover:bg-sky-500/10 transition-colors">
              Egenkapitalkrav
            </Link>
            <div className="h-px my-2" style={{ background: 'rgba(15,23,42,0.08)' }} />
            <Link href="/slik-beregnes-det" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Slik beregnes det
            </Link>
            <Link href="/personvern" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Personvern
            </Link>
          </div>
        </>
      )}
      <button onClick={() => setOpen(v => !v)} aria-label="Meny" aria-expanded={open}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white shadow-lg text-slate-700 hover:text-slate-900 transition-colors font-semibold text-sm"
        style={{ border: '1px solid rgba(15,23,42,0.1)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
        Meny
      </button>
    </div>
  );
}
