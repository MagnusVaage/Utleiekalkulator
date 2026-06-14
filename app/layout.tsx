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
  title: "Sjekk boligen før du byr – gratis | Utleiekalkulator",
  description:
    "Skal du kjøpe bolig? Lim inn Finn-lenken, så går vi gjennom salgsoppgaven for deg på sekunder og viser hva du bør være obs på. Helt gratis, ingen registrering.",
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
    title: "Sjekk boligen før du byr – gratis | Utleiekalkulator",
    description:
      "Skal du kjøpe bolig? Lim inn Finn-lenken, så går vi gjennom salgsoppgaven for deg på sekunder. Helt gratis.",
    url: siteUrl,
    siteName: "Utleiekalkulator",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sjekk boligen før du byr – gratis | Utleiekalkulator",
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
