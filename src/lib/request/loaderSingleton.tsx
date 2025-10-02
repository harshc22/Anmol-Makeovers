import { Loader } from "@googlemaps/js-api-loader";

let _loader: Loader | null = null;

export function getMapsLoader() {
  if (!_loader) {
    _loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });
  }
  return _loader;
}
