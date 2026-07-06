import { NextRequest, NextResponse } from "next/server";
import {
  getPlaceDetails,
  isGooglePlacesConfigured,
} from "@/lib/geo/google-places";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

export async function GET(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  if (!isGooglePlacesConfigured()) {
    return NextResponse.json({ error: "GOOGLE_MAPS_NOT_CONFIGURED" }, { status: 503 });
  }

  const placeId = req.nextUrl.searchParams.get("placeId") ?? "";
  if (!placeId.trim()) {
    return NextResponse.json({ error: "PLACE_ID_REQUIRED" }, { status: 400 });
  }

  try {
    const place = await getPlaceDetails(placeId);
    return NextResponse.json({ place });
  } catch (err) {
    console.error("Places details error:", err);
    return NextResponse.json({ error: "DETAILS_FAILED" }, { status: 502 });
  }
}
