import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Slik beregnes det – metode og forutsetninger | Utleiekalkulator",
  description:
    "Slik regner Utleiekalkulator ut yield, kontantstrøm, lån og skatt. Full transparens om formler, satser og forutsetninger som ligger til grunn.",
  alternates: { canonical: "/slik-beregnes-det" },
  openGraph: {
    title: "Slik beregnes det – metode og forutsetninger",
    description: "Hvordan Utleiekalkulator regner: yield, kontantstrøm, lån og skatt — formler og forutsetninger.",
    url: "https://utleiekalkulatoren.no/slik-beregnes-det",
    type: "article",
  },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Slik beregnes det – metode og forutsetninger",
            description: "Hvordan Utleiekalkulator regner: yield, kontantstrøm, lån og skatt.",
            inLanguage: "nb-NO",
            author: { "@type": "Organization", name: "Utleiekalkulator" },
            publisher: { "@type": "Organization", name: "Utleiekalkulator" },
          }),
        }}
      />

      <header className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 ml-1 sm:ml-2 whitespace-nowrap" style={{ background: '#2563eb' }}>
              🧮 Tilbake til kalkulator
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Metode</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Slik beregnes det
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Full transparens om hvilke formler og satser som ligger bak tallene du ser i kalkulatoren.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={cardStyle}>
          <p className="text-white text-sm leading-relaxed">
            <strong>Kort sagt:</strong> Vi bruker standardformler fra norsk eiendomsanalyse og norske skatteregler for 2026. Du kan overstyre alle tall manuelt — kalkulatoren regner basert på det du fyller inn.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Yield (netto)</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Netto yield måler den årlige avkastningen på totalkostnaden, etter driftskostnader (men før skatt og finansiering).
        </p>
        <div className="rounded-xl p-4 mb-6 font-mono text-sm text-blue-200" style={cardStyle}>
          Netto yield = (årlig leie − årlige driftskostnader) / (kjøpssum + fellesgjeld) × 100&nbsp;%
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Driftskostnader inkluderer felleskostnader, kommunale avgifter, eiendomsskatt, vedlikehold, forsikring, wifi/strøm og evt. utleiemegler.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Kontantstrøm etter skatt</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Månedlig kontantstrøm er pengene som faktisk havner i lommen din etter alle utgifter — inkludert lån og skatt.
        </p>
        <div className="rounded-xl p-4 mb-6 font-mono text-sm text-blue-200" style={cardStyle}>
          Kontantstrøm = leie − driftskostnader − renter − avdrag − skatt
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Lånebetaling</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-white">Annuitetslån</strong>: lik månedlig betaling hele løpetiden. Mer renter i starten, mer avdrag mot slutten.
        </p>
        <div className="rounded-xl p-4 mb-4 font-mono text-xs text-blue-200" style={cardStyle}>
          Termin = lån × (r × (1+r)<sup>n</sup>) / ((1+r)<sup>n</sup> − 1)
        </div>
        <p className="text-slate-300 leading-relaxed mb-4">
          Der <em>r</em> er månedlig rente og <em>n</em> antall måneder. Du kan også velge serielån (fast avdrag) eller avdragsfritt.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Skatt på leieinntekt</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Vi bruker norsk kapitalskattesats på <strong className="text-white">22 %</strong> (sats for 2026). Skattegrunnlaget er:
        </p>
        <div className="rounded-xl p-4 mb-4 font-mono text-sm text-blue-200" style={cardStyle}>
          Skattbar inntekt = leie − driftskostnader − renter
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Avdrag er ikke fradragsberettiget. Rentefradraget gir deg 22 % av rentekostnadene tilbake via skatten.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Dokumentavgift</h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Beregnes som 2,5 % av kjøpesummen ved kjøp av selveierbolig. Gjelder ikke borettslag.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Estimert leieinntekt</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Hvis du ikke fyller inn månedsleie selv, foreslår vi et estimat basert på by, antall rom og bruksareal. Tallene tar utgangspunkt i markedsdata fra Oslo og er justert med faktorer for andre byer:
        </p>
        <ul className="text-slate-300 text-sm leading-relaxed space-y-1 mb-4 list-disc pl-5">
          <li>Oslo: 100 % (baseline)</li>
          <li>Bergen: 82 %</li>
          <li>Stavanger: 80 %</li>
          <li>Trondheim: 73 %</li>
          <li>Annet: 65 %</li>
        </ul>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Dette er estimater — sjekk alltid faktiske leiepriser på finn.no/hybel.no før du regner endelig.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Forutsetninger og begrensninger</h2>
        <ul className="text-slate-300 text-sm leading-relaxed space-y-2 mb-8 list-disc pl-5">
          <li>Kalkulatoren forutsetter at boligen leies ut som sekundærbolig (skatt fra første krone).</li>
          <li>Vi tar ikke høyde for verdistigning eller fremtidig salgsgevinst.</li>
          <li>Skattesatsen 22 % brukes flatt — formuesskatt er ikke inkludert.</li>
          <li>Estimerte leieinntekter er gjennomsnittstall og kan avvike fra ditt faktiske marked.</li>
          <li>Renteberegning bruker nominell rente; effektiv rente vises kun til orientering.</li>
        </ul>

        <div className="rounded-2xl p-6 mt-12" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <p className="text-white text-sm leading-relaxed mb-4">
            <strong>Ikke finansiell rådgivning.</strong> Kalkulatoren er et verktøy for å gjøre dine egne overslag — ikke en erstatning for profesjonell rådgivning fra megler, regnskapsfører eller bank.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-300 font-semibold text-sm hover:text-blue-200">
            ← Tilbake til kalkulatoren
          </Link>
        </div>
      </article>
    </div>
  );
}
