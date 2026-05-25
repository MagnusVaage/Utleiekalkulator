import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://utleiekalkulatoren.no";

export const metadata: Metadata = {
  title: "Utleiekalkulator 2026 – Beregn yield, kontantstrøm og skatt",
  description:
    "Se om utleieboligen går i pluss før du kjøper. Regn ut yield, kontantstrøm, lån og skatt på sekunder. Lim inn Finn.no-lenke eller fyll inn selv. Gratis, uten registrering.",
  keywords: [
    "utleiekalkulator",
    "utleiebolig kalkulator",
    "lønner det seg å leie ut",
    "yield utleiebolig",
    "kontantstrøm bolig",
    "brutto yield bolig",
    "rentefradrag utleie",
    "finn.no kalkulator",
    "eiendomsanalyse",
    "utleieinvestering norge",
  ],
  authors: [{ name: "Utleiekalkulator" }],
  creator: "Utleiekalkulator",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Utleiekalkulator 2026 – Beregn yield, kontantstrøm og skatt",
    description:
      "Se om utleieboligen går i pluss før du kjøper. Yield, kontantstrøm, lån og skatt på sekunder. Gratis.",
    url: siteUrl,
    siteName: "Utleiekalkulator",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utleiekalkulator 2026 – Beregn yield, kontantstrøm og skatt",
    description:
      "Se om utleieboligen går i pluss før du kjøper. Yield, kontantstrøm, lån og skatt på sekunder. Gratis.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P7CY6GRNFY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-P7CY6GRNFY');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Utleiekalkulator",
              url: siteUrl,
              description:
                "Kalkulator for å beregne om en utleiebolig er lønnsom. Regner ut yield, kontantstrøm og rentefradrag basert på Finn.no-annonser eller egne tall.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "NOK",
              },
              inLanguage: "nb-NO",
              keywords:
                "utleiekalkulator, yield, kontantstrøm, utleiebolig, eiendomsanalyse",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Hva er brutto yield på utleiebolig?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Brutto yield er den årlige leieinntekten delt på kjøpesummen, oppgitt i prosent. En bolig til 3 millioner kroner med 15 000 kr i månedlig leie gir en brutto yield på 6 %. I Norge regnes 5 % eller mer som et godt utgangspunkt.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Hva er rentefradrag og hvor mye sparer jeg?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Når du leier ut bolig, kan du trekke fra renteutgiftene på skatten. Staten dekker 22 % av rentekostnadene dine. Har du 10 000 kr i månedlige renter, sparer du 26 400 kr i året.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Hva er forskjellen på annuitetslån og serielån?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Annuitetslån har fast månedlig betaling — mer renter i starten, mer avdrag mot slutten. Serielån har fast avdrag og synkende renter, noe som gir høyere betaling i starten men lavere totalkostnad over tid.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Kan jeg bruke kalkulatoren på Finn.no-annonser?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ja. Lim inn en Finn.no-lenke øverst, trykk «Hent fra FINN», og alle tall hentes automatisk. Du kan justere tallene manuelt etterpå.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
