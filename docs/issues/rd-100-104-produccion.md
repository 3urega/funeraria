## Objetivo

Preparar el paso a producción: Supabase (PostgreSQL + Storage + Auth), deploy Vercel y variables de entorno.

## Roadmap

- **RD-100** — Migració schema SQLite → Supabase PostgreSQL
- **RD-101** — Storage → Supabase Storage
- **RD-102** — Auth admin → Supabase Auth
- **RD-103** — Deploy Vercel
- **RD-104** — Variables entorn prod

## Contexto

Desarrollo local con SQLite documentado en [`ESTRATEGIA_DESARROLLO_LOCAL.md`](../ESTRATEGIA_DESARROLLO_LOCAL.md). Drivers abstractos en arquitectura.

## Alcance

| In | Fuera |
|----|-------|
| Migració schema i paths compatibles | Features producto nuevas |
| Deploy preview + prod | Formació client (RD-114) |
| Auth prod admin | i18n admin (RD-105 parcial) |

## Criterios de aceptación

- [ ] App corre en Vercel amb Supabase
- [ ] Storage i auth funcionen en prod
- [ ] Documentació env prod actualitzada
- [ ] `npm run build` pasa

## Capas / archivos principales

- `src/lib/db/`
- `src/lib/storage/`
- `src/lib/auth/`
- CI/Vercel config

## Issues relacionadas

- rd-110-115-calidad-entrega

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [arquitectura](../arquitectura.md)
