---
name: kanban-board
description: >-
  Manage the kanban board for 3urega/funeraria: list, read, plan with architecture
  review (not literal issue copy), vertical slicing, implement, close GitHub issues,
  mark RD-XXX in ROADMAP, and clean up docs/issues drafts when closed.
  Use for /kanban-board or when closing an issue.
---

# Kanban Board

Repository: `3urega/funeraria`  
App root: `.`

All `gh` commands require `--repo 3urega/funeraria`.

**Issue lifecycle:** [plan-to-issues](../plan-to-issues/SKILL.md) → [publish-github-issues](../publish-github-issues/SKILL.md) → **kanban-board** (this skill).

## Commands

List open issues:

```bash
gh issue list --repo 3urega/funeraria
```

View a specific issue:

```bash
gh issue view <number> --repo 3urega/funeraria
```

Close an issue:

```bash
gh issue close <number> --repo 3urega/funeraria --comment "Done: <brief summary>"
```

## Behavior

### Without arguments

List all open issues and show a summary to the user.

### With an issue ID as argument (e.g. `/kanban-board 42`)

**No traduzcas la issue a un plan mecánico.** Primero entiende el contexto y diseña la mejor solución; después presenta el plan (con mejoras propuestas si las hay).

#### Fase 1 — Leer la issue (punto de partida, no verdad absoluta)

```bash
gh issue view <id> --repo 3urega/funeraria
```

Extrae: objetivo, `RD-XXX` si aparece, criterios de aceptación, dependencias, verifies mencionados y **fuera de alcance** explícito.

Si la issue no está publicada aún, lee el borrador en `docs/issues/<slug>.md`.

#### Fase 2 — Contexto y arquitectura (obligatorio antes del plan)

Dedica tiempo a investigar **antes** de proponer slices. No basta con leer la issue.

1. **`AGENTS.md`** — roadmap, criterios `[x]`, mapa de docs legacy, convenciones (esquela vs obituario, foto moderada, tenant Pujols).
2. **Roadmap y requisits** (según el tipo de issue; leer solo lo relevante):
   - Maestro: [`docs/ROADMAP_ENTREGA.md`](../../../docs/ROADMAP_ENTREGA.md)
   - Arquitectura: [`docs/arquitectura.md`](../../../docs/arquitectura.md)
   - Dev local: [`docs/ESTRATEGIA_DESARROLLO_LOCAL.md`](../../../docs/ESTRATEGIA_DESARROLLO_LOCAL.md)
   - Dominio completo: [`docs/DOCUMENTO_REQUISITOS.md`](../../../docs/DOCUMENTO_REQUISITOS.md)
   - Por feature (en `docs/legacy/`): `requisits-esquela-admin-form.md`, `requisits-esquela-publica.md`, `requisits-lugares.md`, `requisits-flores.md`, `requisits-home-plantilla.md`, etc.
   - `sourceDoc` del manifest o **Referencias** en el body de la issue
3. **Código existente** — buscar patrones ya implementados en el mismo área:
   - Admin CRUD: `src/app/admin/(dashboard)/`, `src/components/admin/*-form.tsx`, `/api/admin/*`
   - Web pública: `src/app/[locale]/(public)/`, `src/components/home/`, `src/components/public/`
   - Zona familiar: `src/app/[locale]/(family)/`, `/api/family/*`
   - Datos: `src/lib/db/schema.ts`, `queries.ts`, `scripts/seed.ts`
   - Esquela: `src/lib/esquela/`, `EsquelaPrintLayout`, `buildEsquelaPrintData()`
   - i18n: `src/i18n/`, `messages/ca.json`, `messages/es.json`
   - Tenant: `src/lib/site/tenant.ts`, `FUNERAL_HOME_ID`
4. **Estado real vs issue** — ¿La issue asume tablas/APIs que ya existen? ¿Hay placeholders Tailwind genéricos que hay que sustituir por identidad Pujols? ¿Prerrequisitos del roadmap ya hechos (p. ej. RD-067/068 antes de RD-073)?

#### Fase 3 — Diseño (monolito Next.js + SQLite)

Con el contexto cargado, **diseña** la implementación (no copies la issue):

- **Capa correcta** — UI (RSC/client), API route (`requireAdminSession` / JWT familiar), queries Drizzle, seed/migración schema.
- **Reutilizar** — forms admin existentes (wake rooms, churches), `PlaceAddressField`, `buildHomePageData`, plantilla esquela.
- **Multi-tenant** — filtrar por `getFuneralHomeId()` en queries e inserts; no hardcodear «Eurega».
- **i18n** — textos UI en `messages/*.json`; contenido CMS en `content_i18n` (ca principal, es); rutas con `next-intl`.
- **Consistencia** — mismos patrones Zod en API, upload foto a `storage/places/`, paths relativos en BD.
- **Riesgos típicos**: SQLite bloqueada con `npm run dev` activo; `GOOGLE_MAPS_API_KEY` opcional; marcar `[x]` en roadmap sin entregable real; mezclar obituario poético con texto formal de esquela.

**Mejoras y cambios propuestos** (cuando aporten valor y encajen en el alcance del issue):

| Tipo | Ejemplo | Acción |
|------|---------|--------|
| Refactor menor colindante | Extraer schema Zod compartido de geo fields | Incluir si es barato |
| Schema / migración | Columna nueva en `obituaries` | `npm run db:push` + seed |
| Ajuste de API | Campo extra útil para preview admin | Proponer al usuario |
| Desviación de la issue | Cambiar ruta, ampliar scope | **Preguntar al usuario** antes de implementar |
| Fuera de alcance | Feature de otro `RD-XXX` | Marcar explícitamente «no incluir» |

Si propones cambios respecto al texto de la issue, sepáralos en **Propuestas / desvíos** con: qué cambia, por qué, impacto en otras issues del batch.

#### Fase 4 — Plan de implementación (entregar al usuario)

Presentar en este orden:

1. **Resumen** — qué pide la issue y qué vas a construir realmente (1–2 párrafos).
2. **Contexto encontrado** — archivos/patrones/docs relevantes (bullets breves).
3. **Propuestas / desvíos** (si hay) — mejoras recomendadas; preguntas abiertas.
4. **Slices verticales** (VS1, VS2, …) — ver **Vertical slicing** abajo.
5. **Riesgos y mitigaciones**.
6. **Checklist de verificación** manual + `npm run build` antes de cerrar.

**Espera confirmación del usuario** si hay desvíos material respecto a la issue o propuestas que amplíen scope. Si el usuario dice «implementa», ejecuta el plan acordado (o el literal de la issue si rechaza las propuestas).

#### Fase 5 — Implementación

Completar y verificar **un slice antes del siguiente**, salvo que el usuario pida paralelizar.

Trabajar en la raíz del repo (salvo skills/docs en `.cursor/`).

### After completing work on an issue

Close only when **all slices** are done and verified:

```bash
gh issue close <number> --repo 3urega/funeraria --comment "Done: <brief summary>"
```

Then **clean up docs** (mandatory):

#### 1. Find local drafts for this issue

Search in order:

```bash
# Body file named with issue number prefix
docs/issues/<number>-*.md

# Manifest entries (all manifest.*.json in docs/issues/)
grep -l "\"bodyFile\"" docs/issues/manifest.*.json
# Match title from: gh issue view <number> --json title

# Orphan drafts referenced only by closed issue title
grep -ri "<title keywords>" docs/issues/
```

Also check `sourceDoc` in the manifest (e.g. `docs/ROADMAP_ENTREGA.md`).

#### 2. Delete issue draft files

- **Delete** the body file(s) in `docs/issues/` for this issue (e.g. `rd-073-admin-esquela-form.md` or `42-rd-073-admin-esquela-form.md`).
- **Remove** the matching entry from every `docs/issues/manifest.*.json` (`issues[]` item with same `bodyFile` or title).
- If a manifest has empty `issues[]`, **delete** the manifest file.
- **Delete** superseded single drafts only if fully replaced by closed split issues and user/roadmap agrees.

**Do not delete** roadmaps maestros (`docs/ROADMAP_ENTREGA.md`, `docs/legacy/*.md`) — only update their status (see step 3).

#### 3. Update source / roadmap docs

In the plan linked from manifest `sourceDoc` or from issue body **Referencias**:

- If `RD-XXX` is fully done per `AGENTS.md`: mark `- [x] **RD-XXX**` in `ROADMAP_ENTREGA.md`, recalculate progress, add historial row.
- Add note **Implemented** with GitHub `#<number>` and date in the source doc section **GitHub issues (draft)** if present.
- Remove or shrink draft tables that only listed unpublished work for this issue.
- Keep historical context; do not remove entire roadmaps.

#### 4. Confirm to user

Report: issue closed URL + which files were deleted/updated under `docs/` + `RD-XXX` status if applicable.

---

## Vertical slicing (regla general)

Al planificar e implementar issues, **partir el trabajo en slices verticales** (historias finas, entregables de punta a punta). No planificar por capas horizontales («primero toda la API, luego toda la UI»).

### Qué es un slice vertical

Cada slice (VS1, VS2, …) debe:

1. **Aportar valor visible** al empleado, familiar o visitante (aunque sea parcial).
2. **Cruzar capas** cuando haga falta: página + API + schema/query mínima para ese valor.
3. **Integrarse y demostrarse** por sí solo (probable en `localhost:3000` en la ruta que toque).
4. **Ser lo más pequeño posible** que cumpla un criterio de aceptación claro.

### Cómo escribir el plan

Incluir una tabla o lista con columnas equivalentes a:

| Slice | Valor para el usuario | Capas / archivos principales |
|-------|----------------------|------------------------------|
| VS1 | … | … |
| VS2 | … | … |

Reglas adicionales:

- **Investigar antes de planificar** — Fases 2–3 son obligatorias; el plan (Fase 4) refleja el diseño acordado, no un volcado de la issue.
- Ordenar slices de **menor a mayor** dependencia; el primero suele ser el «tracer bullet» (flujo mínimo demostrable).
- Respetar prerrequisitos del roadmap (p. ej. catálogo de lugares antes del formulario esquela).
- Marcar explícitamente **fuera de alcance** del issue para no inflar slices.
- Si el issue es trivial (un bug de una línea), **un solo slice** basta; no forzar VS1–VS4 (pero sí revisar contexto si toca auth, tenant o i18n).
- Al implementar, completar y verificar **un slice antes de pasar al siguiente**, salvo que el usuario pida paralelizar.
- Respetar `AGENTS.md` y `docs/` al tocar schema, API o UI pública.
- New batches: use [plan-to-issues](../plan-to-issues/SKILL.md) before GitHub publish.

### Ejemplo (funeraria)

Issue «RD-073: Formulario admin esquela» partido en:

- **VS1:** Schema/validación + API POST borrador + redirect (sin preview visual).
- **VS2:** Formulario completo + selects iglesia/cementiri/sala + preview `EsquelaPrintLayout` en vivo.
- **VS3:** Generación automática `slug` + `visitCode` + publicar/despublicar.
- **VS4:** Upload foto retocada + badge foto familiar pendiente en listado.

Cada VS se puede probar en admin antes del siguiente.

---

## Verificación antes de cerrar

Desde la raíz del repo:

```bash
npm run build
```

Si hubo cambios de schema:

```bash
npm run db:push
```

Opcional: probar rutas manuales documentadas en `AGENTS.md` (admin login, esquela demo, acceso familiar `DEMO1234`).

---

## Related

- [plan-to-issues](../plan-to-issues/SKILL.md) — step 1: plan `.md` → `docs/issues/`
- [publish-github-issues](../publish-github-issues/SKILL.md) — step 2: manifest → GitHub
- [`docs/issues/README.md`](../../../docs/issues/README.md)
- [`AGENTS.md`](../../../AGENTS.md)
