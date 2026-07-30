"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Cemetery, Church, Obituary, WakeRoom } from "@/lib/db/schema";
import { EsquelaView } from "@/components/family/esquela-view";
import { EsquelaPhotoSection } from "@/components/admin/esquela-photo-section";
import { generateVisitCodeCandidate } from "@/lib/esquela/generate-visit-code";
import { slugifyName } from "@/lib/esquela/generate-slug";
import type { CreateEsquelaInput } from "@/lib/esquela/admin-schema";

type SiteConfigInput = {
  brandName?: string | null;
  mortuaryDefault?: string | null;
  contact?: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  } | null;
  theme?: Record<string, string> | null;
};

type Props = {
  churches: Church[];
  cemeteries: Cemetery[];
  wakeRooms: WakeRoom[];
  siteConfig: SiteConfigInput | null;
  funeralHomeName: string;
  obituary?: Obituary;
  imageUrl?: string | null;
  pendingImageUrl?: string | null;
  familyImageStatus?: Obituary["familyImageStatus"];
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 border-b border-zinc-200 pb-1 text-sm font-semibold uppercase tracking-wide text-zinc-600">
      {children}
    </h2>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-zinc-300"
      />
      {label}
    </label>
  );
}

export function EsquelaAdminForm({
  churches,
  cemeteries,
  wakeRooms,
  siteConfig,
  funeralHomeName,
  obituary,
  imageUrl = null,
  pendingImageUrl = null,
  familyImageStatus = null,
}: Props) {
  const router = useRouter();
  const isEdit = Boolean(obituary);
  const mortuaryDefault = siteConfig?.mortuaryDefault ?? "";
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const previewImageUrl = localImageUrl ?? imageUrl;

  const [name, setName] = useState(obituary?.name ?? "");
  const [deathPlace, setDeathPlace] = useState(obituary?.deathPlace ?? "");
  const [deathDay, setDeathDay] = useState(obituary?.deathDay ?? "");
  const [ageAtDeath, setAgeAtDeath] = useState(
    obituary?.ageAtDeath != null ? String(obituary.ageAtDeath) : "",
  );
  const [funeralDatetime, setFuneralDatetime] = useState(
    obituary?.funeralDatetime ?? "",
  );
  const [churchId, setChurchId] = useState(
    obituary?.churchId ?? churches[0]?.id ?? "",
  );
  const [cemeteryId, setCemeteryId] = useState(
    obituary?.cemeteryId ?? cemeteries[0]?.id ?? "",
  );
  const [wakeRoomId, setWakeRoomId] = useState(
    obituary?.wakeRoomId ?? wakeRooms[0]?.id ?? "",
  );
  const [wakeSchedule, setWakeSchedule] = useState(obituary?.wakeSchedule ?? "");
  const [mortuaryAddress, setMortuaryAddress] = useState(
    obituary?.mortuaryAddress ?? mortuaryDefault,
  );
  const [showEpd, setShowEpd] = useState(obituary?.showEpd ?? true);
  const [visitCode, setVisitCode] = useState(
    obituary?.visitCode ?? generateVisitCodeCandidate(),
  );
  const [expedientCode, setExpedientCode] = useState(
    obituary?.expedientCode ?? "",
  );
  const [isActive, setIsActive] = useState(obituary?.isActive ?? false);
  const [isVisible, setIsVisible] = useState(obituary?.isVisible ?? false);
  const [isReady, setIsReady] = useState(obituary?.isReady ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const church = churches.find((c) => c.id === churchId) ?? null;
  const cemetery = cemeteries.find((c) => c.id === cemeteryId) ?? null;
  const wakeRoom = wakeRooms.find((r) => r.id === wakeRoomId) ?? null;

  const previewObituary = useMemo((): Obituary => {
    const age = ageAtDeath ? parseInt(ageAtDeath, 10) : null;
    return {
      id: "preview",
      funeralHomeId: "",
      slug: slugifyName(name) || "preview",
      name: name || " ",
      visitCode,
      expedientCode: expedientCode || null,
      isReady,
      isActive,
      isVisible,
      churchId: churchId || null,
      cemeteryId: cemeteryId || null,
      wakeRoomId: wakeRoomId || null,
      deathNotice: null,
      deathPlace: deathPlace || null,
      deathDay: deathDay || null,
      ageAtDeath: age && !Number.isNaN(age) ? age : null,
      funeralDatetime: funeralDatetime || null,
      funeralDetails: null,
      mortuaryAddress: mortuaryAddress || null,
      wakeLocation: null,
      wakeSchedule: wakeSchedule || null,
      wakeDetails: null,
      showEpd,
      imagePath: null,
      customImagePath: null,
      familyImageStatus: null,
      obituarioPoemTemplateId: null,
      obituarioText: null,
      createdAt: "",
      updatedAt: "",
    };
  }, [
    name,
    deathPlace,
    deathDay,
    ageAtDeath,
    funeralDatetime,
    churchId,
    cemeteryId,
    wakeRoomId,
    wakeSchedule,
    mortuaryAddress,
    showEpd,
    visitCode,
    expedientCode,
    isActive,
    isVisible,
    isReady,
  ]);

  const catalogsEmpty =
    churches.length === 0 || cemeteries.length === 0 || wakeRooms.length === 0;

  function handleNameChange(value: string) {
    setName(value);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (catalogsEmpty) return;

    setLoading(true);
    setError(null);

    const payload: CreateEsquelaInput = {
      name,
      deathPlace,
      deathDay,
      ageAtDeath: parseInt(ageAtDeath, 10),
      funeralDatetime,
      churchId,
      cemeteryId,
      wakeRoomId,
      wakeSchedule,
      mortuaryAddress: mortuaryAddress || undefined,
      showEpd,
      visitCode,
      expedientCode: expedientCode || undefined,
      isActive,
      isVisible,
      isReady,
    };

    const res = await fetch(
      isEdit && obituary
        ? `/api/admin/esquelas/${obituary.id}`
        : "/api/admin/esquelas",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (data?.error === "INVALID_PLACES") {
        setError("Els llocs seleccionats no són vàlids.");
      } else if (data?.error === "CONFLICT") {
        setError("Codi duplicat. Genera'n un de nou o revisa el codi d'accés.");
      } else {
        setError("Error en desar l'esquela. Revisa els camps.");
      }
      setLoading(false);
      return;
    }

    router.push("/admin/esquelas");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-6">
        {catalogsEmpty && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Cal tenir almenys una església, un cementiri i una sala de vetlla.{" "}
            <Link href="/admin/lugares/iglesias" className="underline">
              Gestionar llocs
            </Link>
          </div>
        )}

        <section>
          <SectionTitle>§ Difunt</SectionTitle>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Nom complet *
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Ex. RAMON SANT TORNER"
              />
            </div>
            <div>
              <label htmlFor="deathPlace" className="mb-1 block text-sm font-medium">
                Lloc de defunció *
              </label>
              <input
                id="deathPlace"
                required
                value={deathPlace}
                onChange={(e) => setDeathPlace(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Ex. Berga"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="deathDay" className="mb-1 block text-sm font-medium">
                  Dia *
                </label>
                <input
                  id="deathDay"
                  required
                  value={deathDay}
                  onChange={(e) => setDeathDay(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2"
                  placeholder="Ex. 1"
                />
              </div>
              <div>
                <label htmlFor="ageAtDeath" className="mb-1 block text-sm font-medium">
                  Edat *
                </label>
                <input
                  id="ageAtDeath"
                  required
                  type="number"
                  min={1}
                  value={ageAtDeath}
                  onChange={(e) => setAgeAtDeath(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2"
                  placeholder="75"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>§ Funeral</SectionTitle>
          <div className="space-y-3">
            <div>
              <label htmlFor="funeralDatetime" className="mb-1 block text-sm font-medium">
                Data i hora del funeral *
              </label>
              <input
                id="funeralDatetime"
                required
                value={funeralDatetime}
                onChange={(e) => setFuneralDatetime(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Ex. dimarts dia 3 a les 11:00"
              />
            </div>
            <div>
              <label htmlFor="churchId" className="mb-1 block text-sm font-medium">
                Església *
              </label>
              <select
                id="churchId"
                required
                value={churchId}
                onChange={(e) => setChurchId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
              >
                {churches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cemeteryId" className="mb-1 block text-sm font-medium">
                Cementiri *
              </label>
              <select
                id="cemeteryId"
                required
                value={cemeteryId}
                onChange={(e) => setCemeteryId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
              >
                {cemeteries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>§ Vetlla</SectionTitle>
          <div className="space-y-3">
            <div>
              <label htmlFor="wakeRoomId" className="mb-1 block text-sm font-medium">
                Sala de vetlla *
              </label>
              <select
                id="wakeRoomId"
                required
                value={wakeRoomId}
                onChange={(e) => setWakeRoomId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
              >
                {wakeRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="wakeSchedule" className="mb-1 block text-sm font-medium">
                Horari de vetlla *
              </label>
              <input
                id="wakeSchedule"
                required
                value={wakeSchedule}
                onChange={(e) => setWakeSchedule(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                placeholder="Ex. Dilluns de 17:00 a 19:00"
              />
            </div>
            <div>
              <label htmlFor="mortuaryAddress" className="mb-1 block text-sm font-medium">
                Casa mortuòria
              </label>
              <input
                id="mortuaryAddress"
                value={mortuaryAddress}
                onChange={(e) => setMortuaryAddress(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                placeholder={mortuaryDefault || "Adreça casa mortuòria"}
              />
            </div>
            <Toggle
              id="showEpd"
              label="Mostrar «E.P.D.»"
              checked={showEpd}
              onChange={setShowEpd}
            />
          </div>
        </section>

        <section>
          <SectionTitle>§ Foto</SectionTitle>
          {isEdit && obituary ? (
            <EsquelaPhotoSection
              obituaryId={obituary.id}
              imageUrl={imageUrl}
              pendingImageUrl={pendingImageUrl}
              familyImageStatus={familyImageStatus}
              onImagePublished={setLocalImageUrl}
            />
          ) : (
            <p className="text-sm text-zinc-500">
              Desa l&apos;esquela primer per pujar o gestionar fotos.
            </p>
          )}
        </section>

        <section>
          <SectionTitle>§ Publicació</SectionTitle>
          <div className="space-y-3">
            <div>
              <label htmlFor="visitCode" className="mb-1 block text-sm font-medium">
                Codi d&apos;accés familiar *
              </label>
              <div className="flex gap-2">
                <input
                  id="visitCode"
                  required
                  minLength={4}
                  value={visitCode}
                  onChange={(e) => setVisitCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-md border border-zinc-300 px-3 py-2 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setVisitCode(generateVisitCodeCandidate())}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Generar
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="expedientCode" className="mb-1 block text-sm font-medium">
                Codi d&apos;expedient
              </label>
              <input
                id="expedientCode"
                value={expedientCode}
                onChange={(e) => setExpedientCode(e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                placeholder="EXP-2026-001"
              />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <Toggle
                id="isActive"
                label="Activa (familiar pot accedir amb codi)"
                checked={isActive}
                onChange={setIsActive}
              />
              <Toggle
                id="isVisible"
                label="Visible al llistat públic"
                checked={isVisible}
                onChange={setIsVisible}
              />
              <Toggle
                id="isReady"
                label="Esquela completa"
                checked={isReady}
                onChange={setIsReady}
              />
            </div>
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || catalogsEmpty}
            className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Guardant…" : isEdit ? "Desar canvis" : "Desar esquela"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel·lar
          </button>
        </div>
      </form>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-sm font-medium text-zinc-600">Vista prèvia</p>
        <EsquelaView
          obituary={previewObituary}
          officialImageUrl={previewImageUrl}
          funeralHomeName={funeralHomeName}
          siteConfig={siteConfig}
          church={church}
          cemetery={cemetery}
          wakeRoom={wakeRoom}
        />
      </div>
    </div>
  );
}
