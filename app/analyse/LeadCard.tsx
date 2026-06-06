'use client';

import { useState } from 'react';

const cardBg = { background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.18)' };
const inputStyle = { border: '1px solid rgba(15,23,42,0.15)' };

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
  const [telefon, setTelefon] = useState('');
  const [adresse, setAdresse] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const canSubmit = telefon.trim().length > 3 && adresse.trim().length > 3 && status !== 'sending';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefon, adresse, kilde: variant, kontekstFinn: finn, kontekstAdresse }),
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
    <div className="rounded-2xl p-5" style={cardBg}>
      <h3 className="font-bold mb-1">{c.title}</h3>
      <p className="text-sm text-slate-600 mb-3">{c.desc}</p>

      {!open ? (
        <button onClick={() => setOpen(true)}
          className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
          {c.cta}
        </button>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2.5 mt-1">
          <input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="Telefonnummer" type="tel" required
            className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={inputStyle} />
          <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Adressen din, f.eks. Storgata 1, 0001 Oslo" required
            className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={inputStyle} />
          <button type="submit" disabled={!canSubmit}
            className="text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-all hover:bg-blue-500 disabled:opacity-40"
            style={{ background: '#2563eb' }}>
            {status === 'sending' ? 'Sender…' : c.cta}
          </button>
          {status === 'error' && <p className="text-xs text-red-600">Noe gikk galt. Prøv igjen om litt.</p>}
        </form>
      )}

      {c.disclaimer && <p className="text-xs text-slate-400 mt-3">{c.disclaimer}</p>}
    </div>
  );
}
