import time
import unittest

from arbitrasje import db as dbmod
from arbitrasje.models import Deal, FinnListing, ShopOffer


class TestDb(unittest.TestCase):
    def setUp(self):
        self.db = dbmod.open_db(":memory:")

    def tearDown(self):
        self.db.close()

    def test_run_history(self):
        run_id = dbmod.start_run(self.db)
        offer = ShopOffer(shop="power", sku="1", title="Vare", price_nok=100, url="u")
        dbmod.save_offers(self.db, run_id, [offer])
        dbmod.save_listings(
            self.db,
            run_id,
            [FinnListing(ad_id="1", title="Vare", price_nok=80, url="u", condition="ny", private_seller=True)],
        )
        dbmod.save_deals(self.db, run_id, [Deal(offer, 3, 120.0, 20.0, 20.0)])
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM shop_offers").fetchone()[0], 1)
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM finn_listings").fetchone()[0], 1)
        self.assertEqual(
            self.db.execute("SELECT gevinst FROM deals WHERE run_id = ?", (run_id,)).fetchone()[0],
            20.0,
        )

    def test_cache_roundtrip_and_expiry(self):
        self.assertIsNone(dbmod.cache_get(self.db, "https://x/a"))
        dbmod.cache_put(self.db, "https://x/a", "body")
        self.assertEqual(dbmod.cache_get(self.db, "https://x/a"), "body")
        # Utløpt oppføring skal ikke returneres
        self.db.execute(
            "UPDATE http_cache SET fetched_at = ? WHERE url = ?",
            (time.time() - dbmod.CACHE_TTL_S - 1, "https://x/a"),
        )
        self.assertIsNone(dbmod.cache_get(self.db, "https://x/a"))


if __name__ == "__main__":
    unittest.main()
