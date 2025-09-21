import type { SupabaseClient } from "@supabase/supabase-js";
import type { Catalog, EventBreakdown, PriceCatalogRow } from "./types";
import type { QuoteRequest, Service } from "./types";

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

  // If both are selected, try to use combo
  if (hasMakeup && hasHair) {
    // Prefer combo if it exists and is not more expensive than separate
    if (catalog[comboCode]) {
      const combo = catalog[comboCode].price_cents;
      const separate =
        (catalog[makeupCode]?.price_cents ?? Number.POSITIVE_INFINITY) +
        (catalog[hairCode]?.price_cents ?? Number.POSITIVE_INFINITY);

      if (combo <= separate) {
        return [comboCode];
      }
    }
    // Fallback: charge both separately
    return [makeupCode, hairCode];
  }

  if (hasMakeup) return [makeupCode];
  if (hasHair) return [hairCode];

  // No services selected for this event
  return [];
}

export function computeBreakdown(
  parsed: QuoteRequest,
  catalog: Catalog
): { breakdown: EventBreakdown[]; total_cents: number } {
  const breakdown = parsed.events.map<EventBreakdown>((e) => {
    const codes = codesFor(parsed.serviceType, e.services, catalog);
    let eventSubtotal = 0;
    const lines: EventBreakdown["lines"] = [];

    for (const code of codes) {
      const item = catalog[code];
      if (!item) continue;

      // Ensure people is numeric (API layer should coerce, but guard anyway)
      const peopleCount =
        typeof e.people === "string" ? Number(e.people) : e.people || 0;

      const amount = item.price_cents * peopleCount; // per-person pricing
      eventSubtotal += amount;
      lines.push({ label: item.name, amount_cents: amount });
    }

    return {
      eventType: e.eventType,
      date: e.date,
      time: e.time,
      location: e.location || parsed.contact.address,
      people: typeof e.people === "string" ? Number(e.people) : e.people,
      services: e.services,
      lines,
      event_subtotal_cents: eventSubtotal,
    };
  });

  const total_cents = breakdown.reduce(
    (sum, evt) => sum + evt.event_subtotal_cents,
    0
  );
  return { breakdown, total_cents };
}
