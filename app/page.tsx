'use client';

import { useState } from 'react';
import Link from 'next/link';

const card = { background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };
const blueGlow = { boxShadow: '0 10px 40px rgba(37,99,235,0.18), 0 0 0 1px rgba(37,99,235,0.25)' };

const SAMPLE = [
  { time: '2 min siden', addr: 'Thorvald Meyers gate 41', price: '4 850 000 kr', area: '52 m²', rooms: '2-roms', year: 1935, summary: 'Lys leilighet på Grünerløkka med oppusset bad og nyere kjøkken.' },
  { time: '6 min siden', addr: 'Bygdøy allé 12', price: '8 200 000 kr', area: '78 m²', rooms: '3-roms', year: 1924, summary: 'Klassisk Frogner-leilighet med stukkatur og høyt under taket.' },
  { time: '11 min siden', addr: 'Storgata 36, Trondheim', price: '3 100 000 kr', area: '45 m²', rooms: '2-roms', year: 2008, summary: 'Moderne leilighet sentralt i Trondheim med balkong mot sør.' },
  { time: '15 min siden', addr: 'Marken 18, Bergen', price: '4 400 000 kr', area: '61 m²', rooms: '3-roms', year: 1962, summary: 'Romslig leilighet i Bergen sentrum med god utsikt.' },
  { time: '22 min siden', addr: 'Kirkegata 9, Stavanger', price: '3 750 000 kr', area: '54 m²', rooms: '2-roms', year: 1998, summary: 'Velholdt leilighet nær sjøen med praktisk planløsning.' },
];

export default function Page() {
  const [url, setUrl] = useState('');

  const goAnalyse = () => {
    if (!url.trim()) return;
    window.location.href = `/analyse?finn=${encodeURIComponent(url.trim())}`;
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#f7f8fa' }}>
      {/* Header — pill nav */}
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-1 sm:gap-2 rounded-full px-2 py-1.5 flex-wrap justify-center"
            style={{ background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
            <Link href="/" className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full"
              style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)' }}>
              <img src="/logo.svg" alt="" className="w-6 h-6" />
              <span className="font-bold text-sm">Utleiekalkulator</span>
            </Link>
            <Link href="/analyse" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <span className="text-base leading-none">🔍</span> Analyser salgsoppgave
            </Link>
            <Link href="/kalkulator" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <span className="text-lg leading-none">＋</span> Kalkulator
            </Link>
            <Link href="/mine-boliger" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <span className="text-lg leading-none">⌂</span> Mine boliger
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-12 sm:pt-20 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-700 mb-6"
            style={{ background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.25)' }}>
            Boliganalyse for kjøpere og investorer
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] mb-6 text-slate-900">
            Forstå boligen<br />
            <span className="text-blue-600">før du byr</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Lim inn en Finn-lenke. Vi avdekker risiko i salgsoppgaven (TG2/TG3), gir deg spørsmål å stille megler,
            og regner yield og kontantstrøm — alt på sekunder.
          </p>

          {/* CTA card */}
          <div className="rounded-2xl p-2 mx-auto max-w-2xl" style={blueGlow}>
            <div className="rounded-xl flex flex-col sm:flex-row items-stretch gap-2 p-2"
              style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.25)' }}>
              <div className="flex-1 text-left px-3 py-2">
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Bolig-annonse</p>
                <input value={url} onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goAnalyse()}
                  placeholder="Lim inn Finn-lenke…"
                  className="w-full bg-transparent outline-none text-base text-slate-900 placeholder-slate-400 mt-0.5" />
              </div>
              <button onClick={goAnalyse}
                className="px-6 py-3 rounded-xl font-bold text-white whitespace-nowrap flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                Analyser bolig <span>→</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Du kan også <Link href="/analyse" className="text-blue-600 hover:text-blue-700 underline">laste opp salgsoppgaven (PDF)</Link> direkte.
            Verktøyet er et støtteverktøy og erstatter ikke profesjonell rådgivning — alle beslutninger må baseres på egen research.
          </p>
        </div>
      </section>

      {/* Andre analyserte nylig */}
      <section className="px-4 pt-8 pb-16 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-5">Andre analyserte nylig</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {SAMPLE.map((s, i) => (
            <div key={i} className="shrink-0 w-64 rounded-2xl overflow-hidden snap-start" style={card}>
              <div className="h-40 relative" style={{ background: `linear-gradient(135deg, hsl(${(i*47)%360},45%,82%), hsl(${(i*47+60)%360},45%,72%))` }}>
                <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-md text-slate-700"
                  style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' }}>{s.time}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm truncate">{s.addr}</p>
                <div className="flex justify-between text-sm mt-1.5">
                  <span className="font-bold text-slate-900">{s.price}</span>
                  <span className="text-slate-500">{s.area}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md text-slate-600"
                    style={{ background: 'rgba(15,23,42,0.05)', border: '1px solid rgba(15,23,42,0.1)' }}>{s.rooms}</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md text-slate-600"
                    style={{ background: 'rgba(15,23,42,0.05)', border: '1px solid rgba(15,23,42,0.1)' }}>Byggeår {s.year}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-3">{s.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alt du trenger før budrunden */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Alt du trenger før budrunden</h2>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Fra én Finn-lenke får du både risikobildet i salgsoppgaven og de økonomiske tallene. Helt gratis.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: '🔍', title: 'TG1, TG2 og TG3-funn', body: 'AI leser salgsoppgaven og henter ut alle avvik som krever oppfølging.', link: '/analyse' },
            { icon: '❓', title: 'Spør megler-liste', body: 'Konkrete spørsmål du bør stille megler om hvert funn, klare til visning.', link: '/analyse' },
            { icon: '📊', title: 'Yield og kontantstrøm', body: 'Brutto og netto avkastning, og hva du sitter igjen med per måned.', link: '/kalkulator' },
            { icon: '⚖️', title: 'Skatt og rentefradrag', body: '22 % kapitalskatt og rentefradrag regnet riktig for 2026.', link: '/skatt-leieinntekter' },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-5" style={card}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">{f.body}</p>
              <Link href={f.link} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Les mer →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Hvorfor analysere — text blocks */}
      <section className="px-4 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Hvorfor analysere før du kjøper?</h2>
          <p className="text-slate-500 leading-relaxed">
            De fleste boligkjøp feiler på detaljer som gjemmer seg i en 60-siders salgsoppgave. Vi gjør jobben på 30 sekunder.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
          {[
            { h: 'Avdekker skjult risiko', p: 'AI leser hele salgsoppgaven og løfter frem TG2- og TG3-avvik du ellers kan overse.' },
            { h: 'Forberedt til visning', p: 'Du får en ferdig liste med spørsmål å stille megler om akkurat denne boligen.' },
            { h: 'Tall fra Finn på sekunder', p: 'Lim inn lenken — vi henter pris, areal, fellesutgifter og regner yield og kontantstrøm.' },
            { h: 'Helt gratis, ingen login', p: 'Du eier dataene. Vi lagrer ingenting på server — alt skjer i din egen nettleser.' },
          ].map((b, i) => (
            <div key={i}>
              <h3 className="font-bold text-base mb-2">{b.h}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/analyse" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-transform hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', ...blueGlow }}>
            Start analyse <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
