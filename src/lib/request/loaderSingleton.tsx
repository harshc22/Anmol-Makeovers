// loaderSingleton.ts
import { Loader } from '@googlemaps/js-api-loader';

let loader: Loader | null = null;
export function getGoogleLoader() {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      libraries: ['places'],
    });
  }
  return loader;
}
