## Objetivo

Módulo completo de compra de flores desde la esquela pública: catálogo admin, checkout con dedicatoria y gestión de comandas.

## Roadmap

- **RD-037** — Tablas `flower_products` + `flower_orders`
- **RD-080**–**RD-086** — CRUD, catálogo público, checkout, pagos, estados

## Contexto

Ver [`requisits-flores.md`](../legacy/requisits-flores.md) y [`requisits-flores-admin.md`](../legacy/requisits-flores-admin.md). Pasarela TBD (Stripe/Redsys).

## Alcance

| In | Fuera |
|----|-------|
| Schema productes/comandes | Integració pagament real (RD-084 pot ser stub inicial) |
| CRUD admin `/admin/flores` | Multi-funerària avançada |
| Catàleg + checkout des de esquela | |
| Llistat comandes admin | |

## Criterios de aceptación

- [ ] Admin gestiona productes actius amb foto i preu
- [ ] Visitant compra flors per difunt amb dedicatòria obligatòria
- [ ] Comanda guardada amb estat inicial
- [ ] Admin ve comandes (global i per difunt, RD-078)
- [ ] `npm run build` pasa

## Capas / archivos principales

- `src/lib/db/schema.ts`
- `src/app/admin/(dashboard)/flores/`
- `src/app/[locale]/(public)/(site)/esquelas/[slug]/` (secció flors)
- APIs admin + public checkout

## Issues relacionadas

- rd-036-055-missatges-conmemoratius
- rd-074-admin-esquela-editar (tab comandes RD-078)

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-flores](../legacy/requisits-flores.md)
