import type { z } from "zod";
import type { EventSchema, QuoteSchema } from "./schema";

export type ServiceType = "Bridal" | "Non-Bridal";
export type Service = "makeup" | "hair" | "combo";
export type LocationType = "studio" | "onsite";

export type EventInput = z.infer<typeof EventSchema>;
export type QuoteRequest = z.infer<typeof QuoteSchema>;

export interface CatalogItem {
  name: string;
  price_cents: number;
}
export type Catalog = Record<string, CatalogItem>;


export interface EventBreakdown {
  eventType: string;
  date: string;
  time: string;
  people: number;
  services: Service[];
  event_subtotal_cents: number;
  locationType: LocationType;
  locationAddress: string;
}

export interface PriceCatalogRow {
  code: string;
  display_name: string;
  price_cents: number | string;
}
