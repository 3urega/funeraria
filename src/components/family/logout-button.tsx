"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function FamilyLogoutButton() {
  const t = useTranslations("family");
  const router = useRouter();

  async function logout() {
    await fetch("/api/family/logout", { method: "POST" });
    router.push("/acceso");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-sm text-zinc-500 hover:text-zinc-800"
    >
      {t("logout")}
    </button>
  );
}
