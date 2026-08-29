"""Matching butikkvare <-> Finn-annonse. Kun sikre treff — aldri fuzzy."""

from .models import FinnListing, ShopOffer
from .normalize import extract_model, extract_variant, normalize_model, variants_conflict

# Ved prefiks-match må resten se ut som et regions-/chassissuffiks:
# kort og med minst ett siffer ("OLED55C4" + "6LA"). Krav om siffer hindrer
# falske treff der resten er et produktord ("PRO", "PLUS", "FE").
_MAX_SUFFIX_LEN = 4
_MIN_PREFIX_LEN = 5


def models_match(a: str, b: str) -> bool:
    ka, kb = normalize_model(a), normalize_model(b)
    if not ka or not kb:
        return False
    if ka == kb:
        return True
    short, long = sorted((ka, kb), key=len)
    if len(short) < _MIN_PREFIX_LEN or not long.startswith(short):
        return False
    rest = long[len(short):]
    return len(rest) <= _MAX_SUFFIX_LEN and any(c.isdigit() for c in rest)


def offer_model(offer: ShopOffer) -> str | None:
    """Butikkens strukturerte modellfelt, ellers uttrekk fra tittelen."""
    return offer.model or extract_model(offer.title)


def matches(offer: ShopOffer, listing: FinnListing) -> bool:
    """Regel 1: lik EAN/GTIN -> godkjent. Regel 2: modellnummer-match uten
    variantkonflikt -> godkjent. Alt annet -> forkastes."""
    if offer.ean and listing.ean:
        return offer.ean == listing.ean
    model = offer_model(offer)
    listing_model = extract_model(listing.title)
    if not model or not listing_model:
        return False
    if not models_match(model, listing_model):
        return False
    return not variants_conflict(extract_variant(offer.title), extract_variant(listing.title))
