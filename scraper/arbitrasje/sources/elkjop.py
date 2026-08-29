"""Kampanjevarer fra elkjop.no.

IKKE IMPLEMENTERT: nettverkspolicyen i utviklingsmiljøet blokkerer
elkjop.no, så API-et kunne ikke inspiseres. elkjop.no bruker et internt
GraphQL-/søkelag. Fremgangsmåte: åpne en kampanjeside med Network-fanen
åpen, finn XHR/GraphQL-kallet som leverer produktlisten, og implementer på
samme mønster som power.py (egen parse-funksjon som kan testes med
fixtures). Ikke parse HTML — API-et finnes.
"""

from ..models import ShopOffer

name = "elkjop"


def fetch_offers(http) -> list[ShopOffer]:
    raise NotImplementedError("elkjop: endepunkt ikke kartlagt ennå (se kommentar i elkjop.py)")
