import test from "node:test";
import assert from "node:assert/strict";
import { percentile, summarizePrices } from "../src/stats.ts";

test("percentile med lineær interpolasjon", () => {
  const values = [1000, 2000, 3000, 4000];
  assert.equal(percentile(values, 0), 1000);
  assert.equal(percentile(values, 100), 4000);
  assert.equal(percentile(values, 50), 2500);
  assert.equal(percentile(values, 25), 1750);
});

test("percentile er uavhengig av input-rekkefølge og muterer ikke input", () => {
  const values = [3000, 1000, 4000, 2000];
  assert.equal(percentile(values, 50), 2500);
  assert.deepEqual(values, [3000, 1000, 4000, 2000]);
});

test("percentile med ett element", () => {
  assert.equal(percentile([500], 25), 500);
  assert.equal(percentile([500], 75), 500);
});

test("percentile kaster på tom liste og ugyldig p", () => {
  assert.throws(() => percentile([], 50));
  assert.throws(() => percentile([1], 101));
});

test("summarizePrices", () => {
  assert.equal(summarizePrices([]), null);
  const s = summarizePrices([1000, 2000, 3000, 4000, 5000]);
  assert.deepEqual(s, { count: 5, min: 1000, p25: 2000, median: 3000, p75: 4000, max: 5000 });
});
