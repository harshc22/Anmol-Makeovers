import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

import { QuoteSchema } from "@/lib/quote/schema";
import { assertEnv } from "@/lib/quote/env";
import { createSupabaseClient } from "@/lib/quote/db";
import { loadCatalog, computeBreakdown } from "@/lib/quote/pricing";
import { buildEmail, getTransporter } from "@/lib/quote/email";
import type { QuoteRequest } from "@/lib/quote/types";
import { money } from "@/lib/utils/money";

export async function POST(req: NextRequest) {
  try {
    assertEnv();

    const supabase = createSupabaseClient();

    const body = (await req.json()) as unknown;
    const parsed = QuoteSchema.parse(body) as QuoteRequest;

    const catalog = await loadCatalog(supabase);
    const { breakdown, total_cents } = computeBreakdown(parsed, catalog);

    const { subject, text, from, to } = buildEmail(
      parsed,
      breakdown,
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
    });
    if (error) throw new Error(`email_log insert error: ${error.message}`);

    return NextResponse.json({
      ok: true,
      total_cents,
      total_formatted: money(total_cents),
      breakdown,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
