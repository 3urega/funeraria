## Objetivo

Mejorar **`/admin/flores`** (catálogo de productos): filtros, paginación y toggle **Actiu** inline. Poemas queda cubierto en RD-116; este issue se centra en flores y en **reutilizar** el mismo patrón.

## Roadmap

- **RD-119** — [`docs/ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (Fase 11)

## Contexto

Depende de **RD-116**. `flower-products` ya tiene `PATCH` con `isActive`. La lista ordena por `sortOrder`, `name` — mantener ese orden en queries paginadas.

## Alcance

| In | Fuera |
|----|-------|
| `listFlowerProductsPaginated` + filtro `active` en URL | Reordenar con flechas ± (post-MVP) |
| Paginación 10/página | Editar preu desde lista |
| Toggle `isActive` inline | Subida de foto desde lista |
| Miniatura foto en fila (mantener/mejorar) | |
| Verificar poemas piloto RD-116 sin regresiones | |

## Criterios de aceptación

- [ ] Filtro Tots / Actius / Inactius en catálogo flores.
- [ ] Paginación cuando >10 productos.
- [ ] Toggle activo actualiza sin recargar formulario completo.
- [ ] Orden de catálogo coherente (`sortOrder`, desempate `name`).
- [ ] `npm run build` passes.

## Capas / archivos principales

- `src/lib/db/queries.ts` — `listFlowerProductsPaginated`
- `src/components/admin/flower-products-table.tsx`
- `src/app/admin/(dashboard)/flores/page.tsx`

## Issues relacionadas

- RD-116, RD-120 (comandas)

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-flores-admin](../legacy/requisits-flores-admin.md)
