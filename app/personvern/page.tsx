import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personvern | Utleiekalkulator",
  description:
    "Slik håndterer Utleiekalkulator personopplysninger, informasjonskapsler og data du fyller inn i kalkulatoren.",
  alternates: { canonical: "/personvern" },
  robots: { index: true, follow: true },
};

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <header className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur"
        style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>
            🧮 Tilbake
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Personvern</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Personvernerklæring
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Sist oppdatert: mai 2026
        </p>

        <div className="rounded-2xl p-6 mb-10" style={cardStyle}>
          <p className="text-white text-sm leading-relaxed">
            <strong>Kort sagt:</strong> Vi lagrer ikke det du fyller inn i kalkulatoren. Beregningene skjer i nettleseren din. Vi bruker Google Analytics for anonym besøksstatistikk.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Hva vi samler inn</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Utleiekalkulator samler ikke inn personopplysninger som navn, e-post eller adresse. Du trenger ikke registrere deg for å bruke tjenesten.
        </p>
        <ul className="text-slate-300 text-sm leading-relaxed space-y-2 mb-8 list-disc pl-5">
          <li><strong>Kalkulatordata</strong>: Tall du fyller inn i kalkulatoren behandles utelukkende i din egen nettleser. Vi sender det aldri til vår server og lagrer det ikke.</li>
          <li><strong>Finn.no-import</strong>: Når du limer inn en Finn-lenke, henter serveren vår den offentlige annonsen fra finn.no for å lese ut tall. Lenken lagres ikke.</li>
          <li><strong>Salgsoppgave-analyse</strong>: Hvis du laster opp en PDF for analyse, behandles filen midlertidig på serveren for å trekke ut nøkkeltall. Filen slettes etter behandling og lagres ikke permanent.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Informasjonskapsler og analyse</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Vi bruker <strong className="text-white">Google Analytics 4</strong> for å forstå hvordan besøkende bruker nettsiden — hvilke sider som er populære, hvor besøkende kommer fra, og hvilken enhet de bruker. Dataene er anonymisert og kobles ikke til deg som person.
        </p>
        <p className="text-slate-300 leading-relaxed mb-8">
          Du kan blokkere Google Analytics ved å bruke nettleserutvidelser som uBlock Origin eller Google sin egen opt-out.
        </p>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Dine rettigheter</h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Siden vi ikke lagrer personopplysninger om deg, har vi heller ingenting å utlevere, slette eller rette. Du har likevel disse rettighetene etter GDPR:
        </p>
        <ul className="text-slate-300 text-sm leading-relaxed space-y-2 mb-8 list-disc pl-5">
          <li>Rett til innsyn i hvilke data som er lagret</li>
          <li>Rett til å få data slettet</li>
          <li>Rett til å klage til Datatilsynet</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-10 mb-4">Endringer</h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Denne erklæringen kan oppdateres ved behov. Dato øverst viser når den sist ble endret.
        </p>

        <div className="rounded-2xl p-6 mt-12" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-300 font-semibold text-sm hover:text-blue-200">
            ← Tilbake til kalkulatoren
          </Link>
        </div>
      </article>
    </div>
  );
}
