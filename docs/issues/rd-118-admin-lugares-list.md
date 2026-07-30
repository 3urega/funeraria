## Objetivo

Unificar las tres listas de **lugares** (`/admin/lugares/iglesias`, `cementerios`, `salas-vetlla`) con paginación, búsqueda por nombre/ciudad, y acciones inline donde aplique (activar sala, eliminar con confirmación).

## Roadmap

- **RD-118** — [`docs/ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (Fase 11)

## Contexto

Depende de **RD-116**. Las tres páginas son casi idénticas (tabla HTML duplicada). Conviene un componente **`PlaceListTable`** parametrizado por tipo (`church` | `cemetery` | `wake_room`).

APIs `DELETE` ya existen para los tres; hoy no hay botón en lista.

## Alcance

| In | Fuera |
|----|-------|
| Queries paginadas: `listChurchesPaginated`, `listCemeteriesPaginated`, `listWakeRoomsPaginated` | Mapa embebido en lista |
| Búsqueda `q` (nombre + ciudad) en URL | Crear lugar desde modal (sigue en `/nueva`) |
| Paginación 10/página en las 3 rutas | Reordenar drag-and-drop |
| **Sales de vetlla:** toggle `isActive` inline (añadir PATCH si falta) | Geocoding batch |
| Eliminar fila con `confirm()` + DELETE API; mensaje si FK bloquea (esquela enlazada) | Filtro «sin foto» (opcional post-MVP) |
| Indicador geoloc (Sí/No) mantenido | |

## Criterios de aceptación

- [ ] Las 3 listas comparten toolbar + paginación (mismo UX que poemas/esqueles).
- [ ] Buscar «Gironella» filtra iglesias/cementerios/salas según corresponda.
- [ ] Sala de vetlla: toggle **Activa** sin abrir formulario.
- [ ] Eliminar: confirmación + error legible si el lugar está en uso.
- [ ] `npm run build` passes.

## Capas / archivos principales

- `src/lib/db/queries.ts` — list paginated ×3
- `src/components/admin/places/place-list-table.tsx`
- `src/app/api/admin/wake-rooms/[id]/route.ts` — PATCH `isActive` (si no existe)
- `src/app/admin/(dashboard)/lugares/iglesias/page.tsx` (+ cementerios, salas-vetlla)

## Particularidades por entidad

| Entidad | Filtros extra | Acción inline |
|---------|---------------|---------------|
| Esglésies | — | Editar, Eliminar |
| Cementiris | — | Editar, Eliminar |
| Sales de vetlla | Actives / Inactives / Totes | Toggle actiu, Editar, Eliminar |

## Issues relacionadas

- RD-116, RD-117

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-lugares](../legacy/requisits-lugares.md)
