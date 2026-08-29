import type { MarketplaceAdapter, RawListing } from "../types.ts";

/**
 * Nypris fra elkjop.no.
 *
 * IKKE IMPLEMENTERT: nettverkspolicyen i utviklingsmiljøet blokkerer
 * elkjop.no, så søke-API-et kunne ikke undersøkes. elkjop.no bruker et
 * internt GraphQL-/søkelag — åpne Network-fanen i nettleseren under et søk
 * for å finne endepunktet, og implementer på samme mønster som power-
 * adapteren (fetchJson + egen parse-funksjon som kan testes med fixtures).
 */
export const elkjopAdapter: MarketplaceAdapter = {
  source: "elkjop",
  async search(_query: string): Promise<RawListing[]> {
    throw new Error("elkjop-adapteren er ikke implementert ennå (se kommentar i elkjop.ts)");
  },
};
