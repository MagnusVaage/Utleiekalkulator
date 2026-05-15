import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Skatt på leieinntekter 2026 — hva må du betale? | Utleiekalkulator",
  description:
    "Hvor mye skatt betaler du på leieinntekter i Norge? Vi går gjennom skattefri utleie, 22 %-regelen, rentefradrag og fradrag du har krav på — med konkrete eksempler.",
  keywords: [
    "skatt på leieinntekter",
    "skatt utleiebolig",
    "skattefri utleie",
    "rentefradrag utleie",
    "leieinntekter skatt 2026",
  ],
  alternates: { canonical: "/skatt-leieinntekter" },
  openGraph: {
    title: "Skatt på leieinntekter 2026",
    description: "Komplett guide til skatt på utleie — fra skattefri til full kapitalinntekt.",
    url: "https://utleiekalkulatoren.no/skatt-leieinntekter",
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
            headline: "Skatt på leieinntekter 2026 — hva må du betale?",
            description: "Komplett guide til skatt på utleie — fra skattefri til full kapitalinntekt.",
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
            <Link href="/lonner-det-seg-a-leie-ut" className="hidden lg:inline text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Lønner det seg?
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
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Guide til skatt</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Skatt på leieinntekter — hva må du faktisk betale?
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Leieinntekter beskattes som <strong className="text-white">22 % kapitalinntekt</strong> i Norge — men det finnes mange unntak og fradrag som kan redusere skatten betraktelig. Her er det viktigste å vite.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-emerald-300">Skattefri utleie:</strong> Leier du ut <strong>mindre enn halvparten</strong> av din egen primærbolig (målt i utleieverdi), er inntekten <strong>helt skattefri</strong>. Dette er den beste skatteordningen som finnes.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Tre ulike skatteregler — hvilken gjelder for deg?</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">1. Skattefri utleie (egen bolig)</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Bor du selv i boligen og leier ut en del av den (f.eks. utleiedel i kjeller, hybel eller ett rom), er leieinntekten skattefri — så lenge utleiedelen utgjør mindre enn halvparten av boligens utleieverdi.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Du trenger ikke engang oppgi inntekten på skattemeldingen. Dette er Norges mest gunstige skatteregel for boligeiere.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">2. Sekundærbolig (vanlig utleiebolig)</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Eier du en bolig som du leier ut hele, og selv bor et annet sted, betaler du <strong className="text-white">22 % skatt</strong> på netto leieinntekt. Netto betyr <em>etter</em> at du har trukket fra alle utgifter.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">Det du kan trekke fra:</p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li>Renteutgifter på lånet</li>
          <li>Felleskostnader (det meste)</li>
          <li>Kommunale avgifter og eiendomsskatt</li>
          <li>Forsikring</li>
          <li>Vedlikehold (ikke påkostninger)</li>
          <li>Strøm og internett om du betaler det</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">3. Korttidsutleie (Airbnb)</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Leier du ut korttid (under 30 dager om gangen) for mer enn 10&nbsp;000 kr i året, regnes det som <strong className="text-white">virksomhet</strong>. Da kan både MVA og høyere skatt slå inn. Reglene er strengere — sjekk med regnskapsfører.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Eksempel: Hva betaler en typisk utleier?</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <p className="text-slate-300 leading-relaxed mb-3">Leilighet til 4 mill., 15&nbsp;000 kr/mnd i leie:</p>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-slate-300"><span>Bruttoinntekt</span><span>180&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-400"><span>– Renter (3 mill. lån, 5,5 %)</span><span>–165&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-400"><span>– Felleskostnader</span><span>–36&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-400"><span>– Vedlikehold</span><span>–10&nbsp;000 kr</span></div>
            <div className="flex justify-between text-white font-semibold pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}><span>Netto skattepliktig</span><span>–31&nbsp;000 kr</span></div>
            <div className="flex justify-between text-emerald-300 font-semibold pt-2"><span>Skatt (22 % av negativ inntekt)</span><span>+6&nbsp;820 kr tilbake</span></div>
          </div>
          <p className="text-slate-400 text-xs mt-4">Eksempelet viser et typisk utleieoppsett der utgiftene overstiger inntekten — som gir penger tilbake på skatten i stedet for skatt å betale.</p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Slik fungerer rentefradraget i praksis</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Rentefradraget er det viktigste enkeltfradraget for de fleste utleiere. Du får 22 % tilbake av alt du betaler i renter, både på utleieboligen og på din egen primærbolig.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Betaler du <strong className="text-white">200&nbsp;000 kr i renter</strong> samlet i året, får du <strong className="text-white">44&nbsp;000 kr tilbake</strong> via skatteoppgjøret. Dette gjør at mange utleieboliger faktisk gir penger tilbake på skatten, ikke skatt å betale.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Husk: Gevinstbeskatning ved salg</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Selger du en utleiebolig med gevinst, må du betale <strong className="text-white">22 % skatt på gevinsten</strong>. Unntaket er hvis du har bodd selv i boligen i minst 12 av de siste 24 månedene — da er gevinsten skattefri. Dette er noe mange glemmer, men det kan utgjøre hundretusener.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Se din skatt på sekunder</h3>
          <p className="text-slate-300 text-sm mb-5">Kalkulatoren regner ut rentefradrag, skatt og netto kontantstrøm automatisk — tilpasset din situasjon.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
            Åpne kalkulatoren →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/lonner-det-seg-a-leie-ut" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Lønner det seg å leie ut bolig? →</p>
          </Link>
          <Link href="/egenkapital-utleiebolig" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Neste artikkel</p>
            <p className="font-semibold text-white">Hvor mye egenkapital trenger jeg? →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Utleiekalkulator · Ikke finansiell eller skattefaglig rådgivning
        </p>
      </footer>
    </div>
  );
}
