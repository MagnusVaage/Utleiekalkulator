import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utleiekalkulator – regn ut yield, kontantstrøm og skatt | Gratis",
  description:
    "Gratis utleiekalkulator: se om utleieboligen går i pluss. Regn ut brutto og netto yield, kontantstrøm, lån og skatt — lim inn en Finn-lenke eller fyll inn tallene selv.",
  keywords: ["utleiekalkulator", "yield kalkulator", "kontantstrøm utleiebolig", "lønner det seg å leie ut", "utleiebolig kalkulator"],
  alternates: { canonical: "/kalkulator" },
  openGraph: {
    title: "Utleiekalkulator – regn ut yield, kontantstrøm og skatt",
    description: "Se om utleieboligen går i pluss. Yield, kontantstrøm, lån og skatt på 30 sekunder. Gratis.",
    url: "https://utleiekalkulatoren.no/kalkulator",
    type: "website",
  },
};

export default function KalkulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
