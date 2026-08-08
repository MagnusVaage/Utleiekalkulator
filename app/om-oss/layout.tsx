import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om oss og kontakt | Utleiekalkulator",
  description:
    "Hvem står bak Utleiekalkulator? Les om hvorfor vi laget gratisverktøyene for boliganalyse, og ta kontakt med spørsmål eller tilbakemeldinger.",
  alternates: { canonical: "/om-oss" },
  openGraph: {
    title: "Om oss og kontakt | Utleiekalkulator",
    description: "Hvem står bak Utleiekalkulator, og hvordan du kan ta kontakt.",
    url: "https://utleiekalkulatoren.no/om-oss",
    type: "website",
  },
};

export default function OmOssLayout({ children }: { children: React.ReactNode }) {
  return children;
}
