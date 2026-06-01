'use client';

import { useState } from 'react';
import Link from 'next/link';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };
const purpleGlow = { boxShadow: '0 10px 40px rgba(168,85,247,0.35), 0 0 0 1px rgba(168,85,247,0.5)' };

const SAMPLE = [
  { time: '2 min siden', addr: 'Thorvald Meyers gate 41', price: '4 850 000 kr', area: '52 m²', tags: ['Yield 5,8 %', '+1 240 kr/mnd'] },
  { time: '6 min siden', addr: 'Bygdøy allé 12', price: '8 200 000 kr', area: '78 m²', tags: ['Yield 4,1 %', '−890 kr/mnd'] },
  { time: '11 min siden', addr: 'Storgata 36, Trondheim', price: '3 100 000 kr', area: '45 m²', tags: ['Yield 6,7 %', '+2 980 kr/mnd'] },
  { time: '15 min siden', addr: 'Marken 18, Bergen', price: '4 400 000 kr', area: '61 m²', tags: ['Yield 5,2 %', '+650 kr/mnd'] },
  { time: '22 min siden', addr: 'Kirkegata 9, Stavanger', price: '3 750 000 kr', area: '54 m²', tags: ['Yield 5,9 %', '+1 410 kr/mnd'] },
];

export default function Page() {
  const [url, setUrl] = useState('');

  const goAnalyse = () => {
    if (!url.trim()) return;
    window.location.href = `/?finn=${encodeURIComponent(url.trim())}`;
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#070710' }}>
      {/* Header — pill nav */}
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full px-2 py-1.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Link href="/" className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full"
              style={{ background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.25)' }}>
              <img src="/logo.svg" alt="" className="w-6 h-6" />
              <span className="font-bold text-sm">Utleiekalkulator</span>
            </Link>
            <Link href="/" className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <span className="text-lg leading-none">＋</span> Ny beregning
            </Link>
            <Link href="/mine-boliger" className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <span className="text-lg leading-none">⌂</span> Mine boliger
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-12 sm:pt-20 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-purple-200 mb-6"
            style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.35)' }}>
            Utleiekalkulator for investorer
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-slate-100">
            Vit om utleieboligen<br />går i pluss <span className="text-purple-300">før du byr</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            Lim inn en Finn-lenke. Vi regner yield, kontantstrøm, lån og skatt på sekunder — basert på norske regler for 2026.
          </p>

          {/* CTA card */}
          <div className="rounded-2xl p-2 mx-auto max-w-2xl" style={purpleGlow}>
            <div className="rounded-xl flex flex-col sm:flex-row items-stretch gap-2 p-2"
              style={{ background: '#0d0d18', border: '1px solid rgba(168,85,247,0.25)' }}>
              <div className="flex-1 text-left px-3 py-2">
                <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Bolig-annonse</p>
                <input value={url} onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goAnalyse()}
                  placeholder="Lim inn Finn-lenke…"
                  className="w-full bg-transparent outline-none text-base text-white placeholder-slate-500 mt-0.5" />
              </div>
              <button onClick={goAnalyse}
                className="px-6 py-3 rounded-xl font-bold text-white whitespace-nowrap flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                Analyser bolig <span>→</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Utleiekalkulator er et støtteverktøy for utleieinvestering, men erstatter ikke profesjonell rådgivning.
            Alle beslutninger må baseres på egen research — vi tar ikke ansvar for feil i beregninger.
          </p>
        </div>
      </section>

      {/* Andre regnet nylig på */}
      <section className="px-4 pt-8 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-5">Andre regnet nylig på</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {SAMPLE.map((s, i) => (
            <div key={i} className="shrink-0 w-64 rounded-2xl overflow-hidden snap-start" style={card}>
              <div className="h-40 relative" style={{ background: `linear-gradient(135deg, hsl(${(i*47)%360},40%,25%), hsl(${(i*47+60)%360},40%,15%))` }}>
                <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-md"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>{s.time}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm truncate">{s.addr}</p>
                <div className="flex justify-between text-sm mt-1.5">
                  <span className="font-bold text-white">{s.price}</span>
                  <span className="text-slate-400">{s.area}</span>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-3 mb-2">Nøkkeltall</p>
                <div className="flex flex-col gap-1.5">
                  {s.tags.map((t,ti) => (
                    <span key={ti} className={`text-xs font-medium px-2.5 py-1.5 rounded-md ${t.includes('−') ? 'text-red-300' : 'text-emerald-300'}`}
                      style={{ background: t.includes('−') ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${t.includes('−') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alt du trenger før visning */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Alt du trenger før budrunden</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Vi regner ut alt det viktige fra én Finn-lenke — yield, kontantstrøm, skatt og rentefradrag. Helt gratis.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: '📊', title: 'Yield og ROI', body: 'Brutto og netto avkastning regnet etter norsk metode.', link: '/slik-beregnes-det' },
            { icon: '💸', title: 'Kontantstrøm/mnd', body: 'Hva du faktisk sitter igjen med etter renter, avdrag og skatt.', link: '/' },
            { icon: '🏦', title: 'Lån og rentestress', body: 'Test hvordan tallene endrer seg om renta stiger 1–3 %.', link: '/' },
            { icon: '⚖️', title: 'Skatt på utleie', body: 'Rentefradrag og 22 % kapitalskatt regnet riktig for 2026.', link: '/skatt-leieinntekter' },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-5" style={card}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">{f.body}</p>
              <Link href={f.link} className="text-sm text-purple-300 hover:text-purple-200 font-semibold">
                Les mer →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Hvorfor regne — text blocks */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Hvorfor regne før du kjøper utleiebolig?</h2>
          <p className="text-slate-400 leading-relaxed">
            Norske utleieinvesteringer feiler oftest på små marginer som glipper i tunge Excel-ark. Vi gjør jobben på 30 sekunder.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
          {[
            { h: 'Tall fra Finn på sekunder', p: 'Lim inn lenken — vi henter pris, fellesutgifter, areal og fellesgjeld automatisk fra annonsen.' },
            { h: 'Bygger inn norsk skatt', p: '22 % kapitalskatt, rentefradrag og dokumentavgift regnes som standard. Du kan overstyre alt.' },
            { h: 'Sammenlign på tvers', p: 'Lagre flere boliger i "Mine boliger" og se yield, ROI og kontantstrøm side om side.' },
            { h: 'Helt gratis, ingen login', p: 'Du eier dataene. Vi lagrer ingenting på server — alt skjer i din egen nettleser.' },
          ].map((b, i) => (
            <div key={i}>
              <h3 className="font-bold text-base mb-2">{b.h}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', ...purpleGlow }}>
            Start beregning <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
