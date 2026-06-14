import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Renteutvikling 2026 – hva betyr det for boliglånet? | Utleiekalkulator",
  description:
    "Hva skjer med boliglånsrenten i 2026? Vi forklarer renteprognosene og hvordan selv en liten renteendring påvirker hva du betaler i måneden.",
  keywords: ["renteutvikling 2026", "boliglånsrente 2026", "renteprognose", "styringsrente", "rente bolig"],
  alternates: { canonical: "/renteutvikling-2026" },
  openGraph: {
    title: "Renteutvikling 2026 – hva betyr det for boliglånet?",
    description: "Renteprognosene for 2026 og hvordan de påvirker månedskostnaden din.",
    url: "https://utleiekalkulatoren.no/renteutvikling-2026",
    type: "article",
  },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "Renteutvikling 2026 – hva betyr det for boliglånet?",
        description: "Renteprognosene for 2026 og effekten på månedskostnaden.",
        inLanguage: "nb-NO",
        author: { "@type": "Organization", name: "Utleiekalkulator" },
        publisher: { "@type": "Organization", name: "Utleiekalkulator" },
      }) }} />

      <header className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur" style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <Link href="/boliglanskalkulator" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>Boliglånskalkulator</Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Rente</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Renteutvikling 2026 – hva betyr det for boliglånet?</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Renten avgjør hva boligen faktisk koster deg hver måned — ofte mer enn selve prisen. Her er hovedtrekkene i renteprognosene for 2026, og hvorfor selv en liten endring betyr mye.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva er ventet i 2026?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Flere analytikere venter at styringsrenten kan settes ned i løpet av 2026, men bildet er usikkert — noen ser også for seg at renten kan holde seg på dagens nivå lenger. Boliglånsrenten følger styringsrenten med litt forsinkelse, så det du betaler endrer seg ikke umiddelbart. Ingen kan spå renten sikkert, så planlegg med margin.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hvor mye betyr ett prosentpoeng?</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          På et lån på 3 millioner kroner over 25 år utgjør ett prosentpoeng i rente grovt regnet <strong className="text-white">1 500–1 800 kroner mer per måned</strong>. Det er derfor banken stresstester deg med en renteøkning på 3 prosentpoeng før de gir lån — for å sjekke at du tåler en oppgang.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Nominell vs. effektiv rente</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Banken oppgir gjerne <strong className="text-white">nominell rente</strong>, men det er den <strong className="text-white">effektive renten</strong> som viser hva lånet faktisk koster — den inkluderer gebyrer og rentes rente. Sammenlign alltid effektiv rente når du vurderer tilbud fra ulike banker.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva bør du gjøre?</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li>Regn på lånet med <strong className="text-white">høyere rente enn dagens</strong> — så er du trygg hvis den stiger</li>
          <li>Be om tilbud fra flere banker og sammenlign <strong className="text-white">effektiv rente</strong></li>
          <li>Vurder om du bør be om bedre betingelser når boligverdien har steget</li>
        </ul>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Se hva lånet koster deg</h3>
          <p className="text-slate-300 text-sm mb-5">Juster rente og nedbetalingstid i boliglånskalkulatoren og se månedskostnaden med en gang.</p>
          <Link href="/boliglanskalkulator" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>Åpne boliglånskalkulator →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/boligmarkedet-2026" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Boligmarkedet 2026 →</p>
          </Link>
          <Link href="/egenkapitalkrav" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Nytt egenkapitalkrav: 10 % →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Utleiekalkulator · Veiledende informasjon, ikke juridisk eller finansiell rådgivning</p>
      </footer>
    </div>
  );
}
