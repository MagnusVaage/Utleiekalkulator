import unittest
from unittest import mock

from arbitrasje.__main__ import evaluate_all
from arbitrasje.models import FinnListing, ShopOffer
from arbitrasje.pipeline import Config
from arbitrasje.report import format_table


def listing(price):
    return FinnListing(
        ad_id=str(price), title='LG OLED55C46LA 55" TV', price_nok=price, url="u",
        condition="som_ny", private_seller=True,
    )


class TestEvaluateAll(unittest.TestCase):
    def test_orchestration_dedupes_searches_and_reports(self):
        offers = [
            ShopOffer(shop="power", sku="1", title='LG OLED55C4 55" TV', price_nok=9990, url="u"),
            # Samme modell hos annen butikk: skal gjenbruke Finn-søket
            ShopOffer(shop="elkjop", sku="2", title="LG OLED55C46LA TV", price_nok=10490, url="u"),
            ShopOffer(shop="power", sku="3", title="Fin TV uten modell", price_nok=500, url="u"),
        ]
        results = [listing(12000), listing(12500), listing(13000)]
        with mock.patch("arbitrasje.sources.finn.search", return_value=results) as search:
            deals, listings = evaluate_all(http=None, offers=offers, cfg=Config())

        self.assertEqual(search.call_count, 1)  # dedupet på normalisert modell
        self.assertEqual(len(deals), 3)
        self.assertEqual(deals[0].gevinst, 12250 - 9990)
        self.assertEqual(deals[1].gevinst, 12250 - 10490)
        self.assertEqual(deals[2].note, "fant ikke modellnummer")
        self.assertEqual(len(listings), 3)

        table = format_table(deals)
        lines = table.splitlines()
        self.assertIn("vare", lines[0])
        # Sortert på gevinst: power-tilbudet (størst gevinst) først,
        # raden uten grunnlag nederst.
        self.assertIn("power", lines[2])
        self.assertIn("fant ikke modellnummer", lines[-1])


if __name__ == "__main__":
    unittest.main()
