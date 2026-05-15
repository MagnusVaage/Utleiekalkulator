import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tilstandsrapport-analyse – AI leser boligrapporten for deg",
  description:
    "Last opp PDF fra boligsalgsrapporten og få en ryddig oversikt over TG1, TG2 og TG3 funn på sekunder. Gratis AI-analyse, ingen registrering.",
  alternates: { canonical: "/rapport" },
  openGraph: {
    title: "Tilstandsrapport-analyse – AI leser boligrapporten for deg",
    description:
      "Last opp PDF fra boligsalgsrapporten og få en ryddig oversikt over TG1, TG2 og TG3 funn på sekunder.",
    url: "https://utleiekalkulatoren.no/rapport",
  },
};

export default function RapportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
