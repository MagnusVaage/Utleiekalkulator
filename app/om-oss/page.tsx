'use client';

import { useState } from 'react';
import Link from 'next/link';

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const inputCls = 'w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500';
const inputStyle = { background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Tilbakemelding');
  const [message, setMessage] = useState('');
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 3) {
      setStatus('err'); setErrMsg('Skriv en melding.'); return;
    }
    if (honey) { setStatus('ok'); return; } // honeypot — stille drop
    setStatus('sending'); setErrMsg('');
    try {
      // Web3Forms free plan only accepts client-side submissions. The access
      // key is public (safe in client code) per Web3Forms' own docs.
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '202a9343-0ef1-47a2-9c06-104b6dcd87cd',
          subject: `[Utleiekalkulator] ${topic}`,
          from_name: 'Utleiekalkulator',
          name: name || 'Anonym',
          email: email || 'noreply@utleiekalkulatoren.no',
          message,
          botcheck: '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setStatus('err'); setErrMsg(data.message || 'Noe gikk galt.'); return; }
      setStatus('ok');
      setName(''); setEmail(''); setMessage('');
    } catch {
      setStatus('err'); setErrMsg('Nettverksfeil. Prøv igjen.');
    }
  };

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
            Til kalkulator
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Om oss</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Bygget av folk som regner på bolig hver dag
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Utleiekalkulator ble laget fordi vi var lei av å åpne et nytt Excel-ark hver gang vi vurderte en bolig.
        </p>

        <div className="rounded-2xl p-6 mb-10" style={cardStyle}>
          <h2 className="text-xl font-bold text-white mb-3">Hva vi gjør</h2>
          <p className="text-slate-300 leading-relaxed">
            Vi lager et gratis verktøy som hjelper folk å se om en utleiebolig faktisk lønner seg — før de byr.
            Tall hentes rett fra Finn-annonsen, skatt og rentefradrag regnes ut etter norske regler for 2026,
            og du kan stress-teste hva som skjer hvis renta stiger.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hvem står bak</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Bak Utleiekalkulator står en liten gruppe med bakgrunn fra revisjon, finans og eiendom. Vi har sett for mange
          gjøre tunge boligbeslutninger basert på magefølelse eller halve regnestykker — og ville lage noe som gjør
          jobben på 30 sekunder uten å koste en krone.
        </p>
        <p className="text-slate-300 leading-relaxed mb-8">
          Vi er ikke meglere og selger ingenting. Verktøyet er fritt tilgjengelig, uten registrering, og data du
          fyller inn forlater aldri din egen nettleser.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hvorfor det er gratis</h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Fordi god boligøkonomi ikke burde være forbeholdt de som har råd til rådgiver. Vi tjener ingenting på at du
          bruker kalkulatoren. På sikt vurderer vi enkle premium-funksjoner (eksport, porteføljeanalyse), men
          kjernen forblir gratis.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Kontakt oss</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Har du forslag, funnet en feil, eller ønsker spesielt tilrettelagt analyse for din situasjon? Send oss en
          melding — vi leser alt.
        </p>

        <form onSubmit={submit} className="rounded-2xl p-6 space-y-4" style={cardStyle}>
          <input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)}
            style={{ position: 'absolute', left: '-9999px' }} aria-hidden />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Navn (valgfritt)</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className={inputCls} style={inputStyle} placeholder="Ola Nordmann" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">E-post (valgfritt)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className={inputCls} style={inputStyle} placeholder="ola@eksempel.no" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hva gjelder det</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}
              className={inputCls} style={inputStyle}>
              <option>Tilbakemelding</option>
              <option>Ønske om tilrettelagt analyse</option>
              <option>Funnet en feil</option>
              <option>Forslag til ny funksjon</option>
              <option>Samarbeid</option>
              <option>Annet</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Melding *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} required
              className={inputCls} style={inputStyle} placeholder="Skriv her..." />
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500">Vi svarer som regel innen 1–2 dager.</p>
            <button type="submit" disabled={status === 'sending'}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
              style={{ background: '#2563eb' }}>
              {status === 'sending' ? 'Sender…' : 'Send melding'}
            </button>
          </div>

          {status === 'ok' && (
            <p className="text-emerald-400 text-sm font-medium">Takk! Meldingen er sendt — vi tar kontakt snart.</p>
          )}
          {status === 'err' && (
            <p className="text-red-400 text-sm font-medium">{errMsg}</p>
          )}
        </form>

        <div className="rounded-2xl p-6 mt-12" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-300 font-semibold text-sm hover:text-blue-200">
            ← Tilbake til kalkulatoren
          </Link>
        </div>
      </article>
    </div>
  );
}
