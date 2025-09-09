import nodemailer, { type Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import type { EventBreakdown, QuoteRequest } from "./types";
import { money } from "@/lib/utils/money";

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

export function buildEmail(
  parsed: QuoteRequest,
  breakdown: EventBreakdown[],
  total_cents: number
): { subject: string; text: string; from: string; to: string } {
  const subject = `New Quote — ${parsed.serviceType} — ${money(total_cents)}`;
  const fromName = process.env.GMAIL_FROM_NAME?.trim();
  const fromUser = process.env.GMAIL_FROM ?? process.env.GMAIL_USER ?? "";
  const from = fromName ? `${fromName} <${fromUser}>` : (fromUser as string);

  const header = [
    "Client",
    ` • Email: ${parsed.contact.email}`,
    ` • Phone: ${parsed.contact.phone}`,
    ` • Address: ${parsed.contact.address}`,
    ` • Notes: ${parsed.contact.notes ?? "-"}`,
    "",
  ].join("\n");

  const eventsText = breakdown
    .map((e, i) => {
      const lines = e.lines
        .map((l) => ` • ${l.label}: ${money(l.amount_cents)}`)
        .join("\n");
      return `Event ${i + 1}: ${e.eventType} | ${e.date} ${e.time} @ ${
        e.location
      }\n${lines}\n Subtotal: ${money(e.event_subtotal_cents)}\n`;
    })
    .join("\n");

  const text = `${header}${eventsText}\nTotal: ${money(total_cents)}\n`;

  return { subject, text, from, to: process.env.ADMIN_EMAIL as string };
}
