import type { MarketplaceAdapter, RawListing } from "../types.ts";
import { fetchJson } from "./http.ts";

/**
 * Nypris fra power.no.
 *
 * MERK: Endepunkt og responsform er IKKE verifisert — nettverkspolicyen i
 * utviklingsmiljøet blokkerer power.no. power.no er en SPA; åpne Network-fanen
 * i nettleseren under et søk for å finne riktig produktsøk-API, og juster
 * URL-en og parsePowerResponse deretter.
 */
const SEARCH_URL = "https://www.power.no/api/v2/products";

export function parsePowerResponse(json: unknown): RawListing[] {
  const products = (json as { products?: unknown[] })?.products;
  if (!Array.isArray(products)) {
    throw new Error("power: uventet responsform — verifiser endepunkt og felt");
  }
  return products.map((p) => {
    const item = p as Record<string, unknown>;
    return {
      source: "power" as const,
      sourceId: String(item.productId ?? item.id),
      title: String(item.title ?? item.name ?? ""),
      priceNok: Number(item.price),
      url: new URL(String(item.url ?? ""), "https://www.power.no").href,
      brand: item.brandName ? String(item.brandName) : undefined,
      modelNumber: item.modelNumber ? String(item.modelNumber) : undefined,
    };
  });
}

export const powerAdapter: MarketplaceAdapter = {
  source: "power",
  async search(query: string): Promise<RawListing[]> {
    const url = `${SEARCH_URL}?${new URLSearchParams({ q: query, size: "30" })}`;
    return parsePowerResponse(await fetchJson(url));
  },
};
