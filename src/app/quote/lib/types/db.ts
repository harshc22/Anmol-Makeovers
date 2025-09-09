export type PriceCatalogRow = {
  code: string;
  display_name: string;
  price_cents: number;
  active: boolean;
};

export type EmailLogRow = {
  id: string;
  to_email: string;
  subject: string;
  total_cents: number;
  payload_json: unknown;
  provider: string;
  provider_id: string | null;
  status: string;
  created_at: string;
};

export type EmailLogInsert = Omit<EmailLogRow, "id" | "created_at">;

export interface Database {
  public: {
    Tables: {
      price_catalog: {
        Row: PriceCatalogRow;
        Insert: PriceCatalogRow;
        Update: Partial<PriceCatalogRow>;
      };
      email_log: {
        Row: EmailLogRow;
        Insert: EmailLogInsert;
        Update: Partial<EmailLogRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
