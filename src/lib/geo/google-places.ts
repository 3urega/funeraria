import type { NormalizedPlace, PlaceSuggestion } from "./types";

const PLACES_BASE = "https://places.googleapis.com/v1";

function getApiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }
  return key;
}

function extractCity(
  components: Array<{ longText?: string; shortText?: string; types?: string[] }>,
): string {
  const priority = ["locality", "postal_town", "administrative_area_level_3"];
  for (const type of priority) {
    const match = components.find((c) => c.types?.includes(type));
    if (match?.longText) return match.longText;
  }
  return "";
}

function buildGoogleMapsUrl(
  placeId: string,
  latitude: number,
  longitude: number,
): string {
  const query = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${encodeURIComponent(placeId)}`;
}

type AutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
    };
  }>;
};

type PlaceDetailsResponse = {
  id?: string;
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
};

export async function autocompletePlaces(
  input: string,
  sessionToken: string,
): Promise<PlaceSuggestion[]> {
  if (!input.trim()) return [];

  const res = await fetch(`${PLACES_BASE}/places:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
    },
    body: JSON.stringify({
      input: input.trim(),
      sessionToken,
      includedRegionCodes: ["es"],
      languageCode: "ca",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Places autocomplete failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as AutocompleteResponse;
  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => ({
      placeId: p.placeId!,
      label: p.text?.text ?? p.placeId!,
    }));
}

export async function getPlaceDetails(placeId: string): Promise<NormalizedPlace> {
  const res = await fetch(`${PLACES_BASE}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask": "id,formattedAddress,location,addressComponents",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Places details failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as PlaceDetailsResponse;
  const latitude = data.location?.latitude;
  const longitude = data.location?.longitude;
  const id = data.id ?? placeId;

  if (latitude == null || longitude == null) {
    throw new Error("Place has no coordinates");
  }

  return {
    formattedAddress: data.formattedAddress ?? "",
    city: extractCity(data.addressComponents ?? []),
    latitude,
    longitude,
    googlePlaceId: id,
    googleMapsUrl: buildGoogleMapsUrl(id, latitude, longitude),
  };
}

export function isGooglePlacesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}
