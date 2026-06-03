import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tilstandsrapport forklart — slik leser du den før du byr | Utleiekalkulator",
  description:
    "Komplett guide til tilstandsrapporten (boligsalgsrapporten): hva tilstandsgradene TG0–TG3 betyr, hvordan du leser den systematisk, hvilke avvik som koster mest, og spørsmålene du bør stille megler før budrunden.",
  keywords: [
    "tilstandsrapport",
    "tilstandsrapport forklart",
    "boligsalgsrapport",
    "tilstandsgrad",
    "tg0 tg1 tg2 tg3",
    "lese tilstandsrapport",
  ],
  alternates: { canonical: "/tilstandsrapport-forklart" },
  openGraph: {
    title: "Tilstandsrapport forklart — slik leser du den før du byr",
    description: "Alt om tilstandsgradene TG0–TG3, hva avvikene koster, og hva du spør megler om før budrunden.",
    url: "https://utleiekalkulatoren.no/tilstandsrapport-forklart",
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
            headline: "Tilstandsrapport forklart — slik leser du den før du byr",
            description: "Komplett guide til tilstandsrapporten: tilstandsgradene TG0–TG3, hva avvikene koster, og hva du spør megler om.",
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
                name: "Hva er en tilstandsrapport?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "En tilstandsrapport (boligsalgsrapport) er en grundig teknisk vurdering av boligen utført av en bygningssakkyndig. Den graderer tilstanden til de viktigste bygningsdelene fra TG0 til TG3 og beskriver avvik, konsekvenser og behov for tiltak.",
                },
              },
              {
                "@type": "Question",
                name: "Er tilstandsrapport det samme som takst?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Nei. En takst er en verdivurdering, mens en tilstandsrapport er en teknisk gjennomgang av byggets tilstand. Etter at avhendingsloven ble endret i 2022 er en grundig tilstandsrapport standard ved de fleste boligsalg.",
                },
              },
              {
                "@type": "Question",
                name: "Hvem betaler for tilstandsrapporten?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Selgeren bestiller og betaler for tilstandsrapporten før salget. Som kjøper får du den gratis som en del av salgsoppgaven, og du bør lese den nøye før du legger inn bud.",
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
            <Link href="/analyse" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 ml-1 sm:ml-2 whitespace-nowrap" style={{ background: '#2563eb' }}>
              Analyser salgsoppgave
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Hovedguide</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Tilstandsrapport forklart — slik leser du den før du byr
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Tilstandsrapporten er det viktigste dokumentet i hele salgsoppgaven. Den forteller deg hva som faktisk er galt med boligen — og dermed hva du egentlig betaler for. Denne guiden forklarer tilstandsgradene, hvordan du leser rapporten systematisk, og hva du bør spørre megler om før du byr.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.30)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-sky-300">Kort fortalt:</strong> Ikke se deg blind på antall avvik. Det som betyr noe er hva de mest alvorlige avvikene (TG2 og TG3) koster å utbedre, og om kostnaden allerede er trukket fra prisantydningen.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva er en tilstandsrapport?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          En tilstandsrapport — også kalt boligsalgsrapport — er en teknisk gjennomgang av boligen utført av en uavhengig bygningssakkyndig. Den vurderer tilstanden til de viktigste bygningsdelene, beskriver avvik og graderer hver del med en tilstandsgrad fra TG0 til TG3. Etter endringen i avhendingsloven i 2022 er en grundig tilstandsrapport blitt standard ved de fleste boligsalg, nettopp for å gi kjøper et bedre beslutningsgrunnlag og redusere konflikter etter salget.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Tilstandsgradene TG0–TG3</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">TG0</strong> — ingen avvik. Som nytt eller tilnærmet nytt.</li>
          <li><strong className="text-white">TG1</strong> — mindre avvik eller normal slitasje. Tiltak sjelden nødvendig på kort sikt.</li>
          <li><strong className="text-white">TG2</strong> — vesentlig avvik. Tiltak kan bli nødvendig, men ikke akutt.</li>
          <li><strong className="text-white">TG3</strong> — stort eller alvorlig avvik. Strakstiltak eller utbedring er nødvendig.</li>
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link href="/hva-betyr-tg1" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Dypdykk</p>
            <p className="font-semibold text-white">Hva betyr TG1? →</p>
          </Link>
          <Link href="/hva-betyr-tg2" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Dypdykk</p>
            <p className="font-semibold text-white">Hva betyr TG2? →</p>
          </Link>
          <Link href="/hva-betyr-tg3" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Dypdykk</p>
            <p className="font-semibold text-white">Hva betyr TG3? →</p>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Slik leser du rapporten systematisk</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          De fleste hopper rett til konklusjonen. Gjør heller dette, i rekkefølge:
        </p>
        <ol className="text-slate-300 leading-relaxed mb-6 ml-5 list-decimal flex flex-col gap-3">
          <li><strong className="text-white">Finn alle TG2 og TG3 først.</strong> Det er her pengene og risikoen ligger. Hopp over TG0 og TG1 i første runde.</li>
          <li><strong className="text-white">Les feltet «Konsekvens/tiltak» for hvert avvik.</strong> Det forteller deg om avviket er et alderstegn eller en påvist skade.</li>
          <li><strong className="text-white">Skill alder fra konsekvens.</strong> TG2 «på grunn av alder» er forutsigbart. TG2 eller TG3 med påvist skade kan eskalere.</li>
          <li><strong className="text-white">Summer opp utbedringskostnadene.</strong> Legg sammen de store postene og hold dem opp mot prisantydningen.</li>
          <li><strong className="text-white">Sjekk våtrom, drenering og tak ekstra nøye.</strong> Dette er de dyreste områdene å utbedre.</li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Avvikene som koster mest</h2>
        <p className="text-slate-300 leading-relaxed mb-4">Erfaringsmessig er det disse områdene som oftest gir store, kostbare avvik:</p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Bad og våtrom</strong> — membran, fall mot sluk, tetting. Totalrenovering 200 000–400 000 kr.</li>
          <li><strong className="text-white">Drenering og grunnmur</strong> — fuktinntrenging i rom under terreng. 150 000–350 000 kr.</li>
          <li><strong className="text-white">Tak og taktekking</strong> — omtekking kan passere 300 000 kr.</li>
          <li><strong className="text-white">Elektrisk anlegg</strong> — eldre anlegg uten dokumentasjon.</li>
          <li><strong className="text-white">Vinduer og dører</strong> — punkterte ruter og råte.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Spørsmål du bør stille megler</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <ul className="text-slate-300 leading-relaxed flex flex-col gap-3 text-sm">
            <li>«Hvilke TG2- og TG3-forhold mener dere er viktigst å være obs på?»</li>
            <li>«Finnes det kostnadsestimater for utbedring i rapporten?»</li>
            <li>«Er det gjort hulltaking eller fuktmåling på badet?»</li>
            <li>«Er de største avvikene hensyntatt i prisantydningen?»</li>
            <li>«Finnes dokumentasjon på tidligere utbedringer og oppgraderinger?»</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Tilstandsrapport og avhendingsloven</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Et forhold som er beskrevet i tilstandsrapporten regnes som «opplyst». Det betyr at du som kjøper i utgangspunktet ikke kan reklamere på avvik som allerede står i rapporten — du kjøpte boligen med kunnskap om dem. Derfor er det avgjørende å lese rapporten grundig <em>før</em> budrunden, ikke etter at budet er akseptert.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">La AI-en lese tilstandsrapporten for deg</h3>
          <p className="text-slate-300 text-sm mb-5">Lim inn Finn-lenken, så henter vi salgsoppgaven, leser hele tilstandsrapporten og gir deg hvert TG1-, TG2- og TG3-funn med ferdige spørsmål til megler — på sekunder.</p>
          <Link href="/analyse" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
            Analyser salgsoppgaven gratis →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/hva-betyr-tg2" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hva betyr TG2? →</p>
          </Link>
          <Link href="/hva-betyr-tg3" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hva betyr TG3? →</p>
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
