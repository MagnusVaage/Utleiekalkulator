'use client';

import { useState } from 'react';

const cardBg = { background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.18)' };

export default function SelgeLead({ finn, kontekstAdresse }: { finn: string; kontekstAdresse: string }) {
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
        body: JSON.stringify({ telefon, adresse, kontekstFinn: finn, kontekstAdresse }),
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
        <p className="text-sm text-slate-600">En lokal megler tar kontakt med en gratis og uforpliktende verdivurdering.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5" style={cardBg}>
      <h3 className="font-bold mb-1">Vurderer du å selge?</h3>
      <p className="text-sm text-slate-600 mb-3">Skriv inn adressen din, så ordner vi en gratis, uforpliktende verdivurdering fra en lokal megler.</p>

      <form onSubmit={submit} className="flex flex-col gap-2.5 mt-1">
        <input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="Telefonnummer" type="tel" required
          className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={{ border: '1px solid rgba(15,23,42,0.15)' }} />
        <input value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="Adressen din, f.eks. Storgata 1, 0001 Oslo" required
          className="w-full px-3 py-2 rounded-lg text-sm bg-white" style={{ border: '1px solid rgba(15,23,42,0.15)' }} />
        <button type="submit" disabled={!canSubmit}
          className="text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-all hover:bg-blue-500 disabled:opacity-40"
          style={{ background: '#2563eb' }}>
          {status === 'sending' ? 'Sender…' : 'Få gratis verdivurdering →'}
        </button>
        {status === 'error' && <p className="text-xs text-red-600">Noe gikk galt. Prøv igjen om litt.</p>}
      </form>
    </div>
  );
}
