"""Kampanje-/outletvarer fra komplett.no.

IKKE IMPLEMENTERT: nettverkspolicyen i utviklingsmiljøet blokkerer
komplett.no, så API-et kunne ikke inspiseres. Komplett har egne
kampanje-/outletsider; finn JSON-kallet bak dem via Network-fanen og
implementer på samme mønster som power.py. Ikke parse HTML hvis API finnes.
"""

from ..models import ShopOffer

name = "komplett"


def fetch_offers(http) -> list[ShopOffer]:
    raise NotImplementedError("komplett: endepunkt ikke kartlagt ennå (se kommentar i komplett.py)")
