const GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api/distancematrix/json";

const STUDIO_LAT = Number(process.env.STUDIO_LAT);
const STUDIO_LNG = Number(process.env.STUDIO_LNG);
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

if (!Number.isFinite(STUDIO_LAT) || !Number.isFinite(STUDIO_LNG)) {
  throw new Error("Studio coordinates missing or invalid. Set STUDIO_LAT/STUDIO_LNG.");
}
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error("GOOGLE_MAPS_API_KEY is not set.");
}

type DistanceResult =
  | { status: "ok"; distance_km: number; text: string }
  | { status: "unavailable"; reason: string };

export async function distanceFromStudioKm(opts: {
  destinationPlaceId?: string | null;
  destinationAddress?: string | null;
}): Promise<DistanceResult> {
  const origin = `${STUDIO_LAT},${STUDIO_LNG}`;

  // prefer place_id; fallback to freeform address
  const destination =
    opts.destinationPlaceId
      ? `place_id:${opts.destinationPlaceId}`
      : (opts.destinationAddress ?? "").trim();

  if (!destination) {
    return { status: "unavailable", reason: "No destination provided" };
  }

  const url = new URL(GOOGLE_MAPS_API);
  url.searchParams.set("origins", origin);
  url.searchParams.set("destinations", destination);
  url.searchParams.set("units", "metric");
  url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    return { status: "unavailable", reason: `HTTP ${res.status}` };
  }
  const json = await res.json();

  try {
    const element = json.rows?.[0]?.elements?.[0];
    const ok = element?.status === "OK";
    if (!ok || !element.distance?.value) {
      return { status: "unavailable", reason: `Element status: ${element?.status ?? "unknown"}` };
    }
    // meters -> km
    const km = element.distance.value / 1000;
    return { status: "ok", distance_km: km, text: element.distance.text };
  } catch {
    return { status: "unavailable", reason: "Malformed response" };
  }
}
