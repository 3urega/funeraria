import { NextResponse } from "next/server";
import { getAllContentSectionsForAdmin } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

export async function GET() {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();
  const sections = await getAllContentSectionsForAdmin();
  return NextResponse.json({ sections });
}
