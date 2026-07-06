---
name: plan-to-issues
description: >-
  Convert an implementation plan (ROADMAP RD-XXX, legacy requisits, or Cursor plan)
  into GitHub issue draft files under docs/issues plus a JSON manifest,
  then publish to GitHub unless the user asks docs-only. Use when the user wants to
  plan work, prepare issues, planifica y sube issues, roadmap to issues, crear issues,
  or preparar el kanban.
---

# Plan to Issues (docs first)

Repository: `3urega/funeraria`  
Git remote: `git@github.com:3urega/funeraria.git`  
App root: `.`

**This is step 1** of the issue workflow. **Step 2** is [publish-github-issues](../publish-github-issues/SKILL.md) (upload to GitHub). **Step 3** lifecycle: [kanban-board](../kanban-board/SKILL.md) (implement + close + cleanup docs).

```
Plan .md  →  [plan-to-issues]  →  docs/issues/*.md + manifest.json
                                        ↓
                              [publish-github-issues]  →  GitHub issues
                                        ↓
                              [kanban-board] implement → close → delete docs drafts
```

## When to use

- User has a roadmap item or phase in `docs/ROADMAP_ENTREGA.md` (`RD-XXX`).
- User has detail in `docs/legacy/requisits-*.md` or `docs/arquitectura.md`.
- User asks: *genera las issues en docs*, *convierte el roadmap en issues*, *prepara el kanban*, *planifica y sube issues*, *prepara las issues*.
- **Do not** call `gh issue create` inside this file's steps 1–5 — publishing is step 6 via [publish-github-issues](../publish-github-issues/SKILL.md).

## Default: publish after drafts (same session)

Unless the user explicitly says **solo docs**, **solo borradores**, or **no subas a GitHub**:

1. Complete steps 1–5 below (write `.md` + manifest).
2. **Immediately** read and follow [publish-github-issues](../publish-github-issues/SKILL.md) with the manifest you just created.
3. Report GitHub issue URLs to the user.

If `gh` is not authenticated or publish fails, keep drafts in `docs/issues/` and tell the user what to fix.

## Input

One primary document, e.g.:

- `docs/ROADMAP_ENTREGA.md` (master; items `RD-001` … `RD-115`)
- `docs/legacy/requisits-esquela-admin-form.md`
- `docs/legacy/requisits-lugares.md`
- Any `.md` with phases, vertical slices, acceptance criteria
- Cursor plan in `.cursor/plans/` (read only; do not edit unless user asks)

Always read `AGENTS.md` and the requisits doc linked from the relevant `RD-XXX` row.

## Output (required)

1. **One body file per issue** in `docs/issues/`:

   Naming (before GitHub numbers exist): `{short-slug}.md`  
   Examples: `admin-esquela-form.md`, `public-esquela-maps.md`, `flower-checkout.md`

   Optional prefix when tied to roadmap: `rd-073-admin-esquela-form.md`

   After publish, filenames may be renamed to `{githubNumber}-{slug}.md` (optional; publish skill).

2. **Manifest** `docs/issues/manifest.<batch-name>.json`:

```json
{
  "repo": "3urega/funeraria",
  "sourceDoc": "docs/ROADMAP_ENTREGA.md",
  "issues": [
    {
      "title": "RD-073: Admin esquela form + live preview",
      "bodyFile": "docs/issues/rd-073-admin-esquela-form.md",
      "roadmapId": "RD-073"
    }
  ]
}
```

3. **Update source plan** — in `ROADMAP_ENTREGA.md` or the legacy requisits doc, add section **GitHub issues (draft)** with table linking body files (not GitHub URLs until published).

## Issue body template

Each `docs/issues/<slug>.md` must include:

```markdown
## Objetivo
(one paragraph)

## Roadmap
- **RD-XXX** — link to row in ROADMAP_ENTREGA.md

## Contexto
(dependencies, links to docs/legacy/)

## Alcance
| In | Fuera |
|----|-------|

## Criterios de aceptación
- [ ] ...
- [ ] `npm run build` passes

## Capas / archivos principales
- `src/...`

## Issues relacionadas
- (other slugs in same batch)

## Referencias
- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits](../legacy/requisits-....md)
```

**Titles:** use `:` not em-dash `—` (PowerShell encoding). Prefer `RD-073: Admin esquela form` format.

## Vertical slicing (funeraria)

Split the plan into **one GitHub issue per vertical slice** (same rules as kanban-board):

| Slice | Valor para el usuario | Capas típicas |
|-------|----------------------|---------------|
| Admin CRUD | Empleado gestiona datos | `src/app/admin/`, API routes, schema |
| Web pública | Visitante ve esquela/home | `src/app/[locale]/`, components |
| Zona familiar | Familiar personaliza | `(family)/`, API family |
| Infra / prod | Deploy estable | docs, env, Supabase |

Rules:

- Smallest deliverable per issue; cross layers when needed (e.g. form + API + DB).
- Mark **fuera de alcance** explicitly in each body.
- Order issues by dependency (manifest array order = implementation order).
- Respect roadmap prerequisites (e.g. RD-067/068 before RD-073).
- Do **not** mark roadmap `[x]` in this skill — that happens in kanban-board after implementation.

Typical batch size: 3–7 issues. Do not create one mega-issue for a whole phase.

## Project conventions

- **Stack:** Next.js 16, SQLite + Drizzle (`data/dev.db`), Tailwind, next-intl (ca default, es).
- **Tenant:** `FUNERAL_HOME_ID`, demo client Funeraria Pujols (`fh-001`).
- **Admin:** `/admin/*`, mock auth `admin@local.dev`.
- **Public:** `/[locale]/*` — catalán sin prefijo (`/`), castellano `/es`.
- **Roadmap honesty:** do not copy placeholder work as done; align acceptance criteria with `AGENTS.md` criteria for `[x]`.

## Agent workflow

1. Read the source `.md` plan completely (+ linked legacy requisits).
2. Map slices to `RD-XXX` IDs where applicable.
3. Write body files under `docs/issues/`.
4. Write `manifest.<batch-name>.json` (paths relative to repo root or consistent with publish skill).
5. Update source doc with draft issues table + link to manifest path.
6. **Publish (default):** follow [publish-github-issues](../publish-github-issues/SKILL.md) unless user asked docs-only.
7. Tell user: draft paths + manifest + GitHub issue URLs (if published).

## Do not

- Skip publish when the user asked to prepare/plan issues without saying docs-only.
- Duplicate bodies already published (grep `docs/issues/` and `gh issue list --repo 3urega/funeraria` if unsure).
- Edit Cursor plan files in `.cursor/plans/` unless the user asks.
- Edit the plan file when user says "implement the plan" — only read it.

## Related

- [publish-github-issues](../publish-github-issues/SKILL.md) — step 2
- [kanban-board](../kanban-board/SKILL.md) — implement, close, cleanup docs
- [`docs/issues/README.md`](../../../docs/issues/README.md) — workflow summary
- [`AGENTS.md`](../../../AGENTS.md) — roadmap marking rules
