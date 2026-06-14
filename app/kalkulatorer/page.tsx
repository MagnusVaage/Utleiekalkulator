import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kalkulatorer for boligkjøp og økonomi | Utleiekalkulator",
  description:
    "Gratis kalkulatorer for deg som skal kjøpe bolig: boliglån, dokumentavgift, egenkapital, leie vs. eie og mer. Enkle, raske og uforpliktende.",
  keywords: ["boligkalkulator", "boliglånskalkulator", "dokumentavgift kalkulator", "egenkapital kalkulator"],
  alternates: { canonical: "/kalkulatorer" },
  openGraph: {
    title: "Kalkulatorer for boligkjøp og økonomi",
    description: "Gratis kalkulatorer for boligkjøp: boliglån, dokumentavgift, egenkapital og mer.",
    url: "https://utleiekalkulatoren.no/kalkulatorer",
    type: "website",
  },
};

const card = { background: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };

const KALKULATORER = [
  { href: '/boliglanskalkulator', icon: '🏦', title: 'Boliglånskalkulator', desc: 'Hvor mye kan du låne, og hva koster lånet i måneden?', live: true },
  { href: '', icon: '🧾', title: 'Dokumentavgift', desc: 'Hva må du betale i dokumentavgift (2,5 %) ved kjøp?', live: false },
  { href: '', icon: '🐷', title: 'Hvor mye må jeg spare?', desc: 'Hvor lang tid tar det å nå egenkapitalkravet?', live: false },
  { href: '', icon: '⚖️', title: 'Leie vs. eie', desc: 'Lønner det seg å kjøpe, eller fortsette å leie?', live: false },
  { href: '', icon: '🎯', title: 'Maks budsjett i budrunden', desc: 'Hva har du råd til å by, gitt inntekt og egenkapital?', live: false },
  { href: '', icon: '🔁', title: 'Refinansiering', desc: 'Hvor mye kan du spare med ny rente på boliglånet?', live: false },
];

export default function Page() {
  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#f7f8fa' }}>
      <header className="px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="" className="w-7 h-7" />
            <span className="font-bold text-sm">Utleiekalkulator</span>
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">← Til forsiden</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 mt-6">Kalkulatorer</h1>
        <p className="text-slate-500 mb-8 leading-relaxed max-w-2xl">
          Gratis og enkle kalkulatorer for deg som skal kjøpe bolig eller få oversikt over økonomien. Ingen registrering.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {KALKULATORER.map((k, i) =>
            k.live ? (
              <Link key={i} href={k.href} className="rounded-2xl p-5 transition-all hover:shadow-lg block" style={card}>
                <div className="text-2xl mb-3">{k.icon}</div>
                <h2 className="font-bold text-lg mb-1">{k.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-2">{k.desc}</p>
                <span className="text-sm text-blue-600 font-semibold">Åpne kalkulator →</span>
              </Link>
            ) : (
              <div key={i} className="rounded-2xl p-5 opacity-60" style={card}>
                <div className="text-2xl mb-3">{k.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-lg">{k.title}</h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-slate-500" style={{ background: 'rgba(15,23,42,0.06)' }}>Kommer</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{k.desc}</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
