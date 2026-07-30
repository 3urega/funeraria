## Objetivo

Conectar el **dashboard** y las **sub-listas de esquela** con el nuevo sistema de filtros: enlaces rápidos a listas filtradas, mejoras en missatges (bulk + paginación si aplica), y coherencia visual con RD-116–120.

## Roadmap

- **RD-121** — [`docs/ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (Fase 11)

## Contexto

Depende de **RD-117** (filtros esqueles URL) y **RD-120** (comandas). El dashboard ya muestra KPIs y avisos amarillos; hoy no enlazan a vistas filtradas. `EsquelaMessagesPanel` usa cards con filtro «Només pendents» client-side — escalar si hay muchos missatges.

## Alcance

| In | Fuera |
|----|-------|
| Dashboard: avisos clicables → `/admin/esquelas?photoPending=1`, `?messagesPending=1`, etc. | Rediseño completo dashboard |
| KPI cards opcionales como enlaces (actives, públiques) | Notificaciones push/email |
| Missatges: botón **Marcar tots com a revisats** (API batch o loop PATCH documentado) | Convertir missatges a tabla HTML (opcional; cards OK si paginadas) |
| Missatges: paginación si >20 en una esquela | |
| Documentar convención URL filtros en comentario o `docs/` breve | |

## Criterios de aceptación

- [ ] Clic en aviso «fotos pendents» del dashboard abre lista esqueles filtrada.
- [ ] Clic en aviso missatges abre lista con filtro pendientes.
- [ ] En pestaña Missatges de una esquela: «Marcar tots revisats» funciona y refresca contadores.
- [ ] Si >20 missatges, paginación o «mostrar más» sin bloquear la página.
- [ ] `npm run build` passes.

## Capas / archivos principales

- `src/app/admin/(dashboard)/page.tsx` — enlaces KPI/avisos
- `src/components/admin/esquela-messages-panel.tsx`
- `src/app/api/admin/commemorative-messages/` — endpoint batch opcional `POST .../mark-reviewed`

## Issues relacionadas

- RD-117, RD-120

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-missatges](../legacy/requisits-missatges.md)
