import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
export async function sendAdminEmail({ subject, text }: { subject: string; text: string; }) {
  const r = await resend.emails.send({ from: "Quotes <quotes@your-domain.com>", to: ADMIN_EMAIL, subject, text });
  return { provider: "resend", providerId: (r as any)?.id ?? null, status: (r as any)?.id ? "sent" : "failed" };
}
