const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAIL",
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
  "RECAPTCHA_SECRET_KEY",
] as const;

export function assertEnv(): void {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length > 0) throw new Error(`Missing env: ${missing.join(", ")}`);
}
