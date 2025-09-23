export const BUCKET = process.env.NEXT_PUBLIC_PORTFOLIO_BUCKET || "Portfolio";

// Accept newline OR comma separated prefixes from env
const RAW_PREFIXES = (process.env.NEXT_PUBLIC_PORTFOLIO_PREFIXES || "")
  .split(/[\n,]/)
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Normalize prefixes:
 * - '' stays ''
 * - strip any leading slashes
 * - ensure a single trailing slash for non-root
 */
export const ALBUM_PREFIXES: string[] = RAW_PREFIXES.map((p) =>
  p === "" ? "" : p.replace(/^\/+/, "").replace(/\/?$/, "/")
);

// Default to showing "All" ('' means All)
export const DEFAULT_PREFIX = "";
