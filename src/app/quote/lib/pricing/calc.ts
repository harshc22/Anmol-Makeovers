import type { QuoteInput, EventInput } from "../schemas/quote";
import type { Catalog } from "./catalog";

function codesFor(serviceType: "Bridal" | "Non-Bridal", services: string[]) {
  const bridal = serviceType === "Bridal";
  const hasMakeup = services.includes("makeup");
  const hasHair = services.includes("hair");
  const hasCombo = services.includes("combo") || (hasMakeup && hasHair);
  if (hasCombo) return [bridal ? "bridal_combo" : "nb_combo"];
  if (hasMakeup) return [bridal ? "bridal_makeup" : "nb_makeup"];
  if (hasHair) return [bridal ? "bridal_hair" : "nb_hair"];
  return [];
}

export type PriceLine = {
  eventType: string; date: string; time: string; location: string; people: number;
  chosen_codes: string[]; lines: { label: string; amount_cents: number }[];
  event_subtotal_cents: number;
};

function calcEvent(serviceType: "Bridal" | "Non-Bridal", e: EventInput, catalog: Catalog): PriceLine {
  const codes = codesFor(serviceType, e.services);
  let subtotal = 0; const lines: PriceLine["lines"] = [];
  for (const code of codes) {
    const item = catalog[code]; if (!item) continue;
    const amt = item.price_cents * e.people;
    lines.push({ label: `${item.name} x ${e.people}`, amount_cents: amt });
    subtotal += amt;
  }
  return { eventType: e.eventType, date: e.date, time: e.time, location: e.location,
           people: e.people, chosen_codes: codes, lines, event_subtotal_cents: subtotal };
}

export function calcQuote(body: QuoteInput, catalog: Catalog) {
  const perEvent = body.events.map(e => calcEvent(body.serviceType, e, catalog));
  const totalCents = perEvent.reduce((s, e) => s + e.event_subtotal_cents, 0);
  return { perEvent, totalCents };
}
