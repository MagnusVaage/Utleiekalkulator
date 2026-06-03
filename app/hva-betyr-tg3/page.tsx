import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hva betyr TG3 i tilstandsrapporten? | Utleiekalkulator",
  description:
    "TG3 er den alvorligste tilstandsgraden i en boligsalgsrapport. Vi forklarer hva TG3 betyr, hvorfor det krever strakstiltak, hva utbedring kan koste, og hvordan du bruker det i prisforhandling.",
  keywords: [
    "hva betyr tg3",
    "tg3 tilstandsrapport",
    "tilstandsgrad 3",
    "tg3 bad",
    "tg3 ved boligkjøp",
  ],
  alternates: { canonical: "/hva-betyr-tg3" },
  openGraph: {
    title: "Hva betyr TG3 i tilstandsrapporten?",
    description: "TG3 forklart enkelt — hvorfor det er alvorlig, hva det koster, og hvordan du bruker det i budrunden.",
    url: "https://utleiekalkulatoren.no/hva-betyr-tg3",
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
            headline: "Hva betyr TG3 i tilstandsrapporten?",
            description: "TG3 forklart — hvorfor det er alvorlig, hva det koster, og hvordan du bruker det i budrunden.",
            inLanguage: "nb-NO",
            author: { "@type": "Organization", name: "Utleiekalkulator" },
            publisher: { "@type": "Organization", name: "Utleiekalkulator" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Hva betyr TG3 i en tilstandsrapport?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "TG3 er den høyeste tilstandsgraden og betyr et stort eller alvorlig avvik der tiltak er nødvendig snarest. Det er påvist et forhold som enten allerede gir skade eller har høy risiko for å gjøre det, og som ofte er kostbart å utbedre.",
                },
              },
              {
                "@type": "Question",
                name: "Bør jeg droppe en bolig med TG3?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ikke nødvendigvis. Et enkelt TG3 på et gammelt bad er ofte forventet og kan prises inn. Det viktige er å vite hva utbedring koster, om det finnes flere TG3-punkter, og om kostnaden er hensyntatt i prisantydningen før du byr.",
                },
              },
            ],
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
            <Link href="/tilstandsrapport-forklart" className="text-xs sm:text-sm font-semibold text-sky-200 hover:text-white px-2 sm:px-3 py-2 rounded-lg transition-all whitespace-nowrap"
              style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.25)' }}>
              Tilstandsrapport
            </Link>
            <Link href="/analyse" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 ml-1 sm:ml-2 whitespace-nowrap" style={{ background: '#2563eb' }}>
              Analyser salgsoppgave
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Tilstandsgrader forklart</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Hva betyr TG3 i tilstandsrapporten?
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          <strong className="text-white">TG3 er den alvorligste tilstandsgraden</strong> — den bygningssakkyndige har funnet et stort avvik der tiltak er nødvendig snarest. Til forskjell fra TG2 er dette noe som enten allerede gir skade, eller har klar risiko for å gjøre det hvis ingenting gjøres.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.30)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-red-300">Kort fortalt:</strong> TG3 er ikke automatisk et stoppskilt, men det er det dyreste signalet i rapporten. Før du byr må du vite <em>hva</em> avviket er, <em>hva</em> utbedring koster, og om kostnaden allerede er trukket fra prisen.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">TG3 i forhold til de andre tilstandsgradene</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">TG0</strong> — ingen avvik. Som nytt.</li>
          <li><strong className="text-white">TG1</strong> — mindre avvik eller normal slitasje.</li>
          <li><strong className="text-white">TG2</strong> — vesentlig avvik. Tiltak kan bli nødvendig, men ikke akutt.</li>
          <li><strong className="text-white">TG3</strong> — stort eller alvorlig avvik. Strakstiltak eller utbedring er nødvendig.</li>
        </ul>
        <p className="text-slate-300 leading-relaxed mb-6">
          Sprangets fra TG2 til TG3 er det viktigste i hele rapporten: TG2 sier «følg med», TG3 sier «her må noe gjøres». Det er også det punktet der kostnadene oftest blir store nok til å påvirke hva boligen faktisk er verdt for deg.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva som typisk gir TG3</h2>
        <p className="text-slate-300 leading-relaxed mb-4">De vanligste årsakene til TG3 i norske boliger er:</p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Bad og våtrom over levetid</strong> — membran og tettesjikt som har passert forventet levetid, ofte med risiko for lekkasje</li>
          <li><strong className="text-white">Påvist fukt eller råte</strong> — i kjeller, krypkjeller, tak eller konstruksjoner</li>
          <li><strong className="text-white">Drenering som har sluttet å virke</strong> — fuktinntrenging i rom under terreng</li>
          <li><strong className="text-white">Tak med behov for omtekking</strong> — utett eller utslitt taktekking</li>
          <li><strong className="text-white">Alvorlige el- eller rørforhold</strong> — anlegg som ikke tilfredsstiller dagens krav</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva koster det å utbedre et TG3?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Det varierer enormt. Et TG3 på drenering kan koste 150 000–350 000 kr, en totalrenovering av bad ofte 200 000–400 000 kr, og omtekking av tak kan fort passere 300 000 kr. Mange tilstandsrapporter oppgir et grovt kostnadsestimat under «Konsekvens/tiltak» — finnes det ikke, bør du be megler om et, eller hente inn et uforpliktende tilbud fra en håndverker før budrunden.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Slik bruker du TG3 i budrunden</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <ul className="text-slate-300 leading-relaxed flex flex-col gap-3 text-sm">
            <li>«Hva er kostnadsestimatet for å utbedre dette TG3-forholdet?»</li>
            <li>«Er kostnaden hensyntatt i prisantydningen?»</li>
            <li>«Finnes det flere TG3-punkter, eller er dette det eneste?»</li>
            <li>«Er det innhentet tilbud fra håndverker på utbedringen?»</li>
            <li>«Hvor raskt må tiltaket gjøres — er det fare for følgeskader?»</li>
          </ul>
        </div>
        <p className="text-slate-300 leading-relaxed mb-6">
          Et dokumentert TG3 med kjent kostnad er et legitimt argument for et lavere bud. Selgeren vet at neste kjøper vil stille de samme spørsmålene, så et realistisk prisavslag basert på utbedringskostnaden er ofte fullt mulig.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">TG3 og avhendingsloven</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Et forhold som er beskrevet som TG3 i tilstandsrapporten regnes som «opplyst». Det betyr at du som kjøper i utgangspunktet ikke kan reklamere på akkurat dette i ettertid — du kjøpte boligen med kunnskap om avviket. Derfor er det avgjørende å lese hvert TG3 nøye <em>før</em> du byr, ikke etter.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Få alle TG3-funn på sekunder</h3>
          <p className="text-slate-300 text-sm mb-5">Lim inn Finn-lenken, så leser AI-en hele tilstandsrapporten, henter ut hvert TG1-, TG2- og TG3-funn og gir deg ferdige spørsmål til megler.</p>
          <Link href="/analyse" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
            Analyser salgsoppgaven gratis →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/hva-betyr-tg2" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hva betyr TG2? →</p>
          </Link>
          <Link href="/tilstandsrapport-forklart" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Hovedguide</p>
            <p className="font-semibold text-white">Tilstandsrapport forklart →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Utleiekalkulator · Veiledende informasjon, ikke juridisk eller bygningsteknisk rådgivning
        </p>
      </footer>
    </div>
  );
}
