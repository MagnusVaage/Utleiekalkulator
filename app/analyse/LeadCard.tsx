'use client';

import { useState } from 'react';

const cardBg = { background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.18)' };
const inputStyle = { border: '1px solid rgba(15,23,42,0.15)' };
// Fixed height so both inputs are exactly aligned.
const inputClass = 'w-full h-12 px-4 rounded-xl text-sm bg-white outline-none focus:border-blue-400';
// The money button — big, gradient, slight lift on hover.
const btnClass = 'w-full text-center font-bold text-white px-5 py-3.5 rounded-xl text-base transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100';
const btnStyle = { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 8px 22px rgba(37,99,235,0.45)' };

type Variant = 'selge' | 'rente';

const COPY: Record<Variant, { title: string; desc: string; cta: string; disclaimer?: string; takk: string }> = {
  selge: {
    title: 'Vurderer du å selge boligen din?',
    desc: 'Få gratis og uforpliktende tilbud fra opptil 3 lokale eiendomsmeglere.',
    cta: 'Få tilbud →',
    takk: 'Inntil 3 lokale meglere tar kontakt med et uforpliktende tilbud.',
  },
  rente: {
    title: 'Betaler du for mye i rente?',
    desc: 'En oppdatert boligverdi kan gi lavere rente. Få verdivurdering fra opptil 3 lokale meglere.',
    cta: 'Få verdivurdering →',
    disclaimer: 'Meglere kan ta vederlag for verdivurdering hvis du ikke planlegger å selge.',
    takk: 'Inntil 3 lokale meglere tar kontakt for å avtale verdivurdering.',
  },
};

export default function LeadCard({ variant, finn, kontekstAdresse }: { variant: Variant; finn: string; kontekstAdresse: string }) {
  const c = COPY[variant];
  const [open, setOpen] = useState(false);
  const [adresse, setAdresse] = useState('');
  const [telefon, setTelefon] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const canSubmit = adresse.trim().length > 3 && telefon.trim().length > 3 && status !== 'sending';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adresse, telefon, kilde: variant, kontekstFinn: finn, kontekstAdresse }),
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
        <p className="text-sm text-slate-600">{c.takk}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 relative" style={cardBg}>
      {open && (
        <button onClick={() => setOpen(false)} aria-label="Lukk"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors text-lg leading-none">
          ×
        </button>
      )}
      <h3 className="font-bold mb-1 pr-7">{c.title}</h3>
      <p className="text-sm text-slate-600 mb-3">{c.desc}</p>

      {!open ? (
        <button onClick={() => setOpen(true)} className={btnClass} style={btnStyle}>
          {c.cta}
        </button>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2.5 mt-1">
          <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Postadresse" required
            className={inputClass} style={inputStyle} />
          <input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="Telefonnummer" type="tel" required
            className={inputClass} style={inputStyle} />
          <button type="submit" disabled={!canSubmit} className={btnClass} style={btnStyle}>
            {status === 'sending' ? 'Sender…' : c.cta}
          </button>
          {status === 'error' && <p className="text-xs text-red-600">Noe gikk galt. Prøv igjen om litt.</p>}
        </form>
      )}

      {c.disclaimer && <p className="text-xs text-slate-400 mt-3">{c.disclaimer}</p>}
    </div>
  );
}
