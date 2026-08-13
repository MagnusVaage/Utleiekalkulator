# Låsesmed Sandnes – lead-nettside (låsesmedsandnes.no)

Frittstående statisk lead-side for låsbytte/sylinderskifte i Sandnes,
med telefonnummer som primær CTA. Én HTML-fil uten avhengigheter – kan
deployes hvor som helst (Netlify, Vercel, Cloudflare Pages, webhotell).

## Før lansering – må på plass

1. **Telefonnummer:** `+47 400 00 000` er en PLASSHOLDER og må byttes
   til et ekte nummer du disponerer før siden publiseres. Endre
   `PHONE_E164` og `PHONE_DISPLAY` nederst i `index.html` – hele siden
   (alle knapper, tekster og schema) oppdateres fra disse. Husk også
   `"telephone"` i Locksmith-schemaet og «Ring 400 00 000» i
   `<title>`/meta description i `<head>`.
   Tips: bruk et eget nummer (f.eks. Telia/Telenor tvilling-SIM eller
   en viderekoblingstjeneste) så du kan måle at anrop kommer fra siden.

2. **Skjema-endepunkt («Ring meg opp»):** Opprett et gratis skjema på
   [formspree.io](https://formspree.io) og erstatt `DIN-SKJEMA-ID` i
   `FORM_ENDPOINT` nederst i `index.html`.

3. **Domene:** ✅ Satt til `låsesmedsandnes.no` (canonical, og:url og
   Locksmith-schema). NB: I DNS/hosting-oppsett brukes punycode-formen
   `xn--lsesmedsandnes-lib.no` – de fleste registrarer og hosting-
   tjenester (Netlify m.fl.) viser/godtar denne automatisk.

## SEO som er på plass

- Søkeordoptimalisert `<title>` og meta description («låsesmed Sandnes»,
  «bytte lås», «skifte sylinder»)
- `Locksmith`-schema (LocalBusiness) med telefon, åpningstider og
  areaServed Sandnes
- `FAQPage`-schema – hold i sync med FAQ-seksjonen ved endringer
- Tekstseksjon med lokale søkefraser og H2/H3-struktur
- Områdeliste over Sandnes' bydeler for lokale søk

Neste SEO-steg etter lansering: opprett Google Business Profile,
registrer siden i Google Search Console, og skaff lokale omtaler/lenker.

## Deploy (eksempel med Netlify)

Dra og slipp `laasbytte-sandnes`-mappen på [app.netlify.com/drop](https://app.netlify.com/drop),
eller pek Netlify mot repoet med publish directory `laasbytte-sandnes`.
