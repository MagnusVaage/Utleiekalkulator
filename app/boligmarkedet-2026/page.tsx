import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boligmarkedet 2026 – priser, renter og prognose | Utleiekalkulator",
  description:
    "Hva skjer med boligprisene i 2026? Vi går gjennom prognosene, renteutviklingen og hva det betyr for deg som skal kjøpe bolig.",
  keywords: ["boligmarkedet 2026", "boligpriser 2026", "boligprognose", "renter 2026", "kjøpe bolig 2026"],
  alternates: { canonical: "/boligmarkedet-2026" },
  openGraph: {
    title: "Boligmarkedet 2026 – priser, renter og prognose",
    description: "Prognoser, renter og hva det betyr for deg som skal kjøpe bolig i 2026.",
    url: "https://utleiekalkulatoren.no/boligmarkedet-2026",
    type: "article",
  },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "Boligmarkedet 2026 – priser, renter og prognose",
        description: "Prognoser, renter og hva det betyr for boligkjøpere i 2026.",
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
          <Link href="/analyse" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>Analyser salgsoppgave</Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Boligmarkedet</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Boligmarkedet 2026 – priser, renter og prognose</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Skal du kjøpe bolig i 2026? Her er hovedtrekkene i prognosene: forventet prisvekst, renteutvikling og hva som driver markedet — så du vet hva du går til før du legger inn bud.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Forventet prisvekst i 2026</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Eiendom Norge venter en oppgang i boligprisene på rundt <strong className="text-white">6 prosent</strong> i 2026. Men snittet skjuler store geografiske forskjeller: byer som Stavanger, Bergen og Tromsø ventes å ha sterkere vekst enn landsgjennomsnittet, mens Oslo preges av at mange utleieboliger legges ut for salg. Prognoser er nettopp prognoser — de kan endre seg med rente og økonomi.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Renten – den viktigste jokeren</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Renten betyr mer for hva du har råd til enn selve boligprisen. For 2026 er det ventet mulige rentekutt, men også usikkerhet — enkelte analytikere ser for seg at renten kan holde seg høyere lenger. Et lite renteendring slår kraftig ut på månedskostnaden din, så regn alltid på lånet med litt margin.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva driver markedet?</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Rentenivået</strong> — påvirker hvor mye folk kan låne</li>
          <li><strong className="text-white">Reallønnsvekst</strong> — mer kjøpekraft løfter etterspørselen</li>
          <li><strong className="text-white">Lav boligbygging</strong> — få nye boliger gir press på prisene</li>
          <li><strong className="text-white">Endret egenkapitalkrav</strong> — kravet ble senket fra 15 % til 10 %, som slipper flere inn på markedet</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva betyr dette for deg som kjøper?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Et marked i moderat oppgang betyr at det fortsatt er konkurranse om de gode objektene, men ikke panikk. Det viktigste du kan gjøre er å være <em>godt forberedt</em>: vit hva du kan låne, hva boligen faktisk koster i drift, og hvilke risikoer som ligger i salgsoppgaven — før budrunden, ikke etter.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Sjekk boligen før du byr</h3>
          <p className="text-slate-300 text-sm mb-5">Lim inn en Finn-lenke, så leser AI-en salgsoppgaven og viser deg hva du bør være obs på. Gratis.</p>
          <Link href="/analyse" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>Analyser salgsoppgaven gratis →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/boliglanskalkulator" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Verktøy</p>
            <p className="font-semibold text-white">Boliglånskalkulator →</p>
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
