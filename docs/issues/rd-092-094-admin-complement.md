## Objetivo

Backoffice complementario: CRUD poemas, configuración de funeraria (`site_config`) y CMS secciones home.

## Roadmap

- **RD-092** — CRUD `poem_templates`
- **RD-093** — Config funerària (contacte, marca)
- **RD-094** — CMS home `content_sections`

## Contexto

Contacto y contenido home hoy vienen del seed/patch scripts. Poemas usados en zona familiar.

## Alcance

| In | Fuera |
|----|-------|
| Admin UI per tres àrees | Multi-tenant SaaS |
| Edició `site_config` (telèfon, logo paths, theme) | Deploy prod |
| Edició seccions home i18n ca/es | |

## Criterios de aceptación

- [ ] Admin edita contacte i marca sense tocar seed
- [ ] Admin CRUD poemes actius
- [ ] Admin edita seccions home publicades
- [ ] `npm run build` pasa

## Capas / archivos principales

- `src/app/admin/(dashboard)/config/`
- `src/app/admin/(dashboard)/poemas/`
- `src/app/admin/(dashboard)/home-cms/`

## Issues relacionadas

- rd-050-057-home-validacio-cms

## Referencias

- [ROADMAP](../ROADMAP_ENTREGA.md)
- [requisits-home-cms](../legacy/requisits-home-cms.md)
