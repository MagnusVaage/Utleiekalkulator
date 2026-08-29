import { buildReport, ingestListings, openDb } from "./db.ts";
import { powerAdapter } from "./adapters/power.ts";
import { elkjopAdapter } from "./adapters/elkjop.ts";
import { finnAdapter } from "./adapters/finn.ts";
import type { MarketplaceAdapter } from "./types.ts";

const ADAPTERS: MarketplaceAdapter[] = [powerAdapter, elkjopAdapter, finnAdapter];
const DB_PATH = process.env.SCRAPER_DB ?? "data.sqlite";

const nok = (n: number) => `${Math.round(n).toLocaleString("nb-NO")} kr`;

async function scrape(query: string) {
  const db = openDb(DB_PATH);
  for (const adapter of ADAPTERS) {
    try {
      const listings = await adapter.search(query);
      const { inserted, skipped } = ingestListings(db, listings);
      console.log(
        `${adapter.source}: ${inserted} lagret` +
          (skipped ? `, ${skipped} hoppet over (fant ikke modellnummer)` : ""),
      );
    } catch (err) {
      console.error(`${adapter.source}: FEILET — ${(err as Error).message}`);
    }
  }
  db.close();
}

function report() {
  const db = openDb(DB_PATH);
  const rows = buildReport(db);
  db.close();
  if (rows.length === 0) {
    console.log("Ingen produkter i databasen ennå. Kjør `npm run scrape -- \"<søk>\"` først.");
    return;
  }
  for (const r of rows) {
    console.log(`\n${r.brand ? `${r.brand} ` : ""}${r.modelNumber}`);
    console.log(`  Nypris (power/elkjøp): ${r.newPriceNok !== null ? nok(r.newPriceNok) : "ikke observert"}`);
    if (r.used) {
      console.log(
        `  Brukt (finn, ${r.used.count} annonser): median ${nok(r.used.median)}` +
          ` [p25 ${nok(r.used.p25)} – p75 ${nok(r.used.p75)}]`,
      );
    } else {
      console.log("  Brukt (finn): ingen annonser observert");
    }
    if (r.usedToNewRatio !== null) {
      console.log(`  Bruktmedian / nypris: ${(r.usedToNewRatio * 100).toFixed(0)} %`);
    }
  }
}

const [command, ...rest] = process.argv.slice(2);
if (command === "scrape" && rest.length > 0) {
  await scrape(rest.join(" "));
} else if (command === "report") {
  report();
} else {
  console.log('Bruk:\n  node src/index.ts scrape "<søk>"\n  node src/index.ts report');
  process.exit(1);
}
