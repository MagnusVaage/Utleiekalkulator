import type { Metadata } from "next";
import Dokumentavgift from "./Dokumentavgift";

export const metadata: Metadata = {
  title: "Dokumentavgift-kalkulator – hva koster det å kjøpe bolig? | Utleiekalkulator",
  description:
    "Regn ut dokumentavgift (2,5 %) og tinglysingsgebyr ved boligkjøp. Gratis kalkulator — se totale omkostninger på sekunder. Borettslag har ingen dokumentavgift.",
  keywords: ["dokumentavgift", "dokumentavgift kalkulator", "tinglysingsgebyr", "omkostninger boligkjøp", "hvor mye dokumentavgift"],
  alternates: { canonical: "/dokumentavgift" },
  openGraph: {
    title: "Dokumentavgift-kalkulator – hva koster det å kjøpe bolig?",
    description: "Regn ut dokumentavgift (2,5 %) og tinglysingsgebyr ved boligkjøp. Gratis.",
    url: "https://utleiekalkulatoren.no/dokumentavgift",
    type: "website",
  },
};

export default function Page() {
  return <Dokumentavgift />;
}
