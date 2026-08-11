# Låsbytte Sandnes – lead-nettside

Frittstående statisk lead-side for låsbytte/sylinderskifte i Sandnes.
Én HTML-fil uten avhengigheter – kan deployes hvor som helst (Netlify,
Vercel, Cloudflare Pages, vanlig webhotell).

## Før lansering – 3 ting må på plass

1. **Skjema-endepunkt (hvor leads sendes):**
   Opprett et gratis skjema på [formspree.io](https://formspree.io)
   (50 innsendinger/mnd gratis), og erstatt `DIN-SKJEMA-ID` i
   `FORM_ENDPOINT` nederst i `index.html`. Leads kommer da rett til
   e-posten din. Alternativer: Netlify Forms, Basin, Getform.

2. **Domene:** Erstatt `EKSEMPEL-DOMENE.no` i `<link rel="canonical">`
   med det faktiske domenet (f.eks. `laasbyttesandnes.no`).

3. **Telefonnummer (valgfritt):** Siden bruker i dag kun skjema som
   CTA. Hvis du vil ha «Ring nå»-knapp, legg til en
   `<a href="tel:+47XXXXXXXX">`-lenke i header og sticky-CTA.

## Deploy (eksempel med Netlify)

Dra og slipp `laasbytte-sandnes`-mappen på [app.netlify.com/drop](https://app.netlify.com/drop),
eller pek Netlify mot dette repoet med publish directory `laasbytte-sandnes`.

## Innhold som kan justeres

- Prisene i pristabellen er veiledende markedspriser – juster etter
  avtale med låsesmeden som skal motta leads.
- Områdelisten dekker Sandnes' bydeler – utvid gjerne med Stavanger-
  områder hvis dekningen er større.
- FAQ-en har tilhørende `FAQPage`-schema i `<head>` for SEO – hold de
  to i sync hvis du endrer spørsmålene.
