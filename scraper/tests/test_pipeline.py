import unittest

from arbitrasje.models import FinnListing, ShopOffer
from arbitrasje.pipeline import Config, evaluate_offer
from arbitrasje.stats import percentile

OFFER = ShopOffer(
    shop="power", sku="1", title='LG OLED55C4 55" OLED TV', price_nok=9990, url="u",
    model="OLED55C4",
)


def listing(price, condition="som_ny", private=True, title="LG OLED55C46LA 55\" TV"):
    return FinnListing(
        ad_id=str(price), title=title, price_nok=price, url="u",
        condition=condition, private_seller=private,
    )


class TestPercentile(unittest.TestCase):
    def test_p25_linear_interpolation(self):
        self.assertEqual(percentile([1000, 2000, 3000, 4000], 25), 1750)
        self.assertEqual(percentile([500], 25), 500)

    def test_errors(self):
        with self.assertRaises(ValueError):
            percentile([], 25)
        with self.assertRaises(ValueError):
            percentile([1], 101)


class TestEvaluateOffer(unittest.TestCase):
    def test_thin_basis_below_three_listings(self):
        deal = evaluate_offer(OFFER, [listing(12000), listing(13000)], Config())
        self.assertEqual(deal.note, "for tynt grunnlag")
        self.assertEqual(deal.n_listings, 2)
        self.assertIsNone(deal.gevinst)

    def test_filters_condition_seller_and_wrong_variant(self):
        listings = [
            listing(12000),
            listing(12500),
            listing(13000),
            listing(1000, condition="brukt"),          # feil tilstand
            listing(1000, condition=None),             # ukjent tilstand
            listing(1000, private=False),              # forhandler
            listing(1000, private=None),               # ukjent selgertype
            listing(1000, title='LG OLED65C4 65" TV'),  # feil variant
        ]
        deal = evaluate_offer(OFFER, listings, Config())
        self.assertEqual(deal.n_listings, 3)
        # p25 av [12000, 12500, 13000] = 12250; gevinst = 12250 - 9990
        self.assertEqual(deal.finn_p25, 12250)
        self.assertEqual(deal.gevinst, 2260)
        self.assertAlmostEqual(deal.pct, 100 * 2260 / 9990)

    def test_fee_and_shipping_subtracted(self):
        listings = [listing(12000), listing(12500), listing(13000)]
        deal = evaluate_offer(OFFER, listings, Config(finn_gebyr=100, frakt=150))
        self.assertEqual(deal.gevinst, 12250 - 9990 - 100 - 150)


if __name__ == "__main__":
    unittest.main()
