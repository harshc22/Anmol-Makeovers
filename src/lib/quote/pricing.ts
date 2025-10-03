import type { SupabaseClient } from "@supabase/supabase-js";
import type { Catalog, EventBreakdown, PriceCatalogRow } from "./types";
import type { QuoteRequest, Service } from "./types";
import { distanceFromStudioKm } from "./travel";
import { computeTravelFeeCents, TRAVEL_THRESHOLD_KM } from "./distance";

export type TravelInfo = {
  applies: boolean;
  distance_km?: number;
  distance_text?: string;
  travel_fee_cents: number;
};

function isPriceCatalogRow(row: unknown): row is PriceCatalogRow {
  if (typeof row !== "object" || row === null) return false;
  const r = row as Record<string, unknown>;
  return (
    typeof r.code === "string" &&
    typeof r.display_name === "string" &&
    (typeof r.price_cents === "number" || typeof r.price_cents === "string")
  );
}

export async function loadCatalog(supabase: SupabaseClient): Promise<Catalog> {
  const { data, error } = await supabase
    .from("price_catalog")
    .select("code, display_name, price_cents");

  if (error) throw new Error(`price_catalog load error: ${error.message}`);

  const catalog: Catalog = {};
  for (const row of data ?? []) {
    if (!isPriceCatalogRow(row)) continue;
    catalog[row.code] = {
      name: row.display_name,
      price_cents:
        typeof row.price_cents === "string"
          ? Number(row.price_cents)
          : row.price_cents,
    };
  }
  return catalog;
}

/**
 * Maps selected services to catalog code(s), automatically preferring the combo
 * price per person when both makeup & hair are selected and a combo is present.
 * Falls back to separate items if combo is missing or (optionally) more expensive.
 */
function codesFor(
  serviceType: "Bridal" | "Non-Bridal",
  services: Service[],
  catalog: Catalog
): string[] {
  const prefix = serviceType === "Bridal" ? "br" : "nb";

  const hasMakeup = services.includes("makeup");
  const hasHair = services.includes("hair");

  const makeupCode = `${prefix}_makeup`;
  const hairCode = `${prefix}_hair`;
  const comboCode = `${prefix}_combo`;

  if (hasMakeup && hasHair) {
    if (catalog[comboCode]) {
      const combo = catalog[comboCode].price_cents;
      const separate =
        (catalog[makeupCode]?.price_cents ?? Number.POSITIVE_INFINITY) +
        (catalog[hairCode]?.price_cents ?? Number.POSITIVE_INFINITY);
      if (combo <= separate) return [comboCode];
    }
    return [makeupCode, hairCode];
  }

  if (hasMakeup) return [makeupCode];
  if (hasHair) return [hairCode];
  return [];
}

function getPlaceIdFromEvent(ev: unknown): string | undefined {
  if (!ev || typeof ev !== "object") return undefined;
  const v = (ev as Record<string, unknown>)["locationPlaceId"];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export async function computeBreakdown(
  parsed: QuoteRequest,
  catalog: Catalog
): Promise<{
  breakdown: (EventBreakdown & {
    travel_fee_cents: number;
    travel_distance_km?: number;
    travel_distance_text?: string;
    travel_threshold_km: number;
  })[];
  services_total_cents: number;
  travel_total_cents: number;
  total_cents: number;
}> {
  const breakdown = await Promise.all(
    parsed.events.map(async (e) => {
      const codes = codesFor(parsed.serviceType, e.services, catalog);
      let eventSubtotal = 0;

      for (const code of codes) {
        const item = catalog[code];
        if (!item) continue;

        const peopleCount =
          typeof e.people === "string" ? Number(e.people) : e.people || 0;

        const amount = item.price_cents * peopleCount; // per-person pricing
        eventSubtotal += amount;
      }

      let travel_fee_cents = 0;
      let travel_distance_km: number | undefined;
      let travel_distance_text: string | undefined;

      if (e.locationType === "onsite") {
        const dist = await distanceFromStudioKm({
          destinationPlaceId: getPlaceIdFromEvent(e),
          destinationAddress: e.locationAddress ?? undefined,
        });

        if (dist.status === "ok") {
          travel_distance_km = dist.distance_km;
          travel_distance_text = dist.text;
          travel_fee_cents = computeTravelFeeCents(dist.distance_km);
        }
      }

      return {
        eventType: e.eventType,
        date: e.date,
        time: e.time,
        locationType: e.locationType,
        locationAddress: e.locationAddress || "In studio",
        people: typeof e.people === "string" ? Number(e.people) : e.people,
        services: e.services,
        event_subtotal_cents: eventSubtotal,
        travel_fee_cents,
        travel_distance_km,
        travel_distance_text,
        travel_threshold_km: TRAVEL_THRESHOLD_KM,
      };
    })
  );

  const services_total_cents = breakdown.reduce(
    (sum, evt) => sum + evt.event_subtotal_cents,
    0
  );
  const travel_total_cents = breakdown.reduce(
    (sum, evt) => sum + (evt.travel_fee_cents ?? 0),
    0
  );
  const total_cents = services_total_cents + travel_total_cents;

  return {
    breakdown,
    services_total_cents,
    travel_total_cents,
    total_cents,
  };
}
