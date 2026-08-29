"""Normalisering av modellnummer og uttrekk av variant-attributter fra titler."""

import re
from dataclasses import dataclass

# Tokens som ligner modellnummer, men er spesifikasjoner/enheter.
_UNIT_TOKEN = re.compile(
    r"^\d+([.,]\d+)?(gb|tb|mb|ghz|mhz|hz|kg|g|cm|mm|m|l|w|kw|wh|mah|k|p|v|a|mp|fps|x|tommers?|år|stk)$",
    re.IGNORECASE,
)
_RESOLUTION_TOKEN = re.compile(r"^\d+x\d+$", re.IGNORECASE)
_YEAR_TOKEN = re.compile(r"^(19|20)\d{2}$")


def normalize_model(model: str) -> str:
    """Matchenøkkel: store bokstaver, alle skilletegn fjernet.

    "OLED 55 C4" -> "OLED55C4", "ww90t534aaw/s6" -> "WW90T534AAWS6".
    """
    return re.sub(r"[^A-Z0-9]", "", model.upper())


def extract_model(title: str) -> str | None:
    """Heuristikk: mest sannsynlige modellnummer i en tittel.

    Kandidat = token med både bokstaver og minst to sifre, minst 5 tegn,
    som ikke er enhet ("128GB"), oppløsning eller årstall. Lengste kandidat
    vinner (mest spesifikk). None når ingenting kvalifiserer — da skal
    varen/annonsen forkastes, ikke gjettes på.
    """
    best: str | None = None
    for raw in re.split(r"[\s,()\[\]!\"«»]+", title):
        token = raw.strip("-/.")
        if len(token) < 5:
            continue
        if not re.search(r"[a-zA-ZæøåÆØÅ]", token):
            continue
        if len(re.findall(r"\d", token)) < 2:
            continue
        if not re.fullmatch(r"[a-zA-Z0-9/.-]+", token):
            continue
        if _UNIT_TOKEN.match(token) or _RESOLUTION_TOKEN.match(token) or _YEAR_TOKEN.match(token):
            continue
        if best is None or len(token) > len(best):
            best = token
    return best


@dataclass(frozen=True)
class Variant:
    """Variant-attributter lest ut av en tittel. None = ikke nevnt."""

    size_inches: int | None
    storage_gb: int | None
    year: int | None
    colors: frozenset[str]


_SIZE = re.compile(r"\b(\d{2,3})\s*(?:\"|”|″|''|-?\s?tommers?\b)", re.IGNORECASE)
_STORAGE = re.compile(r"\b(\d+(?:[.,]\d+)?)\s*(tb|gb)\b(?!\s*ram)", re.IGNORECASE)
_YEAR = re.compile(r"\b(20(?:1[5-9]|2\d|3\d))\b")

# Ordstammer -> kanonisk fargenavn. Gul og gull er ulike farger.
_COLORS: dict[str, str] = {
    "svart": "svart", "sort": "svart",
    "hvit": "hvit", "hvitt": "hvit", "hvite": "hvit",
    "grå": "grå", "sølv": "sølv",
    "blå": "blå", "blått": "blå",
    "rød": "rød", "rødt": "rød",
    "grønn": "grønn", "grønt": "grønn",
    "gul": "gul", "gult": "gul", "gull": "gull",
    "rosa": "rosa", "lilla": "lilla", "beige": "beige",
    "brun": "brun", "titan": "titan",
}
_COLOR_RE = re.compile(r"\b(" + "|".join(_COLORS) + r")\b", re.IGNORECASE)


def extract_variant(title: str) -> Variant:
    sizes = _SIZE.findall(title)
    storages = _STORAGE.findall(title)
    years = _YEAR.findall(title)
    storage_gb: int | None = None
    if storages:
        # Ved flere treff ("8GB / 256GB") er det største mest sannsynlig lagring.
        in_gb = [
            float(num.replace(",", ".")) * (1000 if unit.lower() == "tb" else 1)
            for num, unit in storages
        ]
        storage_gb = int(max(in_gb))
    return Variant(
        size_inches=int(sizes[0]) if sizes else None,
        storage_gb=storage_gb,
        year=int(years[0]) if years else None,
        colors=frozenset(_COLORS[m.lower()] for m in _COLOR_RE.findall(title)),
    )


def variants_conflict(a: Variant, b: Variant) -> bool:
    """True når titlene eksplisitt beskriver ulike varianter.

    Attributter som bare er nevnt på én side regnes ikke som avvik — ellers
    forkastes nesten alt, siden Finn-titler sjelden er komplette.
    """
    for field in ("size_inches", "storage_gb", "year"):
        va, vb = getattr(a, field), getattr(b, field)
        if va is not None and vb is not None and va != vb:
            return True
    if a.colors and b.colors and not (a.colors & b.colors):
        return True
    return False
