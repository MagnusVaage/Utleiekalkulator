import unittest

from arbitrasje.sources.finn import parse_search
from arbitrasje.sources.power import parse_products

FINN_FIXTURE = {
    "docs": [
        {
            "ad_id": 111,
            "heading": "LG OLED55C46LA som ny",
            "price": {"amount": 12000},
            "canonical_url": "https://www.finn.no/111",
            "condition": "Som ny",
        },
        {
            "ad_id": 222,
            "heading": "LG OLED55C4 fra forhandler",
            "price": {"amount": 13000},
            "canonical_url": "https://www.finn.no/222",
            "condition": "Ny",
            "organisation_name": "TV-Butikken AS",
        },
        {  # uten pris ("gis bort") skal hoppes over
            "ad_id": 333,
            "heading": "Gis bort",
            "price": {},
            "canonical_url": "https://www.finn.no/333",
        },
    ]
}

POWER_FIXTURE = {
    "products": [
        {
            "productId": 42,
            "title": 'LG OLED55C4 55" OLED TV',
            "price": 9990,
            "url": "/tv/42",
            "ean": "7030000000001",
            "modelNumber": "OLED55C46LA",
            "brandName": "LG",
        }
    ]
}


class TestFinnParsing(unittest.TestCase):
    def test_parses_listings(self):
        listings = parse_search(FINN_FIXTURE)
        self.assertEqual(len(listings), 2)
        self.assertEqual(listings[0].condition, "som_ny")
        self.assertIsNone(listings[0].private_seller)  # feltet mangler = ukjent
        self.assertEqual(listings[1].private_seller, False)

    def test_unexpected_shape_raises(self):
        with self.assertRaises(ValueError):
            parse_search({"noe": "annet"})


class TestPowerParsing(unittest.TestCase):
    def test_parses_offers(self):
        offers = parse_products(POWER_FIXTURE)
        self.assertEqual(len(offers), 1)
        self.assertEqual(offers[0].model, "OLED55C46LA")
        self.assertEqual(offers[0].price_nok, 9990)
        self.assertEqual(offers[0].url, "https://www.power.no/tv/42")

    def test_unexpected_shape_raises(self):
        with self.assertRaises(ValueError):
            parse_products({"items": []})


if __name__ == "__main__":
    unittest.main()
