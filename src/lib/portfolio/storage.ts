/** Build a public URL for a file */
export function publicUrl(baseUrl: string, bucket: string, path: string) {
  const base = `${baseUrl.replace(
    /\/$/,
    ""
  )}/storage/v1/object/public/${bucket}/`;
  const parts = path.split("/").map(encodeURIComponent);
  return base + parts.join("/");
}

/** Safe prefix join: ensures correct single slash placement */
export function joinPrefix(prefix: string, name: string) {
  if (!prefix) return name;
  const clean = prefix.replace(/^\/+/, "").replace(/\/?$/, "/");
  return clean + name;
}
