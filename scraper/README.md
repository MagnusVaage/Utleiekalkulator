# Bruktpris-scraper

Sammenligner nypris (power.no, elkjop.no) mot bruktpriser på Finn Torget,
matchet på normalisert modellnummer. Alt lagres i SQLite, og rapporten viser
persentiler (p25/median/p75) over bruktannonsene per produkt.

Krever kun Node ≥ 22.18 — ingen runtime-avhengigheter (bruker innebygd
`node:sqlite`, innebygd testrunner og Nodes native TypeScript-kjøring).

## Bruk

```bash
cd scraper
npm run scrape -- "samsung ww90t534aaw"   # kjører alle adapterne og lagrer i data.sqlite
npm run report                            # nypris vs. brukt-persentiler per produkt
npm test                                  # kjører testene (trenger ikke nettverk)
npm install && npm run typecheck          # devDeps kun for typesjekk
```

Databasefil kan overstyres med `SCRAPER_DB=/sti/til/fil.sqlite`.

## Arkitektur

- `src/types.ts` — datamodell og `MarketplaceAdapter`-interfacet (én
  `search(query)` per kilde).
- `src/normalize.ts` — trekker ut modellnummer fra annonsetitler og
  normaliserer dem til en matchenøkkel (`WW90T534AAW/S6` ≡ `ww90t534aaw-s6`).
  Annonser uten gjenkjennbart modellnummer hoppes over — vi gjetter ikke.
- `src/stats.ts` — persentiler med lineær interpolasjon.
- `src/db.ts` — skjema (`products`, `listings`), idempotent ingest
  (samme annonse sett på nytt oppdaterer pris i stedet for å duplisere) og
  rapportbygging.
- `src/adapters/` — én fil per kilde. Parsing er skilt fra fetching slik at
  parserne kan testes med lagrede JSON-fixtures uten nettverk.
- `src/index.ts` — CLI (`scrape` / `report`). Én adapter som feiler stopper
  ikke de andre.

## Status for adapterne

| Kilde | Status |
|---|---|
| power | Fetch + parser skrevet mot antatt API — **endepunkt uverifisert** |
| elkjop | Stub — kaster «ikke implementert» |
| finn | Fetch + parser skrevet mot `api/search-qf` — **endepunkt uverifisert** |

Endepunktene kunne ikke verifiseres fordi nettverkspolicyen i
utviklingsmiljøet blokkerer alle tre domenene (kun pakkeregistre er åpne).
For å iterere på adapterne med ekte trafikk: endre miljøets nettverkspolicy
under claude.ai → Code → Environments (eller kjør lokalt), og verifiser
endepunktene mot Network-fanen i nettleseren.

## Kjente fallgruver

- **Finn har aktiv bot-beskyttelse.** Forvent 403 på vanlig fetch. Fallback:
  Playwright (Chromium er forhåndsinstallert i miljøet på
  `/opt/pw-browsers/chromium`) — hent samme JSON via `page.request` eller les
  `__NEXT_DATA__` fra søkesiden. Dette vil trolig ta mest tid.
- **Tilstandsfeltet er upålitelig.** «Ny»/«som ny» er selvrapportert og ofte
  feilsatt. Modellnummer i tittelen er et sterkere signal enn tilstandsfeltet.
  Derfor lagres alle annonser, og filtreringen (ekskluder `ny` fra
  bruktstatistikken) skjer først i rapporten.
