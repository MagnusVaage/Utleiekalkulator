# Vasslinja – lead-nettside for rørlegger i Ålesund (vasslinja.no)

Frittstående statisk lead-side for rørleggeroppdrag i Ålesund og omegn,
med telefonnummer som primær CTA. Én HTML-fil uten avhengigheter – kan
deployes hvor som helst (Netlify, Vercel, Cloudflare Pages, webhotell).

Samme oppsett som `laasbytte-sandnes`.

## Før lansering – må på plass

1. **Telefonnummer:** `+47 400 00 000` er en PLASSHOLDER og må byttes
   til et ekte nummer du disponerer før siden publiseres. Endre
   `PHONE_E164` og `PHONE_DISPLAY` nederst i `index.html` – hele siden
   (alle knapper, tekster og FAQ-tekst) oppdateres fra disse. Husk også
   `"telephone"` i Plumber-schemaet, `400 00 000` i de seks
   FAQPage-svarene, og «Ring 400 00 000» i `<title>`/meta description
   i `<head>`.
   Tips: bruk et eget nummer (f.eks. tvilling-SIM eller en
   viderekoblingstjeneste) så du kan måle at anrop kommer fra siden.

2. **Skjema-endepunkt («Ring meg opp»):** Opprett et gratis skjema på
   [formspree.io](https://formspree.io) og erstatt `DIN-SKJEMA-ID` i
   `FORM_ENDPOINT` nederst i `index.html`. Skjemaet sender også feltet
   `oppdrag` (type jobb), så leadene kan sorteres etter hastegrad.

3. **Domene:** Satt til `vasslinja.no` (canonical, og:url og
   Plumber-schema). Rene ASCII-bokstaver, så ingen punycode å ta hensyn
   til. Sjekk at domenet er ledig hos Norid før du låser navnet.

## Navn

«Vasslinja» – nynorsk/sunnmørsk «vass» (vann) + «linja» (røret,
forbindelsen). Stedsnavn er bevisst holdt utenfor navnet, mens
søkeordet «rørlegger Ålesund» ligger i `<title>`, H1 og brødtekst der
det faktisk gir SEO-effekt.

## Tjenester som dekkes

Siden dekker hele bredden et komplett rørleggerfirma tilbyr:
vannlekkasje og rørbrudd, tette avløp og sluk, bad og våtrom,
sanitærutstyr, varmtvannsbereder, vannbåren varme og gulvvarme,
rørdelen av varmepumpeinstallasjon, utskifting av gamle vann- og
avløpsrør, kjøkken og hvitevarer, utekran og stikkledning, nybygg og
hytter, ventilasjon i forbindelse med våtrom, samt rammeavtaler for
borettslag, sameier og næringsbygg.

## Formuleringer – hold deg til disse

Siden hevder **ikke** at Vasslinja selv har mesterbrev, sentral
godkjenning eller kjedetilknytning. Den sier at oppdraget utføres av
godkjent rørleggerbedrift med fagbrev, og footeren opplyser at
Vasslinja formidler oppdrag videre. Det holder siden ærlig uten å navngi
hvem som utfører jobben. Ikke legg til konkrete garantier, medlemskap
eller antall år i bransjen som ikke kan dokumenteres.

## SEO som er på plass

- Søkeordoptimalisert `<title>` og meta description («rørlegger
  Ålesund», «vannlekkasje», «tett avløp», «bad»)
- `Plumber`-schema (LocalBusiness) med telefon, åpningstider og
  areaServed Ålesund/Sula/Giske
- `FAQPage`-schema med seks spørsmål – hold i sync med FAQ-seksjonen
  ved endringer
- Tekstseksjon med lokale søkefraser og H2/H3-struktur
- Områdeliste over bydeler og nabosteder for lokale søk

Neste SEO-steg etter lansering: opprett Google Business Profile,
registrer siden i Google Search Console, og skaff lokale omtaler/lenker.

## Deploy (eksempel med Netlify)

Dra og slipp `rorlegger-vasslinja`-mappen på
[app.netlify.com/drop](https://app.netlify.com/drop), eller pek Netlify
mot repoet med publish directory `rorlegger-vasslinja`.
