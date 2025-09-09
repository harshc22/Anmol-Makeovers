import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import nodemailer, { type Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// ---------- ENV ----------
const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAIL",
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
] as const;
function ensureEnv() {
  const missing = requiredEnv.filter((k) => !process.env[k]);
  if (missing.length) throw new Error("Missing env: " + missing.join(", "));
}

// Nodemailer (Gmail + app password)
let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;
function getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
  });
  return transporter;
}

// ---------- SCHEMA (matches your normalized frontend payload) ----------
const EventSchema = z.object({
  eventType: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().optional().default(""),
  people: z.coerce.number().int().min(1).max(50),
  services: z.array(z.enum(["makeup", "hair", "combo"])).min(1),
});
const QuoteSchema = z.object({
  serviceType: z.enum(["Bridal", "Non-Bridal"]),
  events: z.array(EventSchema).min(1).max(5),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(7),
    address: z.string().min(3),
    notes: z.string().optional(),
  }),
});

// ---------- PRICING ----------
type Catalog = Record<string, { name: string; price_cents: number }>;

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function codesFor(serviceType: "Bridal" | "Non-Bridal", services: string[]) {
  const bridal = serviceType === "Bridal";
  const hasM = services.includes("makeup");
  const hasH = services.includes("hair");
  const combo = services.includes("combo") || (hasM && hasH);
  if (combo) return [bridal ? "bridal_combo" : "nb_combo"];
  if (hasM) return [bridal ? "bridal_makeup" : "nb_makeup"];
  if (hasH) return [bridal ? "bridal_hair" : "nb_hair"];
  return [];
}

export async function POST(req: NextRequest) {
  try {
    ensureEnv();

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // 1) Parse & validate body
    const parsed = QuoteSchema.parse(await req.json());

    // 2) Load price catalog
    const { data: rows, error: catErr } = await supabase
      .from("price_catalog")
      .select("code, display_name, price_cents, active")
      .eq("active", true);

    if (catErr) throw new Error("price_catalog error: " + catErr.message);

    const catalog: Catalog = {};
    for (const r of rows ?? []) {
      catalog[(r as any).code] = {
        name: (r as any).display_name,
        price_cents: Number((r as any).price_cents),
      };
    }

    // 3) Calculate per-event breakdown + total (in cents)
    const breakdown = parsed.events.map((e) => {
      const codes = codesFor(parsed.serviceType, e.services);
      let eventSubtotal = 0;
      const lines: { label: string; amount_cents: number }[] = [];

      for (const code of codes) {
        const item = catalog[code];
        if (!item) continue; // safe skip if a SKU is missing
        const amt = item.price_cents * e.people; // per-person
        lines.push({ label: `${item.name} x ${e.people}`, amount_cents: amt });
        eventSubtotal += amt;
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

    const total_cents = breakdown.reduce((s, e) => s + e.event_subtotal_cents, 0);

    // 4) Build and send ONE email to Anmol (via Gmail)
    const subject = `Test Email - New Quote — ${parsed.serviceType} — ${formatMoney(total_cents)}`;
    const text =
      `Client\n` +
      `  • Email: ${parsed.contact.email}\n` +
      `  • Phone: ${parsed.contact.phone}\n` +
      `  • Address: ${parsed.contact.address}\n` +
      `  • Notes: ${parsed.contact.notes ?? "-"}\n\n` +
      breakdown
        .map((e, i) => {
          const lines = e.lines.map((l) => `    • ${l.label}: ${formatMoney(l.amount_cents)}`).join("\n");
          return `Event ${i + 1}: ${e.eventType} | ${e.date} ${e.time} @ ${e.location}\n${lines}\n    Subtotal: ${formatMoney(
            e.event_subtotal_cents
          )}\n`;
        })
        .join("\n") +
      `\nTotal: ${formatMoney(total_cents)}\n`;

    let providerId: string | null = null;
    let status: "sent" | "failed" = "failed";
    try {
      const info = await getTransporter().sendMail({
        from: process.env.GMAIL_FROM ?? process.env.GMAIL_USER!,
        to: process.env.ADMIN_EMAIL!,
        subject,
        text,
      });
      providerId = typeof info.messageId === "string" ? info.messageId : null;
      status = providerId ? "sent" : "failed";
    } catch {
      status = "failed"; // continue to log as failed
    }

    // 5) Log to your exact email_log schema
    const { error: logErr } = await supabase.from("email_log").insert({
      to_email: process.env.ADMIN_EMAIL!,
      subject,
      total_cents, // integer (matches your schema)
      payload_json: {
        request: parsed,
        breakdown,
        total_cents,
      },
      provider: "gmail",
      provider_id: providerId, // nullable ok
      status, // 'sent' | 'failed'
    });

    if (logErr) {
      throw new Error("email_log insert error: " + logErr.message);
    }

    // 6) Respond to client
    return NextResponse.json({
      ok: true,
      total_cents,
      total_formatted: formatMoney(total_cents),
      breakdown,
    });
  } catch (e: any) {
    console.error("QUOTE_ERROR:", e);
    const details = e?.issues ?? undefined; // Zod issues for 400
    return NextResponse.json(
      {
        error: e?.message || "Server error",
        details,
        stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
      },
      { status: details ? 400 : 500 }
    );
  }
}
