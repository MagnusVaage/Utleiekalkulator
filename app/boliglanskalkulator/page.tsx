import type { Metadata } from "next";
import BoliglanKalkulator from "./BoliglanKalkulator";

export const metadata: Metadata = {
  title: "Boliglånskalkulator – hvor mye kan du låne? | Utleiekalkulator",
  description:
    "Regn ut hvor mye du kan låne og hva boliglånet koster i måneden. Gratis boliglånskalkulator med rente, nedbetalingstid og skattefradrag.",
  keywords: ["boliglånskalkulator", "hvor mye kan jeg låne", "lånekalkulator bolig", "hva koster lånet"],
  alternates: { canonical: "/boliglanskalkulator" },
  openGraph: {
    title: "Boliglånskalkulator – hvor mye kan du låne?",
    description: "Regn ut hvor mye du kan låne og hva lånet koster i måneden. Gratis.",
    url: "https://utleiekalkulatoren.no/boliglanskalkulator",
    type: "website",
  },
};

export default function Page() {
  return <BoliglanKalkulator />;
}
