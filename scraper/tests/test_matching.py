import unittest

from arbitrasje.matching import matches, models_match
from arbitrasje.models import FinnListing, ShopOffer
from arbitrasje.normalize import extract_model, extract_variant, normalize_model, variants_conflict


def offer(title, **kwargs):
    return ShopOffer(shop="power", sku="1", title=title, price_nok=1000, url="u", **kwargs)


def listing(title, **kwargs):
    return FinnListing(ad_id="1", title=title, price_nok=800, url="u", **kwargs)


class TestNormalizeModel(unittest.TestCase):
    def test_strips_separators_and_case(self):
        self.assertEqual(normalize_model("OLED 55 C4"), "OLED55C4")
        self.assertEqual(normalize_model("ww90t534aaw/s6"), "WW90T534AAWS6")


class TestModelsMatch(unittest.TestCase):
    def test_spec_examples(self):
        self.assertTrue(models_match("OLED55C4", "OLED 55 C4"))
        self.assertTrue(models_match("OLED55C4", "OLED55C46LA"))
        self.assertTrue(models_match("OLED 55 C4", "OLED55C46LA"))

    def test_different_series_rejected(self):
        self.assertFalse(models_match("OLED55C4", "OLED55C3"))
        self.assertFalse(models_match("OLED55C4", "OLED65C46LA"))  # annen størrelse

    def test_product_word_suffix_is_not_region_suffix(self):
        # "PRO"/"FE" uten siffer er et annet produkt, ikke et regionsuffiks.
        self.assertFalse(models_match("IPHONE15", "IPHONE15PRO"))
        self.assertFalse(models_match("GALAXYS24", "GALAXYS24FE"))

    def test_short_models_never_prefix_match(self):
        self.assertFalse(models_match("PS5", "PS512"))


class TestExtractModel(unittest.TestCase):
    def test_finds_model_in_title(self):
        self.assertEqual(extract_model("LG OLED55C46LA 55\" OLED TV"), "OLED55C46LA")
        self.assertEqual(extract_model("Sony WH-1000XM5 selges"), "WH-1000XM5")

    def test_rejects_units_years_and_plain_words(self):
        self.assertIsNone(extract_model("Pen sofa fra 2021, 3-seter"))
        self.assertIsNone(extract_model("iPhone 13 Pro 128GB"))


class TestVariants(unittest.TestCase):
    def test_size_conflict(self):
        a = extract_variant('LG OLED55C4 55" TV')
        b = extract_variant('LG OLED65C4 65 tommer')
        self.assertTrue(variants_conflict(a, b))

    def test_storage_conflict_and_tb_normalization(self):
        a = extract_variant("MacBook Air M2 256GB")
        b = extract_variant("MacBook Air M2 1TB")
        self.assertTrue(variants_conflict(a, b))
        self.assertEqual(b.storage_gb, 1000)

    def test_ram_not_counted_as_storage(self):
        v = extract_variant("Laptop 16GB RAM 512GB SSD")
        self.assertEqual(v.storage_gb, 512)

    def test_color_and_year_conflicts(self):
        self.assertTrue(
            variants_conflict(extract_variant("iPad svart 2023"), extract_variant("iPad hvit 2023"))
        )
        self.assertTrue(
            variants_conflict(extract_variant("iPad 2022-modell"), extract_variant("iPad 2024"))
        )

    def test_missing_attribute_is_not_conflict(self):
        a = extract_variant('LG OLED55C4 55" svart')
        b = extract_variant("LG OLED55C4 lite brukt")
        self.assertFalse(variants_conflict(a, b))


class TestMatches(unittest.TestCase):
    def test_ean_match_wins(self):
        self.assertTrue(matches(offer("Vare A", ean="7030000000001"), listing("Noe helt annet", ean="7030000000001")))
        self.assertFalse(matches(offer("LG OLED55C4", ean="7030000000001"), listing("LG OLED55C4", ean="7030000000002")))

    def test_model_match_with_region_suffix(self):
        self.assertTrue(matches(offer('LG OLED55C4 55" TV'), listing("LG OLED55C46LA som ny")))

    def test_variant_mismatch_rejected(self):
        self.assertFalse(matches(offer('LG OLED55C4 55" TV'), listing('LG OLED65C4 65" TV')))

    def test_no_model_means_no_match(self):
        self.assertFalse(matches(offer("Fin TV selges"), listing("LG OLED55C4")))


if __name__ == "__main__":
    unittest.main()
