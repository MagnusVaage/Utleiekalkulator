"""Vurdering av én butikkvare mot Finn-annonsene: filter, p25 og gevinst."""

from dataclasses import dataclass

from .matching import matches
from .models import Deal, FinnListing, ShopOffer
from .stats import percentile

MIN_LISTINGS = 3


@dataclass(frozen=True)
class Config:
    # Torget-annonser er gratis for privatpersoner, og med Fiks ferdig betaler
    # kjøper frakten — derfor 0 som default. Overstyres med CLI-flagg.
    finn_gebyr: float = 0.0
    frakt: float = 0.0


def valid_comparables(offer: ShopOffer, listings: list[FinnListing]) -> list[FinnListing]:
    """Annonser som teller: tilstand ny/som ny, privat selger, sikker match.

    Ukjent tilstand eller ukjent selgertype ekskluderes — spesifikasjonen
    krever riktig vare, så tvil teller ikke med.
    """
    return [
        l
        for l in listings
        if l.condition in ("ny", "som_ny") and l.private_seller is True and matches(offer, l)
    ]


def evaluate_offer(offer: ShopOffer, listings: list[FinnListing], cfg: Config) -> Deal:
    valid = valid_comparables(offer, listings)
    if len(valid) < MIN_LISTINGS:
        return Deal(offer, len(valid), None, None, None, note="for tynt grunnlag")
    # p25, ikke laveste: enkeltannonser er ofte feilpriset eller feil variant.
    p25 = percentile([l.price_nok for l in valid], 25)
    gevinst = p25 - offer.price_nok - cfg.finn_gebyr - cfg.frakt
    return Deal(offer, len(valid), p25, gevinst, 100 * gevinst / offer.price_nok)
