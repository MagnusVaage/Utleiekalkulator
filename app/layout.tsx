import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

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
  title: "AI-boliganalyse og utleiekalkulator – helt gratis",
  description:
    "Gratis AI-analyse av bolig: Lim inn Finn-lenken, så leser vi salgsoppgaven og tilstandsrapporten på sekunder og viser risikofunn, spørsmål til megler, yield og kontantstrøm.",
  keywords: [
    "boliganalyse",
    "analyse av salgsoppgave",
    "tilstandsrapport analyse",
    "sjekke bolig før visning",
    "TG2 TG3 funn",
    "spørsmål til megler",
    "utleiekalkulator",
    "yield utleiebolig",
    "kontantstrøm bolig",
    "eiendomsanalyse",
  ],
  authors: [{ name: "Utleiekalkulator" }],
  creator: "Utleiekalkulator",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI-boliganalyse og utleiekalkulator – helt gratis",
    description:
      "Skal du kjøpe bolig? Lim inn Finn-lenken, så går vi gjennom salgsoppgaven for deg på sekunder. Helt gratis.",
    url: siteUrl,
    siteName: "Utleiekalkulator",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-boliganalyse og utleiekalkulator – helt gratis",
    description:
      "Skal du kjøpe bolig? Lim inn Finn-lenken, så går vi gjennom salgsoppgaven for deg på sekunder. Helt gratis.",
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
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "Utleiekalkulator",
                  url: siteUrl,
                  logo: `${siteUrl}/logo.svg`,
                  description:
                    "Utleiekalkulator lager gratis verktøy for boliganalyse: AI-gjennomgang av salgsoppgaver, utleiekalkulator, boliglånskalkulator og guider om boligkjøp og utleie.",
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  name: "Utleiekalkulator",
                  url: siteUrl,
                  inLanguage: "nb-NO",
                  publisher: { "@id": `${siteUrl}/#organization` },
                },
              ],
            }),
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
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
