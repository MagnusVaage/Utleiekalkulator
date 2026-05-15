import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hvor mye egenkapital trenger du til utleiebolig? | Utleiekalkulator",
  description:
    "Egenkapitalkravet for sekundærbolig er 40 % i Norge. Vi forklarer hvorfor, hvordan komme rundt 40 %-regelen, og viser konkret hva du trenger for ulike kjøpesummer.",
  keywords: [
    "egenkapital utleiebolig",
    "egenkapital sekundærbolig",
    "40 prosent regelen",
    "egenkapitalkrav sekundærbolig",
    "kjøpe utleiebolig egenkapital",
  ],
  alternates: { canonical: "/egenkapital-utleiebolig" },
  openGraph: {
    title: "Hvor mye egenkapital trenger du til utleiebolig?",
    description: "Komplett guide til 40 %-regelen, lånetak og hvordan finansiere kjøp av sekundærbolig.",
    url: "https://utleiekalkulatoren.no/egenkapital-utleiebolig",
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
            headline: "Hvor mye egenkapital trenger du til utleiebolig?",
            description: "Komplett guide til 40 %-regelen, lånetak og hvordan finansiere kjøp av sekundærbolig.",
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
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
              🧮 Beregn lønnsomhet
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Guide til finansiering</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Hvor mye egenkapital trenger du til utleiebolig?
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          For utleiebolig krever bankene <strong className="text-white">40 % egenkapital</strong> — dobbelt så mye som for primærbolig. Her er hvorfor, hvor mye du faktisk trenger, og hvordan komme rundt regelen.
        </p>

        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.25)' }}>
          <p className="text-white text-sm leading-relaxed">
            <strong className="text-orange-300">40 %-regelen:</strong> Skal du kjøpe en sekundærbolig (utleiebolig) i Norge, må du som hovedregel ha minst <strong>40 % egenkapital</strong>. På toppen kommer dokumentavgift (2,5 %) og andre omkostninger.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hvorfor er kravet så høyt?</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Finanstilsynet innførte 40 %-kravet for å bremse boligprisveksten og redusere risiko i utlånsmarkedet. Utleieboliger anses som <em>investering</em>, ikke nødvendighet — derfor strengere krav enn for primærbolig (der det er 15 %).
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Banken regner også med at du må tåle 7 prosentpoeng renteoppgang når de vurderer lånekapasitet. Det betyr at selv om markedsrenten er 5 %, må budsjettet ditt tåle 12 % rente. Tøft, men slik er reglene.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Konkret eksempel: Hva trenger du?</h2>

        <div className="rounded-2xl p-6 mb-4" style={cardStyle}>
          <p className="font-semibold text-white mb-3">Leilighet til 4 millioner kroner</p>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-slate-300"><span>Egenkapital (40 %)</span><span>1&nbsp;600&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-300"><span>Dokumentavgift (2,5 %)</span><span>100&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-300"><span>Tinglysing skjøte</span><span>585 kr</span></div>
            <div className="flex justify-between text-slate-300"><span>Tinglysing pantedokument</span><span>585 kr</span></div>
            <div className="flex justify-between text-white font-semibold pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}><span>Sum du må stille med</span><span>1&nbsp;701&nbsp;170 kr</span></div>
          </div>
        </div>

        <div className="rounded-2xl p-6 mb-8" style={cardStyle}>
          <p className="font-semibold text-white mb-3">Leilighet til 6 millioner kroner</p>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-slate-300"><span>Egenkapital (40 %)</span><span>2&nbsp;400&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-300"><span>Dokumentavgift (2,5 %)</span><span>150&nbsp;000 kr</span></div>
            <div className="flex justify-between text-slate-300"><span>Tinglysing</span><span>1&nbsp;170 kr</span></div>
            <div className="flex justify-between text-white font-semibold pt-2 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}><span>Sum du må stille med</span><span>2&nbsp;551&nbsp;170 kr</span></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">3 måter å komme rundt 40 %-regelen</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">1. Pant i annen bolig</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Har du egen bolig med lav belåning, kan du bruke verdien som tilleggssikkerhet i banken. Banken legger sammen total egenkapital og total gjeld — så lenge du har 40 % egenkapital totalt, kan utleieboligen finansieres med mindre kontant.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">2. Bo selv i boligen først</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Bor du i boligen i 12 måneder før du leier den ut, regnes den som primærbolig — da er egenkapitalkravet bare 15 %. Mange utleieinvestorer starter slik: kjøper, bor selv, og leier ut senere.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-3">3. Fleksibilitetskvoten</h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Bankene har lov til å gå utenfor reglene for inntil <strong className="text-white">10 % av utlånsvolumet</strong> per kvartal. Har du veldig god økonomi og lang historikk i banken, kan du forhandle deg til lavere krav. Mest aktuelt i mindre banker.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Glem ikke buffer</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Selv om du klarer 40 % egenkapital, bør du ha en buffer på siden — minst <strong className="text-white">3–6 måneder med løpende kostnader</strong>. Hvis boligen står tom, leietaker ikke betaler, eller noe må repareres, må du dekke det selv.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          Tommelfingerregel: legg på <strong className="text-white">100&nbsp;000 kr ekstra</strong> i buffer per million i kjøpesum.
        </p>

        <div className="rounded-2xl p-6 mt-12 mb-8 text-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <h3 className="text-xl font-bold text-white mb-2">Se hva som lønner seg for deg</h3>
          <p className="text-slate-300 text-sm mb-5">Kalkulatoren tar hensyn til egenkapital, lånebeløp, renter og avdrag — så du ser kontantstrømmen før du kjøper.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500" style={{ background: '#2563eb' }}>
            Åpne kalkulatoren →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          <Link href="/lonner-det-seg-a-leie-ut" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Lønner det seg å leie ut bolig? →</p>
          </Link>
          <Link href="/skatt-leieinntekter" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Skatt på leieinntekter →</p>
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
