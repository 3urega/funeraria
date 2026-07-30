"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ContentSection } from "@/lib/db/schema";
import {
  DEFAULT_HOME_CONTENT,
  HOME_SECTION_KEYS,
  type HomeSectionKey,
} from "@/lib/home/defaults";
import {
  LocalizedField,
  localizedFromDb,
} from "./localized-field";
import { ImagePicker } from "@/components/ui/image-picker";

const SECTION_LABELS: Record<HomeSectionKey, string> = {
  top_bar: "Barra superior",
  hero: "Hero",
  services: "Serveis",
  why_us: "Per què escollir-nos",
  obituaries_intro: "Intro esqueles",
  cta_blocks: "Blocs CTA",
  footer: "Peu de pàgina",
};

const SERVICE_ICONS = [
  "flower",
  "urn",
  "transfer",
  "building",
  "florist",
  "document",
  "ceremony",
] as const;

function defaultForKey(key: HomeSectionKey): Record<string, unknown> {
  const map: Record<HomeSectionKey, Record<string, unknown>> = {
    top_bar: DEFAULT_HOME_CONTENT.topBar as unknown as Record<string, unknown>,
    hero: DEFAULT_HOME_CONTENT.hero as unknown as Record<string, unknown>,
    services: DEFAULT_HOME_CONTENT.services as unknown as Record<string, unknown>,
    why_us: DEFAULT_HOME_CONTENT.whyUs as unknown as Record<string, unknown>,
    obituaries_intro:
      DEFAULT_HOME_CONTENT.obituariesIntro as unknown as Record<string, unknown>,
    cta_blocks:
      DEFAULT_HOME_CONTENT.ctaBlocks as unknown as Record<string, unknown>,
    footer: DEFAULT_HOME_CONTENT.footer as unknown as Record<string, unknown>,
  };
  return structuredClone(map[key]);
}

type SectionState = {
  contentI18n: Record<string, unknown>;
  isPublished: boolean;
};

type Props = {
  sections: ContentSection[];
  whyUsImageUrl: string;
};

export function HomeCmsEditor({ sections, whyUsImageUrl }: Props) {
  const router = useRouter();
  const initial = useMemo(() => {
    const map = {} as Record<HomeSectionKey, SectionState>;
    for (const key of HOME_SECTION_KEYS) {
      const row = sections.find((s) => s.sectionKey === key);
      map[key] = {
        contentI18n: {
          ...defaultForKey(key),
          ...(row?.contentI18n as Record<string, unknown> | undefined),
        },
        isPublished: row?.isPublished ?? true,
      };
    }
    return map;
  }, [sections]);

  const [activeKey, setActiveKey] = useState<HomeSectionKey>("hero");
  const [state, setState] = useState(initial);
  const [whyUsPreview, setWhyUsPreview] = useState(whyUsImageUrl);
  const [whyUsFile, setWhyUsFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const current = state[activeKey];

  function updateContent(patch: Record<string, unknown>) {
    setState((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        contentI18n: { ...prev[activeKey].contentI18n, ...patch },
      },
    }));
  }

  function setPublished(isPublished: boolean) {
    setState((prev) => ({
      ...prev,
      [activeKey]: { ...prev[activeKey], isPublished },
    }));
  }

  async function saveSection() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch(`/api/admin/content-sections/${activeKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentI18n: current.contentI18n,
        isPublished: current.isPublished,
      }),
    });

    if (!res.ok) {
      setError("Error en guardar la secció.");
      setLoading(false);
      return;
    }

    if (activeKey === "why_us" && whyUsFile) {
      const fd = new FormData();
      fd.set("image", whyUsFile);
      const imgRes = await fetch("/api/admin/content-sections/why-us-image", {
        method: "POST",
        body: fd,
      });
      if (!imgRes.ok) {
        setError("Text guardat, però error en pujar la imatge.");
        setLoading(false);
        return;
      }
      const data = (await imgRes.json()) as { imagePath: string };
      setWhyUsPreview(data.imagePath);
      setWhyUsFile(null);
      updateContent({ imagePath: data.imagePath });
    }

    setSuccess(`Secció «${SECTION_LABELS[activeKey]}» guardada.`);
    setLoading(false);
    router.refresh();
  }

  const c = current.contentI18n;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <nav className="flex shrink-0 flex-row flex-wrap gap-1 lg:w-48 lg:flex-col">
        {HOME_SECTION_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveKey(key);
              setError(null);
              setSuccess(null);
            }}
            className={`rounded-md px-3 py-2 text-left text-sm ${
              activeKey === key
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {SECTION_LABELS[key]}
            {!state[key].isPublished && (
              <span className="ml-1 text-xs opacity-70">(borrador)</span>
            )}
          </button>
        ))}
      </nav>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{SECTION_LABELS[activeKey]}</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={current.isPublished}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publicada
          </label>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            {success}
          </p>
        )}

        {activeKey === "top_bar" && (
          <>
            <LocalizedField
              label="Text disponibilitat"
              value={localizedFromDb(c.availabilityText)}
              onChange={(v) => updateContent({ availabilityText: v })}
            />
            <LocalizedField
              label="Etiqueta urgència"
              value={localizedFromDb(c.urgencyLabel)}
              onChange={(v) => updateContent({ urgencyLabel: v })}
            />
          </>
        )}

        {activeKey === "hero" && (
          <>
            <LocalizedField
              label="Títol"
              value={localizedFromDb(c.title)}
              onChange={(v) => updateContent({ title: v })}
            />
            <LocalizedField
              label="Subtítol"
              value={localizedFromDb(c.subtitle)}
              onChange={(v) => updateContent({ subtitle: v })}
            />
            <LocalizedField
              label="Text llarg"
              value={localizedFromDb(c.text)}
              onChange={(v) => updateContent({ text: v })}
              multiline
              rows={6}
            />
            <LocalizedField
              label="Botó primari"
              value={localizedFromDb(c.primaryButton)}
              onChange={(v) => updateContent({ primaryButton: v })}
            />
            <LocalizedField
              label="Botó secundari"
              value={localizedFromDb(c.secondaryButton)}
              onChange={(v) => updateContent({ secondaryButton: v })}
            />
            <p className="text-xs text-zinc-500">
              La imatge de fons del hero es configura a Configuració → Imatge
              hero.
            </p>
          </>
        )}

        {activeKey === "services" && (
          <>
            <LocalizedField
              label="Eyebrow"
              value={localizedFromDb(c.eyebrow)}
              onChange={(v) => updateContent({ eyebrow: v })}
            />
            <LocalizedField
              label="Títol secció"
              value={localizedFromDb(c.heading)}
              onChange={(v) => updateContent({ heading: v })}
            />
            {(
              (c.items as Array<Record<string, unknown>> | undefined) ?? []
            ).map((item, index) => (
              <div
                key={index}
                className="rounded-md border border-zinc-200 p-3 space-y-2"
              >
                <p className="text-sm font-medium">Servei {index + 1}</p>
                <label className="block text-xs text-zinc-500">Icona</label>
                <select
                  value={(item.icon as string) ?? SERVICE_ICONS[0]}
                  onChange={(e) => {
                    const items = [
                      ...((c.items as Array<Record<string, unknown>>) ?? []),
                    ];
                    items[index] = { ...items[index], icon: e.target.value };
                    updateContent({ items });
                  }}
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  {SERVICE_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
                <LocalizedField
                  label="Etiqueta"
                  value={localizedFromDb(item.label)}
                  onChange={(v) => {
                    const items = [
                      ...((c.items as Array<Record<string, unknown>>) ?? []),
                    ];
                    items[index] = { ...items[index], label: v };
                    updateContent({ items });
                  }}
                />
              </div>
            ))}
            <LocalizedField
              label="Text botó CTA"
              value={localizedFromDb(c.ctaLabel)}
              onChange={(v) => updateContent({ ctaLabel: v })}
            />
          </>
        )}

        {activeKey === "why_us" && (
          <>
            <LocalizedField
              label="Eyebrow"
              value={localizedFromDb(c.eyebrow)}
              onChange={(v) => updateContent({ eyebrow: v })}
            />
            <LocalizedField
              label="Títol"
              value={localizedFromDb(c.heading)}
              onChange={(v) => updateContent({ heading: v })}
            />
            <ImagePicker
              id="why-us-image"
              label="Imatge"
              variant="banner"
              previewUrl={whyUsPreview}
              previewAlt="Per què escollir-nos"
              pendingFileName={whyUsFile?.name}
              hint="JPEG, PNG o WebP. Màxim 5 MB."
              onFileSelect={(f) => {
                setWhyUsFile(f);
                setWhyUsPreview(URL.createObjectURL(f));
              }}
            />
            {(
              (c.features as Array<Record<string, unknown>> | undefined) ?? []
            ).map((feat, index) => (
              <div
                key={index}
                className="space-y-2 rounded-md border border-zinc-200 p-3"
              >
                <p className="text-sm font-medium">Punt fort {index + 1}</p>
                <LocalizedField
                  label="Títol"
                  value={localizedFromDb(feat.title)}
                  onChange={(v) => {
                    const features = [
                      ...((c.features as Array<Record<string, unknown>>) ??
                        []),
                    ];
                    features[index] = { ...features[index], title: v };
                    updateContent({ features });
                  }}
                />
                <LocalizedField
                  label="Descripció"
                  value={localizedFromDb(feat.text)}
                  onChange={(v) => {
                    const features = [
                      ...((c.features as Array<Record<string, unknown>>) ??
                        []),
                    ];
                    features[index] = { ...features[index], text: v };
                    updateContent({ features });
                  }}
                  multiline
                />
              </div>
            ))}
          </>
        )}

        {activeKey === "obituaries_intro" && (
          <>
            <LocalizedField
              label="Eyebrow"
              value={localizedFromDb(c.eyebrow)}
              onChange={(v) => updateContent({ eyebrow: v })}
            />
            <LocalizedField
              label="Títol"
              value={localizedFromDb(c.heading)}
              onChange={(v) => updateContent({ heading: v })}
            />
            <LocalizedField
              label="Text botó"
              value={localizedFromDb(c.ctaLabel)}
              onChange={(v) => updateContent({ ctaLabel: v })}
            />
            <div>
              <label className="mb-1 block text-sm font-medium">
                Màxim d&apos;esqueles a la home
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={(c.maxItems as number) ?? 4}
                onChange={(e) =>
                  updateContent({ maxItems: Number.parseInt(e.target.value, 10) || 4 })
                }
                className="w-24 rounded-md border px-3 py-2"
              />
            </div>
          </>
        )}

        {activeKey === "cta_blocks" && (
          <>
            {(
              (c.blocks as Array<Record<string, unknown>> | undefined) ?? []
            ).map((block, index) => (
              <div
                key={index}
                className="space-y-2 rounded-md border border-zinc-200 p-3"
              >
                <p className="text-sm font-medium">
                  Bloc {index + 1}{" "}
                  {(block.variant as string) === "dark" ? "(fosc)" : "(clar)"}
                </p>
                <LocalizedField
                  label="Títol"
                  value={localizedFromDb(block.title)}
                  onChange={(v) => {
                    const blocks = [
                      ...((c.blocks as Array<Record<string, unknown>>) ?? []),
                    ];
                    blocks[index] = { ...blocks[index], title: v };
                    updateContent({ blocks });
                  }}
                />
                <LocalizedField
                  label="Text"
                  value={localizedFromDb(block.text)}
                  onChange={(v) => {
                    const blocks = [
                      ...((c.blocks as Array<Record<string, unknown>>) ?? []),
                    ];
                    blocks[index] = { ...blocks[index], text: v };
                    updateContent({ blocks });
                  }}
                  multiline
                />
                {block.linkLabel !== undefined && (
                  <LocalizedField
                    label="Enllaç (text)"
                    value={localizedFromDb(block.linkLabel)}
                    onChange={(v) => {
                      const blocks = [
                        ...((c.blocks as Array<Record<string, unknown>>) ?? []),
                      ];
                      blocks[index] = { ...blocks[index], linkLabel: v };
                      updateContent({ blocks });
                    }}
                  />
                )}
              </div>
            ))}
          </>
        )}

        {activeKey === "footer" && (
          <>
            <LocalizedField
              label="Tagline"
              value={localizedFromDb(c.tagline)}
              onChange={(v) => updateContent({ tagline: v })}
              multiline
            />
            {(
              (c.linkGroups as Array<Record<string, unknown>> | undefined) ?? []
            ).map((group, gi) => (
              <div
                key={gi}
                className="space-y-2 rounded-md border border-zinc-200 p-3"
              >
                <LocalizedField
                  label={`Grup enllaços ${gi + 1} — títol`}
                  value={localizedFromDb(group.title)}
                  onChange={(v) => {
                    const linkGroups = [
                      ...((c.linkGroups as Array<Record<string, unknown>>) ??
                        []),
                    ];
                    linkGroups[gi] = { ...linkGroups[gi], title: v };
                    updateContent({ linkGroups });
                  }}
                />
                {(
                  (group.links as Array<Record<string, unknown>> | undefined) ??
                  []
                ).map((link, li) => (
                  <div key={li} className="ml-2 border-l-2 border-zinc-100 pl-3">
                    <LocalizedField
                      label={`Enllaç ${li + 1}`}
                      value={localizedFromDb(link.label)}
                      onChange={(v) => {
                        const linkGroups = [
                          ...((c.linkGroups as Array<Record<string, unknown>>) ??
                            []),
                        ];
                        const links = [
                          ...((linkGroups[gi].links as Array<
                            Record<string, unknown>
                          >) ?? []),
                        ];
                        links[li] = { ...links[li], label: v };
                        linkGroups[gi] = { ...linkGroups[gi], links };
                        updateContent({ linkGroups });
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
            {((c.legal as Array<Record<string, unknown>> | undefined) ?? []).map(
              (item, index) => (
                <LocalizedField
                  key={index}
                  label={`Legal ${index + 1}`}
                  value={localizedFromDb(item.label)}
                  onChange={(v) => {
                    const legal = [
                      ...((c.legal as Array<Record<string, unknown>>) ?? []),
                    ];
                    legal[index] = { ...legal[index], label: v };
                    updateContent({ legal });
                  }}
                />
              ),
            )}
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={saveSection}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Guardant…" : "Desar secció"}
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Previsualitzar home →
          </a>
        </div>
      </div>
    </div>
  );
}
