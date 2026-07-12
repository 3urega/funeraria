"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { siteConfig as siteConfigTable } from "@/lib/db/schema";
import { PUJOLS_THEME } from "@/lib/home/defaults";

type SiteConfig = typeof siteConfigTable.$inferSelect;

type Props = {
  config: SiteConfig;
  logoUrl: string;
  heroImageUrl: string;
};

export function SiteConfigForm({ config, logoUrl, heroImageUrl }: Props) {
  const router = useRouter();
  const contact = config.contact ?? {
    phone: "",
    email: "",
    address: "",
  };
  const theme = config.theme ?? {};

  const [brandName, setBrandName] = useState(config.brandName ?? "");
  const [mortuaryDefault, setMortuaryDefault] = useState(
    config.mortuaryDefault ?? "",
  );
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [address, setAddress] = useState(contact.address ?? "");
  const [website, setWebsite] = useState(contact.website ?? "");
  const [whatsapp, setWhatsapp] = useState(contact.whatsapp ?? "");
  const [primary, setPrimary] = useState(theme.primary ?? PUJOLS_THEME.primary);
  const [dark, setDark] = useState(theme.dark ?? PUJOLS_THEME.dark);
  const [muted, setMuted] = useState(theme.muted ?? PUJOLS_THEME.muted);
  const [background, setBackground] = useState(
    theme.background ?? PUJOLS_THEME.background,
  );
  const [logoPreview, setLogoPreview] = useState(logoUrl);
  const [heroPreview, setHeroPreview] = useState(heroImageUrl);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/site-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandName,
        mortuaryDefault: mortuaryDefault || null,
        contact: {
          phone,
          email,
          address,
          website: website || null,
          whatsapp: whatsapp || null,
        },
        theme: { primary, dark, muted, background },
      }),
    });

    if (!res.ok) {
      setError("Error en guardar la configuració.");
      setLoading(false);
      return;
    }

    if (logoFile) {
      const fd = new FormData();
      fd.set("image", logoFile);
      const logoRes = await fetch("/api/admin/site-config/logo", {
        method: "POST",
        body: fd,
      });
      if (!logoRes.ok) {
        setError("Config guardada, però error en pujar el logo.");
        setLoading(false);
        return;
      }
      const logoData = (await logoRes.json()) as { publicUrl: string };
      setLogoPreview(logoData.publicUrl);
      setLogoFile(null);
    }

    if (heroFile) {
      const fd = new FormData();
      fd.set("image", heroFile);
      const heroRes = await fetch("/api/admin/site-config/hero-image", {
        method: "POST",
        body: fd,
      });
      if (!heroRes.ok) {
        setError("Config guardada, però error en pujar la imatge hero.");
        setLoading(false);
        return;
      }
      const heroData = (await heroRes.json()) as { heroImagePath: string };
      setHeroPreview(heroData.heroImagePath);
      setHeroFile(null);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Marca</h2>
        <div>
          <label htmlFor="brandName" className="mb-1 block text-sm font-medium">
            Nom comercial
          </label>
          <input
            id="brandName"
            required
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label
            htmlFor="mortuaryDefault"
            className="mb-1 block text-sm font-medium"
          >
            Casa mortuòria (per defecte a esqueles)
          </label>
          <input
            id="mortuaryDefault"
            value={mortuaryDefault}
            onChange={(e) => setMortuaryDefault(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Contacte</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Telèfon
            </label>
            <input
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium">
            Adreça
          </label>
          <input
            id="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-medium">
              Web
            </label>
            <input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium">
              WhatsApp (només dígits, opcional)
            </label>
            <input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="34600111222"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Tema (colors)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["primary", primary, setPrimary, "Primari"],
              ["dark", dark, setDark, "Fosc"],
              ["muted", muted, setMuted, "Beige"],
              ["background", background, setBackground, "Fons clar"],
            ] as const
          ).map(([id, value, setter, label]) => (
            <div key={id}>
              <label htmlFor={id} className="mb-1 block text-sm font-medium">
                {label}
              </label>
              <div className="flex gap-2">
                <input
                  id={id}
                  type="color"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border"
                />
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="flex-1 rounded-md border px-3 py-2 font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Imatges</h2>
        <div>
          <label className="mb-1 block text-sm font-medium">Logo</label>
          {logoPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoPreview}
              alt="Logo"
              className="mb-2 h-14 w-auto rounded border bg-white p-2"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setLogoFile(f);
                setLogoPreview(URL.createObjectURL(f));
              }
            }}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Imatge hero (fons home)
          </label>
          {heroPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroPreview}
              alt="Hero"
              className="mb-2 h-32 w-full max-w-md rounded border object-cover"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setHeroFile(f);
                setHeroPreview(URL.createObjectURL(f));
              }
            }}
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "Guardant…" : "Desar configuració"}
      </button>
    </form>
  );
}
