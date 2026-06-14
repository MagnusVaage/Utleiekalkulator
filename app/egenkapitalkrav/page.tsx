import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nytt egenkapitalkrav: 10 % i stedet for 15 % | Utleiekalkulator",
  description:
    "Egenkapitalkravet ved boligkjøp ble senket fra 15 % til 10 %. Vi forklarer hva endringen betyr, hvor mye du faktisk trenger, og hva banken ser etter.",
  keywords: ["egenkapitalkrav", "egenkapital bolig", "10 prosent egenkapital", "hvor mye egenkapital", "utlånsforskriften"],
  alternates: { canonical: "/egenkapitalkrav" },
  openGraph: {
    title: "Nytt egenkapitalkrav: 10 % i stedet for 15 %",
    description: "Hva den nye regelen betyr, hvor mye du trenger, og hva banken ser etter.",
    url: "https://utleiekalkulatoren.no/egenkapitalkrav",
    type: "article",
  },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: "Nytt egenkapitalkrav: 10 % i stedet for 15 %",
        description: "Hva endringen i egenkapitalkravet betyr for boligkjøpere.",
        inLanguage: "nb-NO",
        author: { "@type": "Organization", name: "Utleiekalkulator" },
        publisher: { "@type": "Organization", name: "Utleiekalkulator" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Hvor mye egenkapital trenger jeg for å kjøpe bolig?", acceptedAnswer: { "@type": "Answer", text: "Etter regelendringen kreves det normalt minst 10 % egenkapital. På en bolig til 3 millioner kroner tilsvarer det 300 000 kroner. Banken vurderer i tillegg om du tåler renteøkning." } },
          { "@type": "Question", name: "Når ble egenkapitalkravet endret til 10 %?", acceptedAnswer: { "@type": "Answer", text: "Kravet ble senket fra 15 % til 10 % i 2025, da maksimal belåningsgrad økte fra 85 % til 90 % av boligens verdi." } },
        ],
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
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Egenkapital</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Nytt egenkapitalkrav: 10 % i stedet for 15 %</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          En av de største endringene for boligkjøpere de siste årene: egenkapitalkravet ble senket fra 15 % til <strong className="text-white">10 %</strong>. Det betyr at du trenger mindre oppspart for å komme inn på markedet. Her er hva det faktisk betyr.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva er egenkapitalkravet?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Egenkapital er den delen av kjøpesummen du dekker selv, uten lån. Tidligere måtte banken normalt ikke låne deg mer enn 85 % av boligens verdi — du måtte altså stille med 15 % selv. Etter endringen er maksimal belåningsgrad økt til 90 %, slik at kravet til egenkapital er 10 %.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hvor mye må du ha? (eksempler)</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <ul className="text-slate-300 leading-relaxed flex flex-col gap-2 text-sm">
            <li>Bolig til <strong className="text-white">2 000 000 kr</strong> → 10 % = <strong className="text-white">200 000 kr</strong></li>
            <li>Bolig til <strong className="text-white">3 000 000 kr</strong> → 10 % = <strong className="text-white">300 000 kr</strong></li>
            <li>Bolig til <strong className="text-white">4 500 000 kr</strong> → 10 % = <strong className="text-white">450 000 kr</strong></li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Egenkapital er ikke det eneste banken ser på</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Selv med 10 % egenkapital må du tåle lånet. Banken regner med at lånet normalt ikke kan overstige fem ganger samlet inntekt, og at du tåler en renteøkning på 3 prosentpoeng. Så både oppspart egenkapital <em>og</em> betjeningsevne avgjør hvor mye du får låne.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Husk omkostningene på toppen</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Egenkapital dekker bare deler av kjøpet. I tillegg kommer dokumentavgift (2,5 % på selveierbolig) og tinglysingsgebyrer. Det er lurt å regne med disse i tillegg til egenkapitalen når du planlegger budsjettet.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Hvor mye kan du låne?</h3>
          <p className="text-slate-300 text-sm mb-5">Bruk boliglånskalkulatoren og se hvilken boligpris egenkapitalen din rekker til.</p>
          <Link href="/boliglanskalkulator" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>Åpne boliglånskalkulator →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/dokumentavgift" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Verktøy</p>
            <p className="font-semibold text-white">Dokumentavgift-kalkulator →</p>
          </Link>
          <Link href="/boligmarkedet-2026" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Boligmarkedet 2026 →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Utleiekalkulator · Veiledende informasjon, ikke juridisk eller finansiell rådgivning</p>
      </footer>
    </div>
  );
}
