## Objetivo

Mejorar **`/admin/esquelas`**: filtros operativos (activa, visible, lista, foto pendiente, missatges pendents, cerca), paginación a 10 filas, y **acciones inline** (activar/desactivar, visible, esquela completa) sin entrar al formulario.

## Roadmap

- **RD-117** — [`docs/ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (Fase 11)

## Contexto

Depende de **RD-116** (componentes `AdminPagination`, `AdminListToolbar`, `AdminBooleanToggle`, patrón URL).

La lista actual muestra badges útiles pero no permite filtrar ni actuar rápido. Es la tabla más usada en el día a día del empleado.

## Alcance

| In | Fuera |
|----|-------|
| Query `listObituariesPaginated` + counts para badges/filtros | Edición completa de campos desde la fila |
| Filtros URL: `active`, `visible`, `ready`, `photoPending`, `messagesPending`, `q` (nom/codi/expedient) | Export CSV |
| Paginación 10/página | Bulk select masivo |
| Toggles inline: `isActive`, `isVisible`, `isReady` | Cambiar slug/visitCode desde lista |
| API **PATCH** parcial flags (`patchObituaryFlagsSchema`) en `/api/admin/esquelas/[id]` | Nuevo diseño visual del dashboard |
| Acciones fila: Editar (existente), **Copiar codi**, **Veure web pública** ( nueva pestaña) | Eliminar esquela desde lista |

## Criterios de aceptación

- [ ] Filtro «Només actives» (y resto de chips/selects) actualiza URL y lista sin perder otros filtros.
- [ ] Filtro «Foto pendent retocar» muestra solo `familyImageStatus === 'pending'`.
- [ ] Filtro «Missatges pendents» usa conteo no revisados (`getUnreviewedMessageCountsByObituary` o join eficiente).
- [ ] Toggles inline persisten vía PATCH; errores visibles (toast o texto bajo toolbar).
- [ ] Copiar codi al porta-retalls con feedback «Copiat».
- [ ] Enlace público abre `/esquelas/[slug]` en nueva pestaña.
- [ ] Con >10 esqueles, paginación funcional; página 1 por defecto.
- [ ] `npm run build` passes.

## Capas / archivos principales

- `src/lib/esquela/patch-flags-schema.ts` (Zod)
- `src/app/api/admin/esquelas/[id]/route.ts` — añadir `PATCH` o ruta `.../flags`
- `src/lib/db/queries.ts` — `listObituariesPaginated`
- `src/components/admin/esquelas-table.tsx`
- `src/app/admin/(dashboard)/esquelas/page.tsx`

## Particularidades esquela

| Columna / filtro | Campo / query |
|------------------|---------------|
| Activa | `obituaries.isActive` |
| Visible | `obituaries.isVisible` |
| Lista | `obituaries.isReady` |
| Foto familiar | `familyImageStatus` |
| Missatges | agregado `commemorative_messages.reviewed = false` |

## Issues relacionadas

- RD-116 (foundation)
- RD-121 (dashboard enlaces a filtros predefinidos)

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-esquela-admin-form](../legacy/requisits-esquela-admin-form.md)
