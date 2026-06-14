import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "De vanligste tabbene ved boligkjøp – og hvordan du unngår dem | Utleiekalkulator",
  description:
    "Fra å hoppe over salgsoppgaven til å glemme omkostningene — her er de vanligste feilene folk gjør når de kjøper bolig, og hvordan du unngår dem.",
  keywords: ["feil ved boligkjøp", "tabber boligkjøp", "boligkjøp tips", "ting å sjekke før boligkjøp", "budrunde feil"],
  alternates: { canonical: "/vanligste-tabbene-ved-boligkjop" },
  openGraph: {
    title: "De vanligste tabbene ved boligkjøp – og hvordan du unngår dem",
    description: "De vanligste feilene ved boligkjøp, og hvordan du unngår dem.",
    url: "https://utleiekalkulatoren.no/vanligste-tabbene-ved-boligkjop",
    type: "article",
  },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "De vanligste tabbene ved boligkjøp – og hvordan du unngår dem",
        description: "De vanligste feilene ved boligkjøp og hvordan du unngår dem.",
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
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Boligkjøp</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">De vanligste tabbene ved boligkjøp</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Et boligkjøp er ofte den største økonomiske beslutningen i livet — og det er lett å la følelsene styre. Her er feilene folk oftest gjør, og hvordan du unngår dem.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Å ikke lese salgsoppgaven nøye</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Den vanligste — og dyreste — tabben. Salgsoppgaven og tilstandsrapporten forteller deg hva som faktisk er galt med boligen (TG2- og TG3-avvik). Hopper du over dette, kan du ende opp med et bad eller drenering som koster hundretusener å utbedre. Les den <em>før</em> budrunden, ikke etter.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. Å glemme omkostningene</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Mange budsjetterer kun for kjøpesummen og glemmer dokumentavgift (2,5 %), tinglysingsgebyrer og månedlige boutgifter. Plutselig mangler det titusener. Regn alltid med omkostningene på toppen av egenkapitalen.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Å by mer enn man har råd til</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          I en hektisk budrunde er det lett å la seg rive med. Sett en absolutt maksgrense <em>før</em> du starter, basert på hva du faktisk tåler å betale i måneden — også hvis renten stiger. Hold deg til den.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Å stole blindt på «pent oppusset»</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Et nytt kjøkken skjuler ikke nødvendigvis et bad uten membran eller skjult fukt. La tilstandsrapporten — ikke styling-bildene — avgjøre hva boligen er verdt.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Å ikke stille megler de riktige spørsmålene</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Megleren jobber for selger. Still konkrete spørsmål om hvert avvik: Er det gjort fuktmåling? Finnes kostnadsestimat for utbedring? Er forholdet hensyntatt i prisantydningen? Gode spørsmål kan spare deg for store summer.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Unngå den dyreste tabben</h3>
          <p className="text-slate-300 text-sm mb-5">Lim inn Finn-lenken, så leser AI-en salgsoppgaven, finner avvikene og gir deg ferdige spørsmål til megler. Gratis.</p>
          <Link href="/analyse" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>Analyser salgsoppgaven gratis →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/tilstandsrapport-forklart" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Tilstandsrapport forklart →</p>
          </Link>
          <Link href="/hva-koster-det-a-kjope-bolig" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hva koster det å kjøpe bolig? →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Utleiekalkulator · Veiledende informasjon, ikke juridisk eller finansiell rådgivning</p>
      </footer>
    </div>
  );
}
