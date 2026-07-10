import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCTA from "../../components/ArticleCTA";
import { STEDER, getSted, bruttoYield } from "../steder";

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const fmt = (n: number) => new Intl.NumberFormat("nb-NO").format(n);
const pct = (n: number) => n.toFixed(1).replace(".", ",");

export function generateStaticParams() {
  return STEDER.map((s) => ({ sted: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sted: string }> }): Promise<Metadata> {
  const s = getSted((await params).sted);
  if (!s) return {};
  const y = bruttoYield(s);
  return {
    title: `Leie ut bolig i ${s.navn} (2026): leiepriser og yield | Utleiekalkulator`,
    description: `Hva koster det å leie i ${s.navn}? Typisk leie for 2-roms er ca. ${fmt(s.leie2)} kr/mnd, og brutto yield ligger rundt ${pct(y)} %. Se leiepriser, regneeksempel og skatt.`,
    keywords: [`leie ut bolig ${s.navn}`, `leiepriser ${s.navn}`, `utleie ${s.navn}`, `yield ${s.navn}`, `utleiebolig ${s.navn}`],
    alternates: { canonical: `/utleie/${s.slug}` },
    openGraph: {
      title: `Leie ut bolig i ${s.navn}: leiepriser og yield (2026)`,
      description: `Typisk leie, kvadratmeterpris og brutto yield i ${s.navn} — med regneeksempel.`,
      url: `https://utleiekalkulatoren.no/utleie/${s.slug}`,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ sted: string }> }) {
  const s = getSted((await params).sted);
  if (!s) notFound();

  const y = bruttoYield(s);
  const pris2roms = s.kvmPris * 50;
  const arsleie = s.leie2 * 12;
  const nivaa = y >= 5.5 ? "høyt" : y >= 4.5 ? "middels" : "lavt";
  const iOslo = s.type === "bydel";
  const andre = STEDER.filter((x) => x.slug !== s.slug && (iOslo ? x.type === "bydel" || x.slug === "oslo" : x.type === "by")).slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: '#0d1b2e' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: `Leie ut bolig i ${s.navn}: leiepriser og yield (2026)`,
        description: `Leiepriser, kvadratmeterpris og brutto yield for utleiebolig i ${s.navn}.`,
        inLanguage: "nb-NO",
        author: { "@type": "Organization", name: "Utleiekalkulator" },
        publisher: { "@type": "Organization", name: "Utleiekalkulator" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `Hva er typisk leie for en 2-roms i ${s.navn}?`, acceptedAnswer: { "@type": "Answer", text: `En 2-roms i ${s.navn} leies typisk ut for rundt ${fmt(s.leie2)} kr per måned (veiledende estimat, tidlig 2026). 1-roms ligger rundt ${fmt(s.leie1)} kr og 3-roms rundt ${fmt(s.leie3)} kr.` } },
          { "@type": "Question", name: `Hva er brutto yield på utleiebolig i ${s.navn}?`, acceptedAnswer: { "@type": "Answer", text: `Med en kvadratmeterpris på ca. ${fmt(s.kvmPris)} kr og typisk leie gir en 2-roms på 50 m² en brutto yield på rundt ${pct(y)} % i ${s.navn}. Det regnes som ${nivaa} i norsk sammenheng.` } },
          { "@type": "Question", name: `Hva koster en bolig per kvadratmeter i ${s.navn}?`, acceptedAnswer: { "@type": "Answer", text: `Kvadratmeterprisen for bruktbolig i ${s.navn} ligger på ca. ${fmt(s.kvmPris)} kr (veiledende, tidlig 2026). Prisen varierer med standard, etasje og beliggenhet.` } },
        ],
      }) }} />

      <header className="px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 backdrop-blur" style={{ background: 'rgba(13,27,46,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src="/logo.svg" alt="Utleiekalkulator logo" className="w-8 h-8 sm:w-9 sm:h-9" />
            <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent tracking-tight">Utleiekalkulator</span>
          </Link>
          <Link href="/analyse" className="text-xs sm:text-sm font-semibold text-white px-2.5 sm:px-4 py-2 rounded-lg transition-all hover:bg-blue-500 whitespace-nowrap" style={{ background: '#2563eb' }}>Analyser bolig</Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
          <Link href="/utleie" className="hover:text-blue-300">Leiepriser</Link> · {iOslo ? `Bydel i Oslo` : s.fylke}
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Leie ut bolig i {s.navn}: leiepriser og yield (2026)</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-10">
          Vurderer du å kjøpe utleiebolig {iOslo ? "på" : "i"} <strong className="text-white">{s.navn}</strong>? Kvadratmeterprisen ligger på ca. <strong className="text-white">{fmt(s.kvmPris)} kr</strong>, og en typisk 2-roms leies ut for rundt <strong className="text-white">{fmt(s.leie2)} kr/mnd</strong>. Det gir en brutto yield på ca. <strong className="text-white">{pct(y)} %</strong> — {nivaa} i norsk sammenheng.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Typiske leiepriser i {s.navn}</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["1-roms", s.leie1], ["2-roms", s.leie2], ["3-roms", s.leie3]].map(([label, val]) => (
              <div key={label as string}>
                <p className="text-slate-400 text-sm mb-1">{label}</p>
                <p className="text-white font-extrabold text-xl">{fmt(val as number)} kr</p>
                <p className="text-slate-500 text-xs">per måned</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Tallene er veiledende estimater (tidlig 2026) basert på offentlig statistikk og annonserte leiepriser. Standard, beliggenhet og møblering gir store utslag — sjekk alltid mot faktiske annonser i området.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Regneeksempel: 2-roms på 50 m²</h2>
        <div className="rounded-2xl p-6 mb-6" style={cardStyle}>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Kjøpesum (50 m² × {fmt(s.kvmPris)} kr)</span><span className="text-white font-semibold">{fmt(pris2roms)} kr</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Leieinntekt per år ({fmt(s.leie2)} kr × 12)</span><span className="text-white font-semibold">{fmt(arsleie)} kr</span></div>
            <div className="flex justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-slate-300 font-semibold">Brutto yield</span>
              <span className="text-blue-400 font-extrabold text-lg">{pct(y)} %</span>
            </div>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed mb-6">
          Brutto yield er årsleie delt på kjøpesum — før felleskostnader, vedlikehold, skatt og tomgang. Netto yield blir alltid lavere. Vil du regne med dine egne tall, lånekostnader og skatt, bruk <Link href="/kalkulator" className="text-blue-400 hover:text-blue-300 font-semibold">utleiekalkulatoren</Link>.
        </p>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Hva bør du sjekke før du kjøper {iOslo ? "på" : "i"} {s.navn}?</h2>
        <ul className="text-slate-300 leading-relaxed flex flex-col gap-3 mb-6 list-disc pl-5">
          <li><strong className="text-white">Tilstanden på boligen:</strong> TG2- og TG3-funn i tilstandsrapporten kan koste mer enn et helt års leieinntekter. Les salgsoppgaven nøye — eller <Link href="/analyse" className="text-blue-400 hover:text-blue-300 font-semibold">la AI-en lese den for deg</Link>.</li>
          <li><strong className="text-white">Felleskostnader og fellesgjeld:</strong> spiser direkte av kontantstrømmen, og varierer mye mellom sameier og borettslag.</li>
          <li><strong className="text-white">Skatt:</strong> leieinntekter fra sekundærbolig beskattes med 22 %, men du får fradrag for renter og kostnader. Se <Link href="/skatt-leieinntekter" className="text-blue-400 hover:text-blue-300 font-semibold">guiden om skatt på leieinntekter</Link>.</li>
          <li><strong className="text-white">Leiemarkedet lokalt:</strong> nærhet til studiested, kollektiv og arbeidsplasser avgjør hvor lett boligen leies ut — og til hvilken pris.</li>
        </ul>

        <ArticleCTA
          title={`Fant du en bolig ${iOslo ? "på" : "i"} ${s.navn}?`}
          body="Lim inn Finn-lenken, så leser AI-en salgsoppgaven, henter ut TG-funn og regner yield og kontantstrøm for akkurat den boligen — på sekunder."
        />

        <h2 className="text-xl font-bold text-white mt-10 mb-4">{iOslo ? "Andre bydeler og steder" : "Andre byer"}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {andre.map((x) => (
            <Link key={x.slug} href={`/utleie/${x.slug}`} className="text-sm px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-colors" style={cardStyle}>
              {x.navn} →
            </Link>
          ))}
          <Link href="/utleie" className="text-sm px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300 transition-colors" style={cardStyle}>
            Alle steder →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/lonner-det-seg-a-leie-ut" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Lønner det seg å leie ut? →</p>
          </Link>
          <Link href="/skatt-leieinntekter" className="rounded-xl p-5 transition-all hover:bg-white/5" style={cardStyle}>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">Les også</p>
            <p className="font-semibold text-white">Skatt på leieinntekter →</p>
          </Link>
        </div>
      </article>

      <footer className="px-6 py-8 text-center mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Utleiekalkulator · Veiledende estimater, ikke finansiell rådgivning
        </p>
      </footer>
    </div>
  );
}
