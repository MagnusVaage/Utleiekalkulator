import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hva betyr TG2 i tilstandsrapporten? | Utleiekalkulator",
  description:
    "TG2 er den vanligste tilstandsgraden i en boligsalgsrapport. Vi forklarer hva TG2 betyr, forskjellen på TG2 av alder og TG2 med konsekvens, og hvilke spørsmål du bør stille megler før du byr.",
  keywords: [
    "hva betyr tg2",
    "tg2 tilstandsrapport",
    "tilstandsgrad 2",
    "tg2 bad",
    "tg2 ved boligkjøp",
  ],
  alternates: { canonical: "/hva-betyr-tg2" },
  openGraph: {
    title: "Hva betyr TG2 i tilstandsrapporten?",
    description: "TG2 forklart enkelt — hva det betyr, når du bør være obs, og hva du spør megler om.",
    url: "https://utleiekalkulatoren.no/hva-betyr-tg2",
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
            headline: "Hva betyr TG2 i tilstandsrapporten?",
            description: "TG2 forklart — hva det betyr, når du bør være obs, og hva du spør megler om.",
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
                name: "Hva betyr TG2 i en tilstandsrapport?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "TG2 betyr at den bygningssakkyndige har funnet et vesentlig avvik. Det er ikke akutt som TG3, men det er noe som med tiden vil kreve tiltak eller utbedring, og som du bør ta høyde for i prisen.",
                },
              },
              {
                "@type": "Question",
                name: "Er TG2 farlig ved boligkjøp?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Nei, TG2 i seg selv er ikke farlig — det er den vanligste tilstandsgraden, og de fleste brukte boliger har flere TG2-punkter. Det viktige er å forstå hva som ligger bak hvert TG2 og hva utbedring vil koste.",
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
          Hva betyr TG2 i tilstandsrapporten?
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          <strong className="text-white">TG2 betyr et vesentlig avvik</strong> — noe den bygningssakkyndige mener bør følges opp, men som ikke krever strakstiltak slik TG3 gjør. Det er den klart vanligste tilstandsgraden, og nesten alle brukte boliger har flere TG2-punkter.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(234,88,12,0.10)', border: '1px solid rgba(234,88,12,0.30)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-orange-300">Kort fortalt:</strong> TG2 er ikke et stoppskilt. Det er et signal om at du bør forstå <em>hva</em> avviket er, <em>hvorfor</em> det er gradert TG2, og <em>hva</em> det koster å utbedre — før du legger inn bud.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Tilstandsgradene fra TG0 til TG3</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">TG0</strong> — ingen avvik. Som nytt eller tilnærmet nytt.</li>
          <li><strong className="text-white">TG1</strong> — mindre avvik eller normal slitasje. Tiltak er som regel ikke nødvendig på kort sikt.</li>
          <li><strong className="text-white">TG2</strong> — vesentlig avvik. Tiltak kan bli nødvendig, men ikke akutt.</li>
          <li><strong className="text-white">TG3</strong> — stort eller alvorlig avvik. Strakstiltak eller utbedring er nødvendig.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">To typer TG2 — og hvorfor forskjellen er viktig</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Det samme TG2-merket kan bety to ganske forskjellige ting. Lær deg å skille dem, for det avgjør hvor bekymret du bør være:
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">1. TG2 på grunn av alder</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Mange TG2-er handler bare om at en bygningsdel har nådd eller passert forventet levetid — for eksempel et bad fra 2005 eller vinduer fra 90-tallet. Det er ikke påvist en konkret skade, men alderen tilsier at utskifting nærmer seg. Dette er normalt og forutsigbart.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">2. TG2 med påvist konsekvens</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Andre TG2-er beskriver et faktisk forhold som allerede er observert — manglende fall mot sluk på badet, fuktindikasjoner, dårlig drenering eller spor etter lekkasje. Disse er viktigere, fordi konsekvensen kan eskalere og bli dyr. Les alltid feltet «Konsekvens/tiltak» nøye.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hvor du oftest finner TG2</h2>
        <p className="text-slate-300 leading-relaxed mb-4">De vanligste TG2-områdene i norske boliger er:</p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Bad og våtrom</strong> — alder på membran, fall mot sluk, tetting rundt rør</li>
          <li><strong className="text-white">Drenering og grunnmur</strong> — spesielt på eldre boliger og rom under terreng</li>
          <li><strong className="text-white">Tak og taktekking</strong> — alder, undertak, beslag</li>
          <li><strong className="text-white">Vinduer og dører</strong> — punkterte ruter, råte, alder</li>
          <li><strong className="text-white">Elektrisk anlegg</strong> — alder på sikringsskap og kursopplegg</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Spørsmål du bør stille megler om hvert TG2</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <ul className="text-slate-300 leading-relaxed flex flex-col gap-3 text-sm">
            <li>«Er dette TG2 på grunn av alder, eller er det påvist en konkret skade?»</li>
            <li>«Finnes det et kostnadsestimat for utbedring i rapporten?»</li>
            <li>«Når ble dette sist utbedret eller skiftet, og finnes dokumentasjon?»</li>
            <li>«Er det gjort hulltaking eller fuktmåling på badet?»</li>
            <li>«Er forholdet hensyntatt i prisantydningen?»</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Betyr mange TG2 at boligen er dårlig?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Ikke nødvendigvis. En ærlig og grundig tilstandsrapport på en eldre bolig vil naturlig ha mange TG2-punkter — det betyr ofte bare at takstingeniøren har gjort en grundig jobb. Det viktigste er ikke <em>antallet</em> TG2, men hva som ligger bak de mest alvorlige, og om summen av utbedringer er priset inn i det du betaler.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Få alle TG2-funn på sekunder</h3>
          <p className="text-slate-300 text-sm mb-5">Lim inn Finn-lenken, så leser AI-en hele tilstandsrapporten, henter ut hvert TG1-, TG2- og TG3-funn og gir deg ferdige spørsmål til megler.</p>
          <Link href="/analyse" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
            Analyser salgsoppgaven gratis →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/hva-betyr-tg3" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hva betyr TG3? →</p>
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
