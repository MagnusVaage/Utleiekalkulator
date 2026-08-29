"""Datamodell for arbitrasje-scraperen."""

from dataclasses import dataclass


@dataclass(frozen=True)
class ShopOffer:
    """Kampanje-/outletvare hos en butikk."""

    shop: str
    sku: str
    title: str
    price_nok: float
    url: str
    ean: str | None = None
    model: str | None = None
    brand: str | None = None


@dataclass(frozen=True)
class FinnListing:
    """Aktiv annonse på Finn Torget."""

    ad_id: str
    title: str
    price_nok: float
    url: str
    # Selvrapportert av selger: "ny", "som_ny", "brukt" eller None (ukjent).
    condition: str | None = None
    # None = ukjent. Kun True (privat selger) slipper gjennom filteret.
    private_seller: bool | None = None
    ean: str | None = None


@dataclass(frozen=True)
class Deal:
    """Én rad i rapporten: butikkpris mot Finn-prisnivå."""

    offer: ShopOffer
    n_listings: int
    finn_p25: float | None
    gevinst: float | None
    pct: float | None
    # Satt når raden ikke kan beregnes, f.eks. "for tynt grunnlag".
    note: str | None = None
