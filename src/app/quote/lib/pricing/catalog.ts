export type Catalog = Record<string, { name: string; price_cents: number }>;
export async function loadCatalog(supabase: any): Promise<Catalog> {
  const { data, error } = await supabase
    .from("price_catalog")
    .select("code, display_name, price_cents")
    .eq("active", true);
  if (error) throw error;
  const map: Catalog = {};
  for (const r of data ?? []) map[r.code] = { name: r.display_name, price_cents: Number(r.price_cents) };
  return map;
}
