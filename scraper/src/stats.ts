/**
 * Persentil med lineær interpolasjon (samme metode som numpy sin default).
 * p i [0, 100]. Kaster på tom liste.
 */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) throw new Error("percentile: tom liste");
  if (p < 0 || p > 100) throw new Error(`percentile: ugyldig p=${p}`);
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export interface PriceSummary {
  count: number;
  min: number;
  p25: number;
  median: number;
  p75: number;
  max: number;
}

export function summarizePrices(prices: number[]): PriceSummary | null {
  if (prices.length === 0) return null;
  return {
    count: prices.length,
    min: Math.min(...prices),
    p25: percentile(prices, 25),
    median: percentile(prices, 50),
    p75: percentile(prices, 75),
    max: Math.max(...prices),
  };
}
