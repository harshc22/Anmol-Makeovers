import nodemailer, { type Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { format, parseISO } from "date-fns";
import type { EventBreakdown, QuoteRequest } from "./types";
import { money } from "@/lib/utils/money";
import { TRAVEL_THRESHOLD_KM } from "./distance";

function formatDateTime(dateStr: string, timeStr: string): string {
  try {
    // Parse the date string (YYYY-MM-DD format) and combine with time
    const date = parseISO(`${dateStr}T${timeStr}`);
    
    // Format with date-fns - much cleaner!
    return format(date, "do MMMM',' yyyy 'at' h:mm a");
  } catch (error) {
    // Fallback to original format if parsing fails
    return `${dateStr} ${timeStr}`;
  }
}

let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

export function getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER as string,
      pass: process.env.GMAIL_APP_PASSWORD as string,
    },
  });
  return transporter;
}

function formatServices(svcs: string[] | undefined): string {
  if (!svcs || svcs.length === 0) return "-";
  // normalize casing like ["Makeup","Hair"] or ["makeup","hair"]
  return svcs
    .map((s) => s.toString().trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(", ");
}

export function buildEmail(
  parsed: QuoteRequest,
  breakdown: EventBreakdown[],
  services_total_cents: number,
  travel_total_cents: number,
  total_cents: number
): { subject: string; text: string; from: string; to: string } {
  const submittedAt = new Date().toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const subject = `New Quote • ${parsed.serviceType} • ${money(total_cents)}`;

  const fromName = process.env.GMAIL_NAME?.trim();
  const fromUser = process.env.GMAIL_USER ?? "";
  const from = fromName ? `${fromName} <${fromUser}>` : (fromUser as string);

  // HEADER
  const headerLines = [
    `Type       : ${parsed.serviceType}`,
    `Estimate   : ${money(total_cents)}`,
    `Submitted  : ${submittedAt}`,
    "",
    "Client",
    ` • Name    : ${parsed.contact.name}`,
    ` • Email   : ${parsed.contact.email}`,
    ` • Phone   : ${parsed.contact.phone}`,
    ` • Notes   : ${parsed.contact.notes?.trim() || "-"}`,
    "",
    "Events",
  ];

  const renderTravel = (e: EventBreakdown) => {
    const fee = (e as any).travel_fee_cents as number | undefined;
    const distText =
      (e as any).travel_distance_text ??
      (typeof (e as any).travel_distance_km === "number"
        ? `${(e as any).travel_distance_km.toFixed(1)} km`
        : undefined);
    const threshold =
      (e as any).travel_threshold_km ?? TRAVEL_THRESHOLD_KM ?? 10;

    // Only show travel for on-site events
    if (e.locationType !== "onsite") return null;

    if (typeof fee === "number") {
      if (fee > 0) {
        return `     Travel   : ${money(fee)} (distance ${distText ?? "—"}; first ${threshold} km included)`;
      }
      // fee is 0 but we may still know the distance
      if (distText) {
        return `     Travel   : Included (distance ${distText}; first ${threshold} km included)`;
      }
      return `     Travel   : Included (within ${threshold} km)`;
    }

    // No fee computed (e.g., distance lookup failed or you used sync breakdown)
    return `     Travel   : Pending distance check`;
  };

  // EVENTS
  const eventsText = breakdown
    .map((e, i) => {
      const servicesList = formatServices(e.services as unknown as string[]);
      const peopleCount =
        typeof e.people === "string" ? Number(e.people) : e.people;

      const lines = [
        `  ${i + 1}. ${e.eventType || "Event"}`,
        `     Ready Date/Time : ${formatDateTime(e.date, e.time)}`,
        `     Ready Location  : ${
          e.locationType === "studio"
            ? "In studio"
            : e.locationAddress || "On-site (address not provided)"
        }`,
        `     People   : ${peopleCount}`,
        `     Services : ${servicesList}`,
        `     Subtotal : ${money(e.event_subtotal_cents)}`,
      ];

      const travelLine = renderTravel(e);
      if (travelLine) lines.push(travelLine);

      return lines.join("\n");
    })
    .join("\n\n");

  // TOTALS
  const totalsBlock = [
    "",
    "Totals",
    ` • Services : ${money(services_total_cents)}`,
    ...(travel_total_cents > 0 ? [` • Travel   : ${money(travel_total_cents)}`] : []),
    ` • Grand    : ${money(total_cents)}`,
  ].join("\n");

  const text = [...headerLines, eventsText, totalsBlock].join("\n");

  return { subject, text, from, to: process.env.ADMIN_EMAIL as string };
}
