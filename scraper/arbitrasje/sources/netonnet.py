"""Kampanje-/outletvarer fra netonnet.no.

IKKE IMPLEMENTERT: nettverkspolicyen i utviklingsmiljøet blokkerer
netonnet.no, så API-et kunne ikke inspiseres. NetOnNet har en egen
outlet-seksjon; finn JSON-kallet bak den via Network-fanen og implementer
på samme mønster som power.py. Ikke parse HTML hvis API finnes.
"""

from ..models import ShopOffer

name = "netonnet"


def fetch_offers(http) -> list[ShopOffer]:
    raise NotImplementedError("netonnet: endepunkt ikke kartlagt ennå (se kommentar i netonnet.py)")
