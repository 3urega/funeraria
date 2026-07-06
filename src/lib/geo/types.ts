export type PlaceSuggestion = {
  placeId: string;
  label: string;
};

export type NormalizedPlace = {
  formattedAddress: string;
  city: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  googlePlaceId: string;
};

export type PlaceLocationInput = {
  address: string;
  city: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string;
};

export const emptyPlaceLocation = (): PlaceLocationInput => ({
  address: "",
  city: "",
  googleMapsUrl: "",
  latitude: null,
  longitude: null,
  googlePlaceId: "",
});

export function placeLocationFromRecord(record: {
  address?: string | null;
  city?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string | null;
}): PlaceLocationInput {
  return {
    address: record.address ?? "",
    city: record.city ?? "",
    googleMapsUrl: record.googleMapsUrl ?? "",
    latitude: record.latitude ?? null,
    longitude: record.longitude ?? null,
    googlePlaceId: record.googlePlaceId ?? "",
  };
}
