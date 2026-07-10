import type { Metadata } from "next";
import Link from "next/link";
import ArticleCTA from "../components/ArticleCTA";
import { STEDER, bruttoYield } from "./steder";

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const fmt = (n: number) => new Intl.NumberFormat("nb-NO").format(n);
const pct = (n: number) => n.toFixed(1).replace(".", ",");

export const metadata: Metadata = {
  title: "Leiepriser og yield per by og bydel (2026) | Utleiekalkulator",
  description:
    "Hva koster det å leie i Oslo, Bergen, Trondheim og andre norske byer? Se typiske leiepriser, kvadratmeterpris og brutto yield for utleiebolig — sted for sted.",
  keywords: ["leiepriser norge", "leiepriser oslo", "yield utleiebolig by", "leie ut bolig", "utleiebolig norge"],
  alternates: { canonical: "/utleie" },
  openGraph: {
    title: "Leiepriser og yield per by og bydel (2026)",
    description: "Typiske leiepriser, kvadratmeterpris og brutto yield for utleiebolig i norske byer.",
    url: "https://utleiekalkulatoren.no/utleie",
    type: "website",
  },
};

function StedKort({ slug, navn, kvmPris, leie2, y }: { slug: string; navn: string; kvmPris: number; leie2: number; y: number }) {
  return (
    <Link href={`/utleie/${slug}`} className="rounded-xl p-5 transition-all hover:bg-white/5 block" style={cardStyle}>
      <p className="font-bold text-white mb-2">{navn} →</p>
      <div className="flex justify-between text-xs text-slate-400">
        <span>2-roms: {fmt(leie2)} kr/mnd</span>
        <span className="text-blue-400 font-semibold">{pct(y)} % yield</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{fmt(kvmPris)} kr/m²</p>
    </Link>
  );
}

export default function Page() {
  const bydeler = STEDER.filter((s) => s.type === "bydel" || s.slug === "oslo");
  const byer = STEDER.filter((s) => s.type === "by" && s.slug !== "oslo");

  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <header className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur" style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <Link href="/analyse" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>Analyser bolig</Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">Leiepriser 2026</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Leiepriser og yield — by for by</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl">
          Hvor mye kan du ta i leie, og hva gir best avkastning? Her finner du veiledende leiepriser, kvadratmeterpris og brutto yield for utleiebolig i norske byer og Oslo-bydeler (estimater, tidlig 2026).
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">Oslo og bydelene</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {bydeler.map((s) => <StedKort key={s.slug} slug={s.slug} navn={s.navn} kvmPris={s.kvmPris} leie2={s.leie2} y={bruttoYield(s)} />)}
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Byer i resten av landet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {byer.map((s) => <StedKort key={s.slug} slug={s.slug} navn={s.navn} kvmPris={s.kvmPris} leie2={s.leie2} y={bruttoYield(s)} />)}
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Merk: høy brutto yield betyr ikke automatisk god investering — tilstand, felleskostnader, tomgang og lokalt leiemarked avgjør. Tallene er veiledende estimater og ikke finansiell rådgivning.
        </p>

        <ArticleCTA />
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Utleiekalkulator · Veiledende estimater, ikke finansiell rådgivning
        </p>
      </footer>
    </div>
  );
}
