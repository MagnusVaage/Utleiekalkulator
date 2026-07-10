import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto px-4 sm:px-6 py-10"
      style={{ background: '#0a1424', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.svg" alt="" className="w-7 h-7" />
            <span className="font-extrabold text-white tracking-tight">Utleiekalkulator</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gratis verktøy for å regne ut om en utleiebolig lønner seg. Bygget av folk med bakgrunn fra revisjon, finans og eiendom.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Guider</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/lonner-det-seg-a-leie-ut" className="text-slate-300 hover:text-white transition-colors">Lønner det seg å leie ut?</Link></li>
            <li><Link href="/skatt-leieinntekter" className="text-slate-300 hover:text-white transition-colors">Skatt på utleie</Link></li>
            <li><Link href="/egenkapital-utleiebolig" className="text-slate-300 hover:text-white transition-colors">Egenkapitalkrav</Link></li>
            <li><Link href="/slik-beregnes-det" className="text-slate-300 hover:text-white transition-colors">Slik beregnes det</Link></li>
            <li><Link href="/utleie" className="text-slate-300 hover:text-white transition-colors">Leiepriser per by</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Selskap</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/om-oss" className="text-slate-300 hover:text-white transition-colors">Om oss og kontakt</Link></li>
            <li><Link href="/mine-boliger" className="text-slate-300 hover:text-white transition-colors">Mine boliger</Link></li>
            <li><Link href="/personvern" className="text-slate-300 hover:text-white transition-colors">Personvern</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p>© {new Date().getFullYear()} Utleiekalkulator. Ikke finansiell rådgivning.</p>
        <p>Laget i Norge</p>
      </div>
    </footer>
  );
}
