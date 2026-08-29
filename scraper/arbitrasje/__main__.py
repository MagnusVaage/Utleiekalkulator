"""CLI: hent kampanjevarer, slå opp mot Finn Torget, rapporter gevinst.

Kjøres fra scraper/-katalogen:  python -m arbitrasje [flagg]
Én død kilde stopper ikke kjøringen — feil logges og resten fortsetter.
"""

import argparse
import sys

from . import db as dbmod
from .http import Http
from .matching import models_match, offer_model
from .models import Deal, FinnListing, ShopOffer
from .pipeline import Config, evaluate_offer
from .normalize import normalize_model
from .report import format_table
from .sources import elkjop, finn, komplett, netonnet, power

SHOP_SOURCES = [power, elkjop, komplett, netonnet]


def collect_offers(http, source_names: list[str]) -> list[ShopOffer]:
    offers: list[ShopOffer] = []
    for source in SHOP_SOURCES:
        if source.name not in source_names:
            continue
        try:
            found = source.fetch_offers(http)
            print(f"{source.name}: {len(found)} kampanjevarer", file=sys.stderr)
            offers.extend(found)
        except Exception as err:  # én død kilde skal ikke stoppe kjøringen
            print(f"{source.name}: FEILET — {err}", file=sys.stderr)
    return offers


def evaluate_all(http, offers: list[ShopOffer], cfg: Config) -> tuple[list[Deal], list[FinnListing]]:
    deals: list[Deal] = []
    all_listings: list[FinnListing] = []
    finn_cache: dict[str, list[FinnListing]] = {}  # ett Finn-søk per modell
    for offer in offers:
        model = offer_model(offer)
        if model is None:
            deals.append(Deal(offer, 0, None, None, None, note="fant ikke modellnummer"))
            continue
        # Gjenbruk søket også når modellene bare skiller seg i regionsuffiks
        # (OLED55C4 hos én butikk, OLED55C46LA hos en annen).
        key = next(
            (k for k in finn_cache if models_match(k, model)),
            normalize_model(model),
        )
        if key not in finn_cache:
            try:
                finn_cache[key] = finn.search(http, model)
                all_listings.extend(finn_cache[key])
            except Exception as err:
                print(f"finn ({model}): FEILET — {err}", file=sys.stderr)
                finn_cache[key] = []
        deals.append(evaluate_offer(offer, finn_cache[key], cfg))
    return deals, all_listings


def main() -> int:
    parser = argparse.ArgumentParser(prog="arbitrasje", description=__doc__)
    parser.add_argument("--db", default="data.sqlite", help="SQLite-fil (default: data.sqlite)")
    parser.add_argument("--no-cache", action="store_true", help="skru av 6 t HTTP-cache")
    parser.add_argument("--finn-gebyr", type=float, default=0.0, help="gebyr per salg i kr")
    parser.add_argument("--frakt", type=float, default=0.0, help="fraktkostnad per salg i kr")
    parser.add_argument(
        "--kilder",
        default=",".join(s.name for s in SHOP_SOURCES),
        help="kommaseparert liste over butikker (default: alle)",
    )
    args = parser.parse_args()

    database = dbmod.open_db(args.db)
    http = Http(database, use_cache=not args.no_cache)
    cfg = Config(finn_gebyr=args.finn_gebyr, frakt=args.frakt)
    try:
        offers = collect_offers(http, args.kilder.split(","))
        if not offers:
            print("Ingen kampanjevarer hentet — se feilmeldingene over.", file=sys.stderr)
            return 1
        deals, listings = evaluate_all(http, offers, cfg)
        run_id = dbmod.start_run(database)
        dbmod.save_offers(database, run_id, offers)
        dbmod.save_listings(database, run_id, listings)
        dbmod.save_deals(database, run_id, deals)
        print(format_table(deals))
        return 0
    finally:
        http.close()
        database.close()


if __name__ == "__main__":
    sys.exit(main())
