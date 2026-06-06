'use client';

import { useState } from 'react';

const cardBg = { background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.18)' };

export default function SelgeLead({ finn, kontekstAdresse }: { finn: string; kontekstAdresse: string }) {
  const [open, setOpen] = useState(false);
  const [navn, setNavn] = useState('');
  const [telefon, setTelefon] = useState('');
  const [adresse, setAdresse] = useState('');
  const [tidsperspektiv, setTidsperspektiv] = useState('');
  const [samtykke, setSamtykke] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const canSubmit = navn.trim() && telefon.trim() && samtykke && status !== 'sending';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, telefon, adresse, tidsperspektiv, kontekstFinn: finn, kontekstAdresse }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl p-5" style={cardBg}>
        <h3 className="font-bold mb-1">Takk! 🎉</h3>
        <p className="text-sm text-slate-600">Vi tar kontakt på telefon for å avtale en gratis og uforpliktende verdivurdering.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5" style={cardBg}>
      <h3 className="font-bold mb-1">Vurderer du å selge?</h3>
      <p className="text-sm text-slate-600 mb-3">Få en gratis, uforpliktende verdivurdering av boligen din fra en lokal megler.</p>

      {!open ? (
        <button onClick={() => setOpen(true)} className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
          Be om verdivurdering →
        </button>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2.5 mt-1">
          <input value={navn} onChange={e => setNavn(e.target.value)} placeholder="Navn" required
            className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={{ border: '1px solid rgba(15,23,42,0.15)' }} />
          <input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="Telefon" type="tel" required
            className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={{ border: '1px solid rgba(15,23,42,0.15)' }} />
          <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Adresse på boligen din (valgfritt)"
            className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={{ border: '1px solid rgba(15,23,42,0.15)' }} />
          <select value={tidsperspektiv} onChange={e => setTidsperspektiv(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={{ border: '1px solid rgba(15,23,42,0.15)', color: tidsperspektiv ? '#0f172a' : '#94a3b8' }}>
            <option value="">Når planlegger du å selge? (valgfritt)</option>
            <option value="0-3 mnd">Innen 3 måneder</option>
            <option value="3-6 mnd">3–6 måneder</option>
            <option value="6-12 mnd">6–12 måneder</option>
            <option value="Bare nysgjerrig">Bare nysgjerrig</option>
          </select>
          <label className="flex items-start gap-2 text-xs text-slate-500 leading-snug cursor-pointer">
            <input type="checkbox" checked={samtykke} onChange={e => setSamtykke(e.target.checked)} className="mt-0.5 shrink-0" />
            <span>Jeg samtykker til å bli kontaktet av en samarbeidende megler om verdivurdering. Se <a href="/personvern" className="underline">personvern</a>.</span>
          </label>
          <button type="submit" disabled={!canSubmit}
            className="text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-all hover:bg-blue-500 disabled:opacity-40"
            style={{ background: '#2563eb' }}>
            {status === 'sending' ? 'Sender…' : 'Send forespørsel'}
          </button>
          {status === 'error' && <p className="text-xs text-red-600">Noe gikk galt. Prøv igjen om litt.</p>}
        </form>
      )}
    </div>
  );
}
