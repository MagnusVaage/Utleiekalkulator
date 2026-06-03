import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hva betyr TG1 i tilstandsrapporten? | Utleiekalkulator",
  description:
    "TG1 betyr et mindre avvik eller normal slitasje i en boligsalgsrapport. Vi forklarer hva TG1 betyr, hvorfor det sjelden er noe å bekymre seg for, og når et TG1 likevel er verdt å følge med på.",
  keywords: [
    "hva betyr tg1",
    "tg1 tilstandsrapport",
    "tilstandsgrad 1",
    "tg1 bad",
    "tg1 ved boligkjøp",
  ],
  alternates: { canonical: "/hva-betyr-tg1" },
  openGraph: {
    title: "Hva betyr TG1 i tilstandsrapporten?",
    description: "TG1 forklart enkelt — hvorfor det sjelden er noe å bekymre seg for, og når du likevel bør følge med.",
    url: "https://utleiekalkulatoren.no/hva-betyr-tg1",
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
            headline: "Hva betyr TG1 i tilstandsrapporten?",
            description: "TG1 forklart — hvorfor det sjelden er noe å bekymre seg for, og når du likevel bør følge med.",
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
                name: "Hva betyr TG1 i en tilstandsrapport?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "TG1 betyr et mindre avvik eller normal slitasje. Den bygningssakkyndige har ikke funnet noe alvorlig — det er stort sett snakk om vanlig aldring som ikke krever tiltak på kort sikt.",
                },
              },
              {
                "@type": "Question",
                name: "Er TG1 noe å bekymre seg for?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Vanligvis ikke. TG1 er den nest beste tilstandsgraden og betyr at bygningsdelen er i god stand med kun mindre slitasje. Det er TG2 og TG3 du primært bør bruke tid på i en tilstandsrapport.",
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
          Hva betyr TG1 i tilstandsrapporten?
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          <strong className="text-white">TG1 betyr et mindre avvik eller normal slitasje</strong> — bygningsdelen er i god stand, og den bygningssakkyndige har ikke funnet noe som krever tiltak på kort sikt. Sammen med TG0 er dette den tilstandsgraden du har minst grunn til å bekymre deg for.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.30)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-green-300">Kort fortalt:</strong> TG1 er et sunnhetstegn, ikke et faresignal. Bruk tiden din på TG2- og TG3-punktene — det er der pengene og risikoen ligger.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Tilstandsgradene fra TG0 til TG3</h2>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">TG0</strong> — ingen avvik. Som nytt eller tilnærmet nytt.</li>
          <li><strong className="text-white">TG1</strong> — mindre avvik eller normal slitasje. Tiltak er som regel ikke nødvendig på kort sikt.</li>
          <li><strong className="text-white">TG2</strong> — vesentlig avvik. Tiltak kan bli nødvendig, men ikke akutt.</li>
          <li><strong className="text-white">TG3</strong> — stort eller alvorlig avvik. Strakstiltak eller utbedring er nødvendig.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva et TG1 typisk beskriver</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          TG1 handler nesten alltid om forventet, ufarlig aldring. Vanlige eksempler:
        </p>
        <ul className="text-slate-300 leading-relaxed mb-6 ml-5 list-disc flex flex-col gap-2">
          <li><strong className="text-white">Overflateslitasje</strong> — riper i parkett, slitte malingsflater, mindre sprekker i fliser</li>
          <li><strong className="text-white">Normal aldring av bygningsdeler</strong> som fortsatt fungerer som de skal</li>
          <li><strong className="text-white">Kosmetiske forhold</strong> uten teknisk konsekvens</li>
          <li><strong className="text-white">Mindre vedlikeholdsbehov</strong> som kan tas når det passer</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Når et TG1 likevel er verdt et blikk</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          I de aller fleste tilfeller kan du lese TG1 raskt og gå videre. To unntak: hvis et bad eller våtrom kun har fått TG1 til tross for høy alder, kan det være verdt å sjekke hvorfor — noen ganger er det fordi det nylig er renovert, andre ganger fordi sakkyndig ikke kom til. Og hvis mange TG1-punkter samler seg rundt samme bygningsdel, kan summen fortelle noe om et nært forestående vedlikeholdsbehov.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">TG1 vs. TG2 — hvor går grensen?</h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Forskjellen ligger i ordet «vesentlig». TG1 er normal slitasje uten påvist konsekvens, mens TG2 er et <em>vesentlig</em> avvik der tiltak kan bli nødvendig. Når sakkyndig er i tvil, er det skillet mellom «følg med ved neste vedlikehold» (TG1) og «dette bør du ta tak i» (TG2). Det er derfor TG2 og TG3 fortjener mest oppmerksomhet når du leser rapporten.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Få alle TG-funn på sekunder</h3>
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
          <Link href="/hva-betyr-tg3" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Hva betyr TG3? →</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
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
