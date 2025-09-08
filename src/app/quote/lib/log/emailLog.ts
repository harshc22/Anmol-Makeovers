export async function logEmail(supabase: any, {
  to, subject, totalCents, payload, provider, providerId, status
}: {
  to: string; subject: string; totalCents: number; payload: unknown;
  provider: string; providerId: string | null; status: "sent" | "failed";
}) {
  await supabase.from("email_log").insert({
    to_email: to,
    subject,
    total_cents: totalCents,
    payload_json: payload,
    provider,
    provider_id: providerId,
    status,
  });
}
