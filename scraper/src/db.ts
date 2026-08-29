import { DatabaseSync } from "node:sqlite";
import type { RawListing } from "./types.ts";
import { extractModelNumber, modelKey } from "./normalize.ts";
import { summarizePrices, type PriceSummary } from "./stats.ts";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  brand        TEXT,
  model_number TEXT NOT NULL,          -- slik det først ble sett
  model_key    TEXT NOT NULL UNIQUE,   -- normalisert, brukes til matching
  name         TEXT
);

CREATE TABLE IF NOT EXISTS listings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  source      TEXT NOT NULL,           -- 'power' | 'elkjop' | 'finn'
  source_id   TEXT NOT NULL,
  title       TEXT NOT NULL,
  price_nok   REAL NOT NULL,
  condition   TEXT,                    -- kun finn; selvrapportert
  url         TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  UNIQUE (source, source_id)
);

CREATE INDEX IF NOT EXISTS idx_listings_product ON listings(product_id);
`;

export function openDb(path: string): DatabaseSync {
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  return db;
}

export interface IngestResult {
  inserted: number;
  /** Annonser uten gjenkjennbart modellnummer — hoppet over, ikke gjettet på. */
  skipped: number;
}

/**
 * Lagrer annonser. Modellnummer tas fra strukturert felt når kilden har det,
 * ellers fra tittelen. Samme (source, source_id) sett på nytt oppdaterer
 * pris/tilstand/tidspunkt i stedet for å duplisere.
 */
export function ingestListings(db: DatabaseSync, listings: RawListing[]): IngestResult {
  const upsertProduct = db.prepare(`
    INSERT INTO products (brand, model_number, model_key, name)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(model_key) DO UPDATE SET
      brand = COALESCE(products.brand, excluded.brand),
      name  = COALESCE(products.name, excluded.name)
    RETURNING id
  `);
  const upsertListing = db.prepare(`
    INSERT INTO listings (product_id, source, source_id, title, price_nok, condition, url, observed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(source, source_id) DO UPDATE SET
      price_nok   = excluded.price_nok,
      condition   = excluded.condition,
      title       = excluded.title,
      observed_at = excluded.observed_at
  `);

  const result: IngestResult = { inserted: 0, skipped: 0 };
  const now = new Date().toISOString();
  for (const l of listings) {
    const model = l.modelNumber ?? extractModelNumber(l.title);
    if (!model) {
      result.skipped++;
      continue;
    }
    const row = upsertProduct.get(l.brand ?? null, model, modelKey(model), l.title) as { id: number };
    upsertListing.run(row.id, l.source, l.sourceId, l.title, l.priceNok, l.condition ?? null, l.url, now);
    result.inserted++;
  }
  return result;
}

export interface ProductReport {
  modelNumber: string;
  brand: string | null;
  /** Laveste nypris hos power/elkjøp, null når ingen er observert. */
  newPriceNok: number | null;
  /** Persentiler over finn-annonser som ikke er merket "ny". */
  used: PriceSummary | null;
  /** used.median / newPriceNok — grovt anslag på verditap, null uten begge. */
  usedToNewRatio: number | null;
}

export function buildReport(db: DatabaseSync): ProductReport[] {
  const products = db
    .prepare("SELECT id, brand, model_number FROM products ORDER BY model_key")
    .all() as { id: number; brand: string | null; model_number: string }[];
  const newPriceStmt = db.prepare(
    "SELECT MIN(price_nok) AS p FROM listings WHERE product_id = ? AND source IN ('power', 'elkjop')",
  );
  const usedStmt = db.prepare(
    "SELECT price_nok FROM listings WHERE product_id = ? AND source = 'finn' AND (condition IS NULL OR condition != 'ny')",
  );

  return products.map((prod) => {
    const newPrice = (newPriceStmt.get(prod.id) as { p: number | null }).p;
    const usedPrices = (usedStmt.all(prod.id) as { price_nok: number }[]).map((r) => r.price_nok);
    const used = summarizePrices(usedPrices);
    return {
      modelNumber: prod.model_number,
      brand: prod.brand,
      newPriceNok: newPrice,
      used,
      usedToNewRatio: newPrice && used ? used.median / newPrice : null,
    };
  });
}
