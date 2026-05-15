import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lønner det seg å leie ut bolig i 2026? | Utleiekalkulator",
  description:
    "Lønner det seg å leie ut bolig i Norge? Vi går gjennom yield, kontantstrøm, skatt og rentefradrag — og viser når utleie faktisk gir penger i lommen.",
  keywords: [
    "lønner det seg å leie ut",
    "lønner det seg å kjøpe utleiebolig",
    "utleiebolig lønnsomhet",
    "yield utleiebolig norge",
    "kontantstrøm utleiebolig",
  ],
  alternates: { canonical: "/lonner-det-seg-a-leie-ut" },
  openGraph: {
    title: "Lønner det seg å leie ut bolig i 2026?",
    description: "Komplett guide til lønnsomhet på utleiebolig — yield, skatt, rentefradrag og kontantstrøm.",
    url: "https://utleiekalkulatoren.no/lonner-det-seg-a-leie-ut",
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
            headline: "Lønner det seg å leie ut bolig i 2026?",
            description: "Komplett guide til lønnsomhet på utleiebolig — yield, skatt, rentefradrag og kontantstrøm.",
            inLanguage: "nb-NO",
            author: { "@type": "Organization", name: "Utleiekalkulator" },
            publisher: { "@type": "Organization", name: "Utleiekalkulator" },
          }),
        }}
      />

      <header className="px-6 py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-9 h-9" />
            <span className="font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/skatt-leieinntekter" className="hidden lg:inline text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Skatt
            </Link>
            <Link href="/egenkapital-utleiebolig" className="hidden lg:inline text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Egenkapital
            </Link>
            <Link href="/" className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
              🧮 Beregn lønnsomhet
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Guide til utleie</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Lønner det seg å leie ut bolig i 2026?
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Det korte svaret: <strong className="text-white">det kommer an på fire ting</strong> — kjøpesum, leieinntekt, rentenivå og skattefradrag. Her er hvordan du regner det ut for din situasjon.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong>Kort svar:</strong> I 2026 lønner utleie seg best for boliger med <strong className="text-blue-300">5 % eller høyere brutto yield</strong>, lavt belåningsbehov, og lang horisont. Et raskt eksempel: en leilighet til 3 mill. med 15&nbsp;000 kr/mnd i leie gir 6 % brutto yield — det er solid.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Brutto yield — det første du må vite</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Brutto yield er den årlige leieinntekten delt på kjøpesummen. Det er det første tallet alle utleieinvestorer ser på. En leilighet til 3 millioner kroner som du leier ut for 15&nbsp;000 kr/mnd gir <strong className="text-white">180&nbsp;000 / 3&nbsp;000&nbsp;000 = 6 %</strong>.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          I Norge regnes typisk:
        </p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Under 4 %</strong> — svakt, vanskelig å få lønnsomt</li>
          <li><strong className="text-white">4–5 %</strong> — middels, kan gå opp om du har god egenkapital</li>
          <li><strong className="text-white">5–6 %</strong> — solid, typisk for sentrale leiligheter</li>
          <li><strong className="text-white">Over 6 %</strong> — sterkt, ofte utenfor Oslo</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. Glem ikke kostnadene — netto yield betyr mer</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Brutto yield forteller deg ikke hva du sitter igjen med. Trekk fra felleskostnader, kommunale avgifter, eiendomsskatt, forsikring og vedlikehold. Felleskostnader alene kan spise opp 1–2 % i Oslo.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          En typisk leilighet med 6 % brutto yield ender ofte på <strong className="text-white">4–4,5 % netto yield</strong> etter alle løpende kostnader — men før skatt og renter.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">3. Rentefradrag — staten dekker 22 % av rentene</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Når du leier ut bolig som ikke er din primærbolig, kan du trekke fra alle renteutgiftene mot skatten. Staten refunderer 22 % av det du betalte i renter — penger du får tilbake på skatteoppgjøret.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Betaler du 10&nbsp;000 kr i renter hver måned, får du <strong className="text-white">26&nbsp;400 kr tilbake i året</strong>. Det er ofte forskjellen mellom positiv og negativ kontantstrøm.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">4. Kontantstrøm — det viktigste tallet for deg</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Kontantstrøm er det du faktisk har igjen hver måned etter at alt er betalt: leie minus felleskostnader, renter, avdrag, vedlikehold og skatt. Det er dette tallet du bør stille deg selv: <em>tåler jeg dette?</em>
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Mange utleieboliger har <strong className="text-white">negativ kontantstrøm de første årene</strong>. Det er ikke nødvendigvis dårlig — du betaler ned lånet, og verdiøkningen kommer på siden. Men du må kunne dekke underskuddet hver måned.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Når lønner det seg <em>ikke</em> å leie ut?</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li>Når yield er under 4 % og du har lite egenkapital</li>
          <li>Når boligen krever større oppussing — det spiser opp lønnsomheten</li>
          <li>Når du ikke har buffer til vedlikehold og perioder uten leietaker</li>
          <li>Når rentene stiger raskere enn leien</li>
        </ul>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Regn ut lønnsomheten på din bolig</h3>
          <p className="text-slate-300 text-sm mb-5">Lim inn en Finn.no-lenke eller skriv inn tallene selv — så får du yield, kontantstrøm og rentefradrag på sekunder.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
            Åpne kalkulatoren →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/skatt-leieinntekter" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Neste artikkel</p>
            <p className="font-semibold text-white">Hvor mye skatt betaler jeg på leieinntekter? →</p>
          </Link>
          <Link href="/egenkapital-utleiebolig" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hvor mye egenkapital trenger jeg? →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Utleiekalkulator · Ikke finansiell rådgivning
        </p>
      </footer>
    </div>
  );
}
