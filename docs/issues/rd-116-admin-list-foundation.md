## Objetivo

Introducir la **infraestructura reutilizable** para listas del admin: paginación (10 filas por defecto), filtros vía URL (`searchParams`), componentes de tabla compartidos y toggles booleanos inline. Migrar **Poemas** como implementación piloto que valida el patrón antes del resto de tablas.

## Roadmap

- **RD-116** — [`docs/ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (Fase 11)

## Contexto

Hoy todas las listas admin (`/admin/esquelas`, lugares, flores, poemas, comandas) cargan el dataset completo sin paginación ni filtros UI. Solo comandas tiene filtro backend (`?status=`) sin interfaz. Este issue sienta las bases para RD-117–RD-121.

**Principio de diseño:** filtros y página en **URL** (bookmarkable, compatible con Server Components + `router.refresh()` tras mutaciones client).

## Alcance

| In | Fuera |
|----|-------|
| Tipos `ListParams`, `PaginatedResult<T>` en `src/lib/admin/` | i18n completo del admin (RD-105) |
| Parser/serializer de `searchParams` (`page`, `pageSize`, filtros genéricos) | Ordenación multi-columna avanzada |
| Queries paginadas: `listPoemTemplatesPaginated` + count | Esquelas, lugares, flores (issues siguientes) |
| Componentes UI: `AdminPagination`, `AdminListToolbar`, `AdminDataTable`, `AdminBooleanToggle` | Bulk actions / selección múltiple |
| Migrar `/admin/poemas` con filtro activo/inactivo + paginación | Refactor del dashboard |
| Toggle inline `isActive` en poemas (PATCH ya existe) | Tests E2E (RD-110) |

## Criterios de aceptación

- [ ] `DEFAULT_PAGE_SIZE = 10`; URL `?page=1` (y `pageSize` opcional acotado, p. ej. 10–50).
- [ ] Poemas: filtro **Tots / Actius / Inactius** persiste en URL; paginación visible cuando `total > pageSize`.
- [ ] Toggle **Actiu** en fila llama `PATCH /api/admin/poem-templates/[id]` sin abrir el formulario; feedback de error si falla.
- [ ] Componentes reutilizables documentados con JSDoc breve en `src/components/admin/list/`.
- [ ] Estado vacío y «cap resultats» claros en catalán (coherente con admin actual).
- [ ] `npm run build` passes.

## Capas / archivos principales

- `src/lib/admin/list-params.ts` — parseo tipado de URL
- `src/lib/admin/pagination.ts` — helpers limit/offset
- `src/lib/db/queries.ts` — `listPoemTemplatesPaginated`, `countPoemTemplates`
- `src/components/admin/list/admin-pagination.tsx`
- `src/components/admin/list/admin-list-toolbar.tsx`
- `src/components/admin/list/admin-data-table.tsx`
- `src/components/admin/list/admin-boolean-toggle.tsx`
- `src/components/admin/poemas-table.tsx` (client, toggles)
- `src/app/admin/(dashboard)/poemas/page.tsx` — usa searchParams + tabla nueva

## Arquitectura (referencia)

```
page.tsx (RSC)
  → parseListParams(searchParams)
  → listPoemTemplatesPaginated(params)  → { items, total, page, pageSize }
  → <PoemasTable items={...} />
       → AdminBooleanToggle → PATCH API → router.refresh()
       → AdminPagination links (?page=N&active=...)
```

## Issues relacionadas

- RD-117: Esquelas list
- RD-118: Lugares
- RD-119: Flores catálogo
- RD-120: Comandas
- RD-121: Dashboard + sub-listas esquela

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- Inventario tablas admin (issue batch admin-listas-v1)
