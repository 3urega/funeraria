## Objetivo

Completar la UX de **`/admin/flores/comandas`**: UI de filtros por estado, paginación, enlaces útiles en fila, y acceso desde el menú lateral admin.

## Roadmap

- **RD-120** — [`docs/ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (Fase 11)

## Contexto

Depende de **RD-116** (toolbar/paginación). `getAllFlowerOrders({ status })` ya filtra en backend; falta chips/tabs en UI. `FlowerOrdersTable` ya permite cambiar estado inline — conservar y extender.

## Alcance

| In | Fuera |
|----|-------|
| Toolbar filtros: Totes, Pagat, En preparació, Lliurat, Cancel·lat (URL `?status=`) | Informes PDF floristería |
| Paginación en query + UI (`listFlowerOrdersPaginated`) | Filtro por rango fechas (post-MVP) |
| Enlace fila → esquela admin (`/admin/esquelas/[id]`, pestaña Flors) | Email automático al comprador |
| Enlace «Comandes» en sidebar admin (`layout.tsx`) | Stripe (RD-087) |
| Reutilizar tabla en pestaña esquela (`showObituary={false}`) con mismos estilos | |

## Criterios de aceptación

- [ ] Tabs/chips de estado sincronizados con URL; compartir enlace filtrado funciona.
- [ ] Paginación 10/página con total visible («Mostrant X–Y de Z»).
- [ ] Cambio de estado inline sigue respetando transiciones (`canTransitionFlowerOrderStatus`).
- [ ] Columna difunt enlace a editar esquela cuando `showObituary=true`.
- [ ] Menú lateral incluye acceso directo a Comandes.
- [ ] `npm run build` passes.

## Capas / archivos principales

- `src/lib/db/queries.ts` — paginar `getAllFlowerOrders`
- `src/components/admin/flower-orders-table.tsx` — enlaces + empty state
- `src/app/admin/(dashboard)/flores/comandas/page.tsx`
- `src/app/admin/(dashboard)/layout.tsx` — nav link

## Issues relacionadas

- RD-119, RD-121

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-flores-admin](../legacy/requisits-flores-admin.md)
