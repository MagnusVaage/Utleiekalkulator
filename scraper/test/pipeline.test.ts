import test from "node:test";
import assert from "node:assert/strict";
import { buildReport, ingestListings, openDb } from "../src/db.ts";
import type { RawListing } from "../src/types.ts";

const LISTINGS: RawListing[] = [
  // power: strukturert modellnummer
  {
    source: "power",
    sourceId: "p-1",
    title: "Samsung WW90T534AAW vaskemaskin",
    priceNok: 7990,
    url: "https://www.power.no/x",
    brand: "Samsung",
    modelNumber: "WW90T534AAW/S6",
  },
  // finn: modellnummer må hentes fra tittel; ulik formatering skal matche
  {
    source: "finn",
    sourceId: "f-1",
    title: "Samsung ww90t534aaw-s6 vaskemaskin, som ny",
    priceNok: 4000,
    url: "https://www.finn.no/1",
    condition: "som_ny",
  },
  {
    source: "finn",
    sourceId: "f-2",
    title: "Vaskemaskin Samsung WW90T534AAW/S6",
    priceNok: 3000,
    url: "https://www.finn.no/2",
    condition: "brukt",
  },
  // finn-annonse merket "ny" skal ikke telle i bruktstatistikken
  {
    source: "finn",
    sourceId: "f-3",
    title: "NY uåpnet Samsung WW90T534AAW/S6",
    priceNok: 7000,
    url: "https://www.finn.no/3",
    condition: "ny",
  },
  // uten modellnummer: hoppes over
  {
    source: "finn",
    sourceId: "f-4",
    title: "Pen vaskemaskin selges",
    priceNok: 1500,
    url: "https://www.finn.no/4",
    condition: "brukt",
  },
];

test("ingest + rapport ende til ende", () => {
  const db = openDb(":memory:");
  const { inserted, skipped } = ingestListings(db, LISTINGS);
  assert.equal(inserted, 4);
  assert.equal(skipped, 1);

  const report = buildReport(db);
  assert.equal(report.length, 1); // alle varianter matchet samme model_key
  const r = report[0];
  assert.equal(r.brand, "Samsung");
  assert.equal(r.newPriceNok, 7990);
  assert.equal(r.used?.count, 2); // "ny"-annonsen er filtrert bort
  assert.equal(r.used?.median, 3500);
  assert.ok(Math.abs((r.usedToNewRatio ?? 0) - 3500 / 7990) < 1e-9);
  db.close();
});

test("ny observasjon av samme annonse oppdaterer i stedet for å duplisere", () => {
  const db = openDb(":memory:");
  ingestListings(db, LISTINGS);
  ingestListings(db, [{ ...LISTINGS[2], priceNok: 2500 }]);

  const report = buildReport(db);
  assert.equal(report[0].used?.count, 2);
  assert.equal(report[0].used?.median, 3250); // (4000 + 2500) / 2
  db.close();
});
