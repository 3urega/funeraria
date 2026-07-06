import { z } from "zod";

export const geoFieldsSchema = {
  address: z.string().optional(),
  city: z.string().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  googlePlaceId: z.string().optional(),
};

export function normalizeGeoFields(data: {
  address?: string;
  city?: string;
  googleMapsUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string;
}) {
  return {
    address: data.address?.trim() || null,
    city: data.city?.trim() || null,
    googleMapsUrl: data.googleMapsUrl?.trim() || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    googlePlaceId: data.googlePlaceId?.trim() || null,
  };
}
