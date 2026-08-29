"""Butikk-kilder. Hver kilde eksponerer fetch_offers(http) -> list[ShopOffer].

En kilde som feiler (nettverk, endret API, robots) skal kaste et unntak —
kjøringen i main fanger det per kilde og fortsetter med de andre.
"""

from typing import Protocol

from ..models import ShopOffer


class Source(Protocol):
    name: str

    def fetch_offers(self, http) -> list[ShopOffer]: ...
