import { NextRequest, NextResponse } from "next/server";
import {
  autocompletePlaces,
  isGooglePlacesConfigured,
} from "@/lib/geo/google-places";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

export async function GET(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  if (!isGooglePlacesConfigured()) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_NOT_CONFIGURED", suggestions: [] },
      { status: 503 },
    );
  }

  const input = req.nextUrl.searchParams.get("input") ?? "";
  const sessionToken = req.nextUrl.searchParams.get("sessionToken") ?? "";

  if (!input.trim()) {
    return NextResponse.json({ suggestions: [] });
  }
  if (!sessionToken.trim()) {
    return NextResponse.json({ error: "SESSION_TOKEN_REQUIRED" }, { status: 400 });
  }

  try {
    const suggestions = await autocompletePlaces(input, sessionToken);
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("Places autocomplete error:", err);
    return NextResponse.json({ error: "AUTOCOMPLETE_FAILED" }, { status: 502 });
  }
}
