'use client';

import { useState, useRef } from 'react';

interface WfItem {
  label: string;
  value: number;
  type: string;
}

interface Result {
  score: number;
  label: string;
  labelColor: string;
  totalPrice: number;
  prisantydning: number;
  gjeld: number;
  bra: number;
  rooms: number;
  year: number;
  rent: number;
  fellesutg: number;
  monthlyCF: number;
  grossYield: number;
  netYield: number;
  equity: number;
  roeCash: number;
  paybackYears: number;
  loan: number;
  pmt: number;
  wf: WfItem[];
  address: string;
  title: string;
  energy: string;
  pricePerSqm: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat('nb-NO').format(Math.round(n));
}

function Gauge({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 80;
  const cx = 110;
  const cy = 110;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const totalArc = endAngle - startAngle;
  const filledArc = totalArc * (score / 100);

  const arcPath = (start: number, end: number) => {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleAngle = startAngle + filledArc;
  const nx = cx + (r - 10) * Math.cos(needleAngle);
  const ny = cy + (r - 10) * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="130" viewBox="0 0 220 130">
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke="#1e1e1e"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d={arcPath(startAngle, startAngle + filledArc)}
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="#fff" />
        <text x={cx} y={cy - 18} textAnchor="middle" fill="#fff" fontSize="32" fontWeight="bold" fontFamily="monospace">
          {score}
        </text>
        <text x="16" y="122" fill="#555" fontSize="10" fontFamily="monospace">0</text>
        <text x="200" y="122" fill="#555" fontSize="10" fontFamily="monospace">100</text>
      </svg>
      <div
        className="text-sm font-bold tracking-widest px-4 py-1 rounded"
        style={{ color, backgroundColor: color + '22', border: `1px solid ${color}44` }}
      >
        {label}
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  color = '#22d3ee',
}: {
  title: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#111] border border-[#222] rounded p-4 flex flex-col gap-1">
      <div className="text-[10px] text-[#666] uppercase tracking-wider">{title}</div>
      <div className="text-xl font-bold font-mono" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-[#444]">{sub}</div>}
    </div>
  );
}

function Waterfall({ items }: { items: WfItem[] }) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)));
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const pct = Math.abs(item.value) / max;
        const isNeg = item.value < 0;
        const isNet = item.type.startsWith('net');
        const color = isNet
          ? item.value >= 0
            ? '#22c55e'
            : '#ef4444'
          : isNeg
          ? '#f97316'
          : '#22d3ee';
        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="text-[11px] text-[#555] w-24 text-right shrink-0">{item.label}</div>
            <div className="flex-1 relative h-6 bg-[#111] rounded overflow-hidden">
              <div
                className="absolute top-0 h-full rounded transition-all duration-500"
                style={{
                  width: `${pct * 100}%`,
                  backgroundColor: color,
                  left: isNeg ? 'auto' : 0,
                  right: isNeg ? 0 : 'auto',
                  opacity: 0.85,
                }}
              />
            </div>
            <div
              className="text-[11px] font-mono w-20 text-right shrink-0"
              style={{ color }}
            >
              {isNeg ? '-' : '+'}{fmt(Math.abs(item.value))} kr
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreBar({ label, pts, max }: { label: string; pts: number; max: number }) {
  const pct = (pts / max) * 100;
  const color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444';
  return (
    <div className="flex items-center gap-3">
      <div className="text-[11px] text-[#555] w-28 shrink-0">{label}</div>
      <div className="flex-1 bg-[#111] h-3 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-[11px] font-mono text-[#666] w-12 text-right">
        {pts}/{max}
      </div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch {
      setError('Nettverksfeil. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const scoreBreakdown = result
    ? [
        { label: 'Brutto yield', pts: result.grossYield >= 8 ? 30 : result.grossYield >= 6 ? 22 : result.grossYield >= 5 ? 15 : result.grossYield >= 4 ? 8 : 3, max: 30 },
        { label: 'Kontantstrøm', pts: result.monthlyCF >= 3000 ? 20 : result.monthlyCF >= 1000 ? 15 : result.monthlyCF >= 0 ? 8 : 2, max: 20 },
        { label: 'Pris per kvm', pts: result.pricePerSqm < 50000 ? 20 : result.pricePerSqm < 75000 ? 14 : result.pricePerSqm < 100000 ? 8 : 3, max: 20 },
        { label: 'Byggeår', pts: result.year >= 2015 ? 10 : result.year >= 2000 ? 7 : result.year >= 1990 ? 5 : 2, max: 10 },
        { label: 'Fellesgjeld', pts: (result.gjeld / result.totalPrice) < 0.1 ? 10 : (result.gjeld / result.totalPrice) < 0.2 ? 7 : (result.gjeld / result.totalPrice) < 0.35 ? 4 : 1, max: 10 },
        { label: 'Antall rom', pts: result.rooms >= 3 ? 10 : result.rooms >= 2 ? 7 : 3, max: 10 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'monospace' }}>
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[#22c55e] font-bold tracking-widest text-sm">YIELDSCOUT</span>
          <span className="text-[#333] text-xs hidden sm:block">// Norsk eiendomsanalyse</span>
        </div>
        <div className="text-[10px] text-[#333] hidden sm:block">
          BETA · Oslo · Bergen · Stavanger · Trondheim
        </div>
      </header>

      {/* URL Input */}
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Lim inn Finn.no-lenke</h1>
          <p className="text-[#555] text-sm">Få øyeblikkelig analyse av lønnsomhet og deal score</p>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="https://www.finn.no/realestate/homes/ad.html?finnkode=..."
            className="flex-1 bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#22c55e] transition-colors"
          />
          <button
            onClick={analyze}
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-[#22c55e] text-black font-bold text-sm rounded hover:bg-[#16a34a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'ANALYSERER...' : 'ANALYSER'}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-[#ef4444] text-sm bg-[#ef444411] border border-[#ef444433] rounded px-4 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#555] text-sm">Henter data fra Finn.no...</div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div ref={resultRef} className="max-w-3xl mx-auto px-6 pb-16 flex flex-col gap-6">
          {/* Property header */}
          <div className="border border-[#1a1a1a] rounded p-4 bg-[#0d0d0d]">
            <div className="text-xs text-[#555] mb-1">{result.address}</div>
            <div className="text-white font-bold text-lg leading-snug">{result.title || 'Finn.no-annonse'}</div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="text-[#666]">{result.bra} m² · {result.rooms} rom · Bygget {result.year}</span>
              {result.energy && <span className="text-[#eab308]">Energi {result.energy}</span>}
            </div>
            <div className="flex flex-wrap gap-6 mt-3">
              <div>
                <div className="text-[10px] text-[#555] uppercase">Prisantydning</div>
                <div className="text-white font-bold">{fmt(result.prisantydning)} kr</div>
              </div>
              {result.gjeld > 0 && (
                <div>
                  <div className="text-[10px] text-[#555] uppercase">Fellesgjeld</div>
                  <div className="text-[#f97316] font-bold">{fmt(result.gjeld)} kr</div>
                </div>
              )}
              <div>
                <div className="text-[10px] text-[#555] uppercase">Totalpris</div>
                <div className="text-white font-bold">{fmt(result.totalPrice)} kr</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555] uppercase">Kr/kvm</div>
                <div className="text-white font-bold">{fmt(result.pricePerSqm)} kr</div>
              </div>
            </div>
          </div>

          {/* Gauge + metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="sm:col-span-1 flex justify-center bg-[#0d0d0d] border border-[#1a1a1a] rounded p-4">
              <Gauge score={result.score} label={result.label} color={result.labelColor} />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              <MetricCard
                title="Estimert mnd. leie"
                value={`${fmt(result.rent)} kr`}
                sub={`${fmt(result.rent / result.bra)} kr/kvm`}
                color="#22d3ee"
              />
              <MetricCard
                title="Månedlig overskudd"
                value={`${result.monthlyCF >= 0 ? '+' : ''}${fmt(result.monthlyCF)} kr`}
                sub={`${fmt(result.monthlyCF * 12)} kr/år`}
                color={result.monthlyCF >= 0 ? '#22c55e' : '#ef4444'}
              />
              <MetricCard
                title="Brutto yield"
                value={`${result.grossYield}%`}
                sub={`Netto ${result.netYield}%`}
                color={result.grossYield >= 6 ? '#22c55e' : result.grossYield >= 4 ? '#eab308' : '#ef4444'}
              />
              <MetricCard
                title="Egenkapital inn"
                value={`${fmt(result.equity)} kr`}
                sub="15% av totalpris"
                color="#a78bfa"
              />
              <MetricCard
                title="Avkastning på EK"
                value={`${result.roeCash}%`}
                sub="Kontantstrøm vs EK"
                color={result.roeCash >= 8 ? '#22c55e' : result.roeCash >= 4 ? '#eab308' : '#f97316'}
              />
              <MetricCard
                title="Nedbetalt på"
                value={result.paybackYears < 99 ? `${result.paybackYears} år` : '—'}
                sub="Tid til EK er tilbake"
                color="#f97316"
              />
            </div>
          </div>

          {/* Cashflow waterfall */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-5">
            <div className="text-xs text-[#555] uppercase tracking-wider mb-4">Månedlig kontantstrøm</div>
            <Waterfall items={result.wf} />
          </div>

          {/* Score breakdown */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-5">
            <div className="text-xs text-[#555] uppercase tracking-wider mb-4">
              Deal Score breakdown — {result.score}/100
            </div>
            <div className="flex flex-col gap-3">
              {scoreBreakdown.map((b) => (
                <ScoreBar key={b.label} {...b} />
              ))}
            </div>
          </div>

          {/* Forutsetninger */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-5">
            <div className="text-xs text-[#555] uppercase tracking-wider mb-3">Forutsetninger</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-[10px] text-[#555]">Belåning</div>
                <div className="text-white">85%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555]">Rente</div>
                <div className="text-white">5,25%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555]">Løpetid</div>
                <div className="text-white">25 år</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555]">Lån</div>
                <div className="text-white">{fmt(result.loan)} kr</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555]">Terminbeløp</div>
                <div className="text-white">{fmt(result.pmt)} kr/mnd</div>
              </div>
              <div>
                <div className="text-[10px] text-[#555]">Felleskost</div>
                <div className="text-white">{fmt(result.fellesutg)} kr/mnd</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[#333] text-xs pt-2">
            Leieestimater er optimistiske markedsanslag · Ikke finansiell rådgivning
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-[#1a1a1a] text-6xl mb-4">⌘</div>
          <div className="text-[#333] text-sm">Lim inn en Finn.no-lenke ovenfor for å starte analysen</div>
        </div>
      )}
    </div>
  );
}
