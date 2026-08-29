import type { MarketplaceAdapter, RawListing } from "../types.ts";
import { parseCondition } from "../normalize.ts";
import { fetchJson } from "./http.ts";

/**
 * Bruktpriser fra Finn Torget.
 *
 * MERK: Endepunkt og responsform er IKKE verifisert — nettverkspolicyen i
 * utviklingsmiljøet blokkerer finn.no. search-qf er Finns eget søke-API som
 * frontenden bruker; det kan svare 403 pga. bot-beskyttelse. Fungerer ikke
 * vanlig fetch, fall tilbake på Playwright (Chromium er forhåndsinstallert:
 * executablePath "/opt/pw-browsers/chromium") og hent samme JSON via
 * page.request, eller les __NEXT_DATA__ fra søkesiden.
 *
 * Tilstandsfeltet er selvrapportert og upålitelig — behold alle annonser og
 * la rapporten filtrere, i stedet for å kaste dem her.
 */
const SEARCH_URL = "https://www.finn.no/api/search-qf";

export function parseFinnResponse(json: unknown): RawListing[] {
  const docs = (json as { docs?: unknown[] })?.docs;
  if (!Array.isArray(docs)) {
    throw new Error("finn: uventet responsform — verifiser endepunkt og felt");
  }
  const listings: RawListing[] = [];
  for (const d of docs) {
    const doc = d as Record<string, unknown>;
    const price = (doc.price as { amount?: number })?.amount;
    if (typeof price !== "number") continue; // «Gis bort» / uten pris
    listings.push({
      source: "finn",
      sourceId: String(doc.ad_id ?? doc.id),
      title: String(doc.heading ?? ""),
      priceNok: price,
      url: String(doc.canonical_url ?? ""),
      condition: parseCondition(doc.condition as string | undefined),
    });
  }
  return listings;
}

export const finnAdapter: MarketplaceAdapter = {
  source: "finn",
  async search(query: string): Promise<RawListing[]> {
    const url = `${SEARCH_URL}?${new URLSearchParams({
      searchkey: "SEARCH_ID_BAP_COMMON",
      q: query,
    })}`;
    return parseFinnResponse(await fetchJson(url));
  },
};
