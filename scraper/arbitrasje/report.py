"""Tabellrapport: vare | butikk | butikkpris | finn_pris | annonser | gevinst | %."""

from .models import Deal

_HEADERS = ["vare", "butikk", "butikkpris", "finn_pris", "annonser", "gevinst", "%"]


def _nok(value: float | None) -> str:
    return f"{value:,.0f} kr".replace(",", " ") if value is not None else "–"


def _rows(deals: list[Deal]) -> list[list[str]]:
    rows = []
    for d in deals:
        rows.append(
            [
                d.offer.title[:60],
                d.offer.shop,
                _nok(d.offer.price_nok),
                _nok(d.finn_p25),
                str(d.n_listings),
                _nok(d.gevinst) if d.note is None else d.note,
                f"{d.pct:.0f} %" if d.pct is not None else "–",
            ]
        )
    return rows


def format_table(deals: list[Deal]) -> str:
    """Sortert på gevinst (høyest først); rader uten grunnlag nederst."""
    ordered = sorted(deals, key=lambda d: (d.gevinst is None, -(d.gevinst or 0)))
    rows = [_HEADERS] + _rows(ordered)
    widths = [max(len(r[i]) for r in rows) for i in range(len(_HEADERS))]
    lines = []
    for i, row in enumerate(rows):
        lines.append("  ".join(cell.ljust(w) for cell, w in zip(row, widths)).rstrip())
        if i == 0:
            lines.append("  ".join("-" * w for w in widths))
    return "\n".join(lines)
