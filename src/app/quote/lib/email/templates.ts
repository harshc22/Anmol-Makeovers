import type { QuoteInput } from "../schemas/quote";
import type { PriceLine } from "../pricing/calc";
import { formatMoney } from "../utils/money";

export function plainAdminSummary(body: QuoteInput, events: PriceLine[], totalCents: number) {
  const header = `New Quote Request (${body.serviceType})\n\nClient: ${body.contact.email} | ${body.contact.phone}\nAddress: ${body.contact.address}\nNotes: ${body.contact.notes ?? "-"}\n\n`;
  const ev = events.map((e,i)=>{
    const lines = e.lines.map(l=>`    • ${l.label}: ${formatMoney(l.amount_cents)}`).join("\n");
    return `Event ${i+1}: ${e.eventType} | ${e.date} ${e.time} @ ${e.location}\n${lines}\n    Subtotal: ${formatMoney(e.event_subtotal_cents)}\n`;
  }).join("\n");
  return header + ev + `\nGrand Total: ${formatMoney(totalCents)}\n`;
}
