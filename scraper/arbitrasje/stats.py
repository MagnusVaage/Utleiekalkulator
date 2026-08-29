"""Persentilberegning (lineær interpolasjon, som numpy sin default)."""

import math


def percentile(values: list[float], p: float) -> float:
    if not values:
        raise ValueError("percentile: tom liste")
    if not 0 <= p <= 100:
        raise ValueError(f"percentile: ugyldig p={p}")
    ordered = sorted(values)
    idx = (p / 100) * (len(ordered) - 1)
    lo, hi = math.floor(idx), math.ceil(idx)
    if lo == hi:
        return ordered[lo]
    return ordered[lo] + (ordered[hi] - ordered[lo]) * (idx - lo)
