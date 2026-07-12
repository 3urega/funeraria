import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig, updateSiteConfig } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { updateSiteConfigSchema } from "@/lib/site/admin-schema";

export async function GET() {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();
  const config = await getSiteConfig();
  return NextResponse.json({ config: config ?? null });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const json = await req.json().catch(() => null);
  const parsed = updateSiteConfigSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const existing = await getSiteConfig();
  const theme = {
    ...(existing?.theme ?? {}),
    ...parsed.data.theme,
  };

  await updateSiteConfig({
    brandName: parsed.data.brandName,
    mortuaryDefault: parsed.data.mortuaryDefault ?? null,
    contact: {
      phone: parsed.data.contact.phone,
      email: parsed.data.contact.email,
      address: parsed.data.contact.address,
      website: parsed.data.contact.website ?? null,
      whatsapp: parsed.data.contact.whatsapp ?? null,
    },
    theme,
  });

  return NextResponse.json({ ok: true });
}
