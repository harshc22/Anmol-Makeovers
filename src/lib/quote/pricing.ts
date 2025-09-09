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

function codesFor(
  serviceType: "Bridal" | "Non-Bridal",
  services: Service[]
): string[] {
  const prefix = serviceType === "Bridal" ? "br" : "nb";
  const map: Record<Service, string> = {
    makeup: `${prefix}_makeup`,
    hair: `${prefix}_hair`,
    combo: `${prefix}_combo`,
  };
  return services.map((s) => map[s]);
}

export function computeBreakdown(
  parsed: QuoteRequest,
  catalog: Catalog
): { breakdown: EventBreakdown[]; total_cents: number } {
  const breakdown = parsed.events.map<EventBreakdown>((e) => {
    const codes = codesFor(parsed.serviceType, e.services);
    let eventSubtotal = 0;
    const lines: EventBreakdown["lines"] = [];

    for (const code of codes) {
      const item = catalog[code];
      if (!item) continue;
      const amount = item.price_cents * e.people; // per-person pricing
      eventSubtotal += amount;
      lines.push({ label: item.name, amount_cents: amount });
    }

    return {
      eventType: e.eventType,
      date: e.date,
      time: e.time,
      location: e.location || parsed.contact.address,
      people: e.people,
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
