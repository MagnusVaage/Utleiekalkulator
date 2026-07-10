import Link from "next/link";

// Reusable call-to-action block for guide articles (dark theme).
// Funnels article traffic back into the core analysis tool.
export default function ArticleCTA({
  title = "Analyser boligen før du byr",
  body = "Lim inn Finn-lenken, så leser AI-en salgsoppgaven, henter ut TG1-, TG2- og TG3-funn og regner yield og kontantstrøm — på sekunder.",
  cta = "Analyser salgsoppgaven gratis →",
}: {
  title?: string;
  body?: string;
  cta?: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 mt-12 mb-8 text-center"
      style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}
    >
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm mb-5">{body}</p>
      <Link
        href="/analyse"
        className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:bg-blue-500"
        style={{ background: "#2563eb" }}
      >
        {cta}
      </Link>
    </div>
  );
}
