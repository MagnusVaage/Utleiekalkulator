import type { Metadata } from "next";
import Link from "next/link";
import ArticleCTA from "../components/ArticleCTA";

export const metadata: Metadata = {
  title: "Hva koster det egentlig å kjøpe bolig? | Utleiekalkulator",
  description:
    "Egenkapital, dokumentavgift, tinglysing og månedlige boutgifter — her er den fulle oversikten over hva det koster å kjøpe bolig i Norge.",
  keywords: ["hva koster det å kjøpe bolig", "omkostninger boligkjøp", "dokumentavgift", "kostnader bolig", "boutgifter"],
  alternates: { canonical: "/hva-koster-det-a-kjope-bolig" },
  openGraph: {
    title: "Hva koster det egentlig å kjøpe bolig?",
    description: "Full oversikt over egenkapital, dokumentavgift, gebyrer og månedlige utgifter.",
    url: "https://utleiekalkulatoren.no/hva-koster-det-a-kjope-bolig",
    type: "article",
  },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "Hva koster det egentlig å kjøpe bolig?",
        description: "Full oversikt over kostnadene ved et boligkjøp i Norge.",
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
          <Link href="/dokumentavgift" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>Dokumentavgift</Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Kostnader</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Hva koster det egentlig å kjøpe bolig?</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Selve prisantydningen er bare én del av regnestykket. Her er den fulle oversikten over hva et boligkjøp koster — fra egenkapital og dokumentavgift til de månedlige utgiftene etterpå.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Egenkapital</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Den delen du dekker selv. Etter regelendringen kreves normalt minst <strong className="text-white">10 %</strong> av kjøpesummen. På en bolig til 3 millioner kroner betyr det 300 000 kroner.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. Dokumentavgift (2,5 %)</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          På <strong className="text-white">selveierbolig</strong> betaler du 2,5 % av kjøpesummen i dokumentavgift til staten ved tinglysing. På en bolig til 3 millioner blir det <strong className="text-white">75 000 kroner</strong>. <strong className="text-white">Borettslag og aksjeleiligheter har ingen dokumentavgift</strong> — der kjøper du en andel, ikke en tinglyst eiendom.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Tinglysingsgebyrer</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Det koster et fast gebyr (rundt 585 kr) å tinglyse skjøtet, og et tilsvarende gebyr for å tinglyse pantedokumentet hvis du tar opp lån. Småpenger i den store sammenhengen, men de skal med.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Månedlige boutgifter</h2>
        <p className="text-slate-300 leading-relaxed mb-4">Etter kjøpet kommer de løpende utgiftene:</p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Renter og avdrag</strong> på boliglånet</li>
          <li><strong className="text-white">Felleskostnader</strong> (i borettslag/sameie)</li>
          <li><strong className="text-white">Kommunale avgifter, forsikring og strøm</strong></li>
          <li><strong className="text-white">Vedlikehold</strong> — sett av litt fast hver måned</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Eksempel: bolig til 3 000 000 kr (selveier)</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <ul className="text-slate-300 leading-relaxed flex flex-col gap-2 text-sm">
            <li>Egenkapital (10 %): <strong className="text-white">300 000 kr</strong></li>
            <li>Dokumentavgift (2,5 %): <strong className="text-white">75 000 kr</strong></li>
            <li>Tinglysingsgebyrer: <strong className="text-white">~1 200 kr</strong></li>
            <li className="pt-2 border-t border-white/10">Kontantbehov ved kjøp: <strong className="text-white">~376 000 kr</strong> (i tillegg til lånet)</li>
          </ul>
        </div>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Regn ut omkostningene dine</h3>
          <p className="text-slate-300 text-sm mb-5">Bruk dokumentavgift-kalkulatoren og se totale omkostninger for akkurat din kjøpesum.</p>
          <Link href="/dokumentavgift" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>Åpne dokumentavgift-kalkulator →</Link>
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
        <ArticleCTA />
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Utleiekalkulator · Veiledende informasjon, ikke juridisk eller finansiell rådgivning</p>
      </footer>
    </div>
  );
}
