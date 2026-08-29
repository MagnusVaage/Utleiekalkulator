# Arbitrasje-scraper: kampanjepris vs. Finn Torget

Finner varer på kampanje hos norske elektronikkbutikker som kan selges med
gevinst på Finn.no. Output er en tabell sortert på gevinst:

```
vare | butikk | butikkpris | finn_pris | annonser | gevinst | %
```

Python 3.11+, `httpx` (+ `selectolax` for adaptere som må parse HTML),
SQLite for historikk og HTTP-cache.

## Bruk

```bash
cd scraper
pip install -r requirements.txt
python -m arbitrasje                    # alle kilder, data.sqlite, cache på
python -m arbitrasje --kilder power     # bare én butikk
python -m arbitrasje --finn-gebyr 0 --frakt 0 --no-cache
python -m unittest discover -s tests    # 28 tester, trenger ikke nettverk
```

## Slik virker den

1. **Kampanjevarer** hentes fra butikkene (`arbitrasje/sources/`). Én død
   kilde stopper ikke kjøringen — feilen logges og resten fortsetter.
2. **Finn-søk** gjøres per unik normalisert modell (dedupet på tvers av
   butikker).
3. **Matching** (`matching.py`) — må være riktig vare:
   - Lik EAN/GTIN → godkjent.
   - Normalisert modellnummer: skilletegn strippes og regionsuffiks
     tolereres (`OLED55C4` == `OLED 55 C4` == `OLED55C46LA`). Suffikset må
     være kort og inneholde siffer, så `IPHONE15PRO` matcher aldri
     `IPHONE15`.
   - Variantsjekk på skjermstørrelse, lagring, farge og årsmodell — påvist
     avvik forkaster annonsen. Alt annet forkastes; ingen fuzzy-treff.
4. **Finn-pris** = 25-persentilen av aktive annonser med tilstand
   «ny»/«som ny» fra privat selger (ukjent tilstand/selgertype teller ikke).
   Under 3 gyldige annonser → raden merkes «for tynt grunnlag».
5. **Gevinst** = finn_pris − butikkpris − finn_gebyr − frakt. Defaults er 0
   for begge (Torget er gratis for privatpersoner, og med Fiks ferdig
   betaler kjøper frakten); overstyr med `--finn-gebyr`/`--frakt`.
6. Alt lagres i SQLite (`runs`, `shop_offers`, `finn_listings`, `deals`)
   som historikk, pluss en HTTP-cache med 6 timers TTL (`--no-cache` for å
   skru av).

Høflighet: 2–5 s tilfeldig pause per forespørsel, maks 1 samtidig
forespørsel per domene (all trafikk er sekvensiell), og robots.txt
respekteres per host (`http.py`).

## Status for kildene

| Kilde | Status |
|---|---|
| power | Fetch + parser mot antatt API — **endepunkt uverifisert** |
| elkjop | Ikke implementert (instruks i `sources/elkjop.py`) |
| komplett | Ikke implementert (instruks i `sources/komplett.py`) |
| netonnet | Ikke implementert (instruks i `sources/netonnet.py`) |
| finn | Fetch + parser mot `api/search-qf` — **endepunkt og felt uverifisert** |

Endepunktene kunne ikke verifiseres fordi nettverkspolicyen i
utviklingsmiljøet blokkerer alle domenene (kun pakkeregistre er åpne). For
å iterere med ekte trafikk: åpne miljøets nettverkspolicy (claude.ai →
Code → Environments) eller kjør lokalt, inspiser nettverkstrafikken i
nettleseren (Network-fanen) og juster endepunkt/felt i adapterne. Parsing
er skilt fra fetching, så hver parser kan låses fast med en lagret
JSON-fixture i `tests/test_parsing.py` når ekte respons foreligger.

## Kjente fallgruver

- **Finn har aktiv bot-beskyttelse.** Forvent 403 på naken httpx. Fallback:
  Playwright (Chromium ligger i miljøet på `/opt/pw-browsers/chromium`) —
  hent samme JSON via `page.request`, eller les `__NEXT_DATA__` fra
  søkesiden. Dette tar sannsynligvis mest tid.
- **Tilstandsfeltet er selvrapportert** og ofte feilsatt; modellnummer i
  tittelen er et sterkere signal. Derfor er matchingen streng (ingen fuzzy),
  og p25 brukes i stedet for laveste pris.
- **Tilstand/selgertype finnes muligens ikke i søkeresponsen** fra Finn —
  da må filteret legges i søke-URL-en (Finn-søket kan filtreres på
  tilstand) eller annonsesiden hentes per treff. Se `sources/finn.py`.
