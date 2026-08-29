"""Aktive annonser på Finn Torget for et gitt modellnummer.

UVERIFISERT: nettverkspolicyen i utviklingsmiljøet blokkerer finn.no.
search-qf er søke-API-et Finns egen frontend bruker; feltnavnene under er
antagelser og må verifiseres mot ekte respons. Forvent 403 fra
bot-beskyttelsen på naken httpx — fallback er Playwright (Chromium ligger i
miljøet på /opt/pw-browsers/chromium): hent samme JSON via page.request,
eller les __NEXT_DATA__ fra søkesiden.

Tilstand ("condition") og selgertype finnes muligens ikke i søkeresponsen;
da må annonsesiden hentes per treff, eller feltet utledes av søkefiltre
(Finn-søket kan filtreres på tilstand — legg da filteret i URL-en i stedet).
"""

from urllib.parse import urlencode

from ..models import FinnListing

SEARCH_URL = "https://www.finn.no/api/search-qf"
name = "finn"

_CONDITION_MAP = {
    "ny": "ny",
    "helt ny": "ny",
    "som ny": "som_ny",
    "brukt": "brukt",
    "godt brukt": "brukt",
}


def parse_search(payload) -> list[FinnListing]:
    docs = payload.get("docs") if isinstance(payload, dict) else None
    if not isinstance(docs, list):
        raise ValueError("finn: uventet responsform — verifiser endepunkt og felt")
    listings = []
    for doc in docs:
        price = (doc.get("price") or {}).get("amount")
        if not isinstance(price, (int, float)):
            continue  # «Gis bort» / uten pris
        raw_condition = doc.get("condition")
        organisation = doc.get("organisation_name")
        listings.append(
            FinnListing(
                ad_id=str(doc.get("ad_id") or doc.get("id")),
                title=str(doc.get("heading") or ""),
                price_nok=float(price),
                url=str(doc.get("canonical_url") or ""),
                condition=_CONDITION_MAP.get(str(raw_condition).strip().lower())
                if raw_condition
                else None,
                # Antagelse: organisasjonsnavn satt = forhandler. Mangler
                # feltet helt, er selgertypen ukjent (None) og filtreres bort.
                private_seller=(organisation in (None, "")) if "organisation_name" in doc else None,
            )
        )
    return listings


def search(http, model: str) -> list[FinnListing]:
    query = urlencode({"searchkey": "SEARCH_ID_BAP_COMMON", "q": model})
    return parse_search(http.get_json(f"{SEARCH_URL}?{query}"))
