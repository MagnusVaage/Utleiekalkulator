export type Source = "power" | "elkjop" | "finn";

/**
 * Tilstand slik kilden oppgir den. Merk: på Finn er dette selvrapportert av
 * selger og ofte feilsatt — modellnummer i tittelen er et sterkere signal
 * enn tilstandsfeltet. Bruk feltet til filtrering, ikke som fasit.
 */
export type Condition = "ny" | "som_ny" | "brukt" | "ukjent";

/** Én annonse/ett produkt slik adapteren fant det, før normalisering. */
export interface RawListing {
  source: Source;
  /** Stabil id hos kilden (annonse-id eller produkt-id), brukes til dedup. */
  sourceId: string;
  title: string;
  priceNok: number;
  url: string;
  /** Kun relevant for bruktmarked (finn). */
  condition?: Condition;
  brand?: string;
  /** Settes når kilden eksponerer modellnummer strukturert (power/elkjøp). */
  modelNumber?: string;
}

export interface MarketplaceAdapter {
  readonly source: Source;
  /** Søk etter produkter/annonser. Kaster ved nettverks-/parsefeil. */
  search(query: string): Promise<RawListing[]>;
}
