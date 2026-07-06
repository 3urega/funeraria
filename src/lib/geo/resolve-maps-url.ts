type PlaceWithMaps = {
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

/** Resol URL de Google Maps: URL guardada → coordenades → null. */
export function resolvePlaceMapsUrl(place: PlaceWithMaps): string | null {
  const url = place.googleMapsUrl?.trim();
  if (url) return url;

  const { latitude, longitude } = place;
  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  return null;
}
