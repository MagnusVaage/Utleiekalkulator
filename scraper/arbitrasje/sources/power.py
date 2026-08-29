"""Kampanjevarer fra power.no.

UVERIFISERT: nettverkspolicyen i utviklingsmiljøet blokkerer power.no, så
endepunkt og feltnavn er antagelser. power.no er en SPA — åpne Network-fanen
under en kampanjeside for å finne riktig produkt-API (søk etter XHR-kall som
returnerer produktlister med priser), og juster URL og parse_products.
"""

from ..models import ShopOffer

SEARCH_URL = "https://www.power.no/api/v2/products?size=100&onSale=true"
name = "power"


def parse_products(payload) -> list[ShopOffer]:
    products = payload.get("products") if isinstance(payload, dict) else None
    if not isinstance(products, list):
        raise ValueError("power: uventet responsform — verifiser endepunkt og felt")
    offers = []
    for p in products:
        offers.append(
            ShopOffer(
                shop=name,
                sku=str(p.get("productId") or p.get("id")),
                title=str(p.get("title") or p.get("name") or ""),
                price_nok=float(p["price"]),
                url="https://www.power.no" + str(p.get("url") or ""),
                ean=str(p["ean"]) if p.get("ean") else None,
                model=str(p["modelNumber"]) if p.get("modelNumber") else None,
                brand=str(p["brandName"]) if p.get("brandName") else None,
            )
        )
    return offers


def fetch_offers(http) -> list[ShopOffer]:
    return parse_products(http.get_json(SEARCH_URL))
