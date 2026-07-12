## Objetivo

Cerrar los huecos de paridad funcional detectados en [`legacy_project.md`](../legacy_project.md) respecto al backoffice Pujols antiguo: marcar missatges conmemoratius como revisados y notificar al empleado cuando llega una foto familiar pendiente.

## Roadmap

- **RD-088** — Missatges: flag `reviewed` + filtre admin (legacy `Condolence.checked`)
- **RD-066** — Notificació a l'empleat quan arriba foto pendent

## Contexto

Tras cerrar #9 (admin complementario), el núcleo operativo ya supera al legacy Angular + backoffice S3. Quedan mejoras de operativa diaria del empleado documentadas en el gap analysis (jul 2026).

Referencias:
- [`legacy_project.md`](../legacy_project.md) §7 (Condolence.checked), §8 (foto familiar)
- [`requisits-missatges.md`](../legacy/requisits-missatges.md)
- [`requisits-obituary.md`](../legacy/requisits-obituary.md) — flujo foto familiar

## Alcance

| In | Fuera |
|----|-------|
| Campo `reviewed` (boolean) en `commemorative_messages` | `poemImage` (confirmar con cliente primero) |
| Checkbox «revisado» en pestaña missatges por esquela | Stripe real (RD-087) |
| Filtro o badge «pendientes de revisar» en admin | EN como tercer idioma |
| Notificación empleado: email **o** indicador visible en dashboard al subir foto familiar | Recuperar home legacy (pricing/portfolio) |
| API admin para marcar missatge como revisado | Roles editor/operator |
| `npm run build` pasa | Deploy prod (issue #10) |

## Criterios de aceptación

### RD-088 — Missatges revisados

- [ ] Schema: columna `reviewed` (boolean, default `false`) en `commemorative_messages`
- [ ] Admin en pestaña missatges de `/admin/esquelas/[id]`: checkbox o botón «Marcar como revisado»
- [ ] Listado o badge que permita ver cuántos missatges quedan sin revisar (por esquela o global en dashboard)
- [ ] Los missatges nuevos entran con `reviewed = false`

### RD-066 — Foto familiar pendiente

- [ ] Tras `POST /api/family/esquela` con foto válida, el empleado recibe señal visible sin refrescar manualmente el listado (mínimo: contador en dashboard admin **o** email stub documentado)
- [ ] El badge «foto pendiente» en listado de esquelas sigue funcionando

### General

- [ ] `npm run build` pasa
- [ ] Marcar RD-088 y RD-066 en `ROADMAP_ENTREGA.md` al cerrar

## Capas / archivos principales

- `src/lib/db/schema.ts` — `commemorative_messages.reviewed`
- `src/lib/db/queries.ts` — queries missatges + contadores
- `src/components/admin/esquela-messages-panel.tsx` — UI revisado
- `src/app/api/admin/commemorative-messages/[id]/route.ts` — PATCH reviewed
- `src/app/api/family/esquela/route.ts` — hook notificación
- `src/app/admin/(dashboard)/page.tsx` — stats foto/missatges pendientes
- `scripts/seed.ts` — si aplica demo

## Slices verticales

| Slice | Valor | Archivos |
|-------|-------|----------|
| VS1 | Empleado marca missatges como revisados | schema, API PATCH, panel admin |
| VS2 | Empleado ve pendientes (missatges + fotos) | dashboard stats, badges |

## Issues relacionadas

- #9 — Admin complementario (cerrada)
- #10 — Producción Supabase + Vercel (siguiente hito infra)

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md) — RD-066, RD-088
- [legacy_project.md](../legacy_project.md)
- [requisits-missatges.md](../legacy/requisits-missatges.md)
