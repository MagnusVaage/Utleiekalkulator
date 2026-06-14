'use client';

import { useState } from 'react';
import Link from 'next/link';

// Inline hamburger menu meant to sit inside a header/nav. Renders a compact
// button with a dropdown of "Analyser bolig" + the guide pages.
const ARTIKLER = [
  { href: '/boligmarkedet-2026', title: 'Boligmarkedet 2026' },
  { href: '/egenkapitalkrav', title: 'Nytt egenkapitalkrav: 10 %' },
  { href: '/renteutvikling-2026', title: 'Renteutvikling 2026' },
  { href: '/hva-koster-det-a-kjope-bolig', title: 'Hva koster det å kjøpe bolig?' },
  { href: '/vanligste-tabbene-ved-boligkjop', title: 'Vanligste tabbene ved boligkjøp' },
];

export default function GuideMenu() {
  const [open, setOpen] = useState(false);
  const [artiklerOpen, setArtiklerOpen] = useState(false);
  const close = () => { setOpen(false); setArtiklerOpen(false); };

  return (
    <div className="relative shrink-0">
      <button onClick={() => setOpen(v => !v)} aria-label="Meny" aria-expanded={open}
        className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute left-0 top-full mt-2 w-64 rounded-xl p-2 z-20 shadow-2xl"
            style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.1)' }}>
            <Link href="/" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-500/10 transition-colors">
              🔍 Analyser bolig
            </Link>
            <Link href="/kalkulatorer" onClick={close}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              🧮 Andre kalkulatorer
            </Link>

            <button onClick={() => setArtiklerOpen(v => !v)} aria-expanded={artiklerOpen}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              <span>📰 Artikler</span>
              <span className={`text-slate-400 transition-transform ${artiklerOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {artiklerOpen && (
              <div className="pl-3 mb-1">
                {ARTIKLER.map((a) => (
                  <Link key={a.href} href={a.href} onClick={close}
                    className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                    {a.title}
                  </Link>
                ))}
              </div>
            )}

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
    </div>
  );
}
