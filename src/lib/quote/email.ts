import nodemailer, { type Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { format, parseISO } from "date-fns";
import type { EventBreakdown, QuoteRequest } from "./types";
import { money } from "@/lib/utils/money";

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
    ` • Email   : ${parsed.contact.email}`,
    ` • Phone   : ${parsed.contact.phone}`,
    ` • Address : ${parsed.contact.address}`,
    ` • Notes   : ${parsed.contact.notes?.trim() || "-"}`,
    "",
    "Events",
  ];

  // EVENTS
  const eventsText = breakdown
    .map((e, i) => {
      const servicesList = formatServices(e.services as unknown as string[]);
      const peopleCount =
        typeof e.people === "string" ? Number(e.people) : e.people;

      const lineItems = e.lines
        .map((l) => `    • ${l.label} — ${money(l.amount_cents)}`)
        .join("\n");

      return [
        `  ${i + 1}. ${e.eventType || "Event"}`,
        `     Date/Time : ${formatDateTime(e.date, e.time)}`,
        `     Location  : ${e.location}`,
        `     People    : ${peopleCount}`,
        `     Services  : ${servicesList}`,
        `     Line Items:\n${lineItems}`,
        `     Subtotal  : ${money(e.event_subtotal_cents)}`,
      ].join("\n");
    })
    .join("\n\n");

  const footer = [
    "",
    `TOTAL: ${money(total_cents)}`,
  ].join("\n");

  const text = [...headerLines, eventsText, footer].join("\n");

  return { subject, text, from, to: process.env.ADMIN_EMAIL as string };
}
