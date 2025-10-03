import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import { QuoteSchema } from "@/lib/quote/schema";
import { assertEnv } from "@/lib/quote/env";
import { createSupabaseClient } from "@/lib/quote/db";
import { loadCatalog, computeBreakdown } from "@/lib/quote/pricing";
import { buildEmail, getTransporter } from "@/lib/quote/email";
import type { QuoteRequest } from "@/lib/quote/types";

export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const supabase = createSupabaseClient();

    const body = (await req.json()) as unknown;
    const parsed = QuoteSchema.parse(body) as QuoteRequest;

    // Validate reCAPTCHA token
    if (parsed.recaptchaToken) {
      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${parsed.recaptchaToken}`,
        { method: "POST" }
      );
      const recaptchaData = await recaptchaResponse.json();
      
      if (!recaptchaData.success) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "reCAPTCHA verification is required." },
        { status: 400 }
      );
    }

    const catalog = await loadCatalog(supabase);
    const { breakdown, services_total_cents, travel_total_cents, total_cents } = await computeBreakdown(parsed, catalog);

    const { subject, text, from, to } = buildEmail(
      parsed,
      breakdown,
      services_total_cents,
      travel_total_cents,
      total_cents
    );

    let providerId: string | null = null;
    let status: "sent" | "failed" = "failed";
    try {
      const info = await getTransporter().sendMail({ from, to, subject, text });
      providerId = typeof info.messageId === "string" ? info.messageId : null;
      status = providerId ? "sent" : "failed";
    } catch {
      status = "failed";
    }

    const { error } = await supabase.from("email_log").insert({
      to_email: to,
      subject,
      total_cents,
      payload_json: { request: parsed, breakdown, total_cents },
      provider: "gmail",
      provider_id: providerId,
      status,
      client_email: parsed.contact.email,
    });
    if (error) throw new Error(`email_log insert error: ${error.message}`);

    return NextResponse.json({
      ok: true,
    });
  } catch (err) {
    // Log the full error for debugging but don't expose it to the client
    console.error("Quote request error:", err);
    
    // Return a generic error message to the client
    const message = err instanceof Error && err.message.includes("validation") 
      ? "Please check your input and try again"
      : "Something went wrong. Please try again later.";
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
