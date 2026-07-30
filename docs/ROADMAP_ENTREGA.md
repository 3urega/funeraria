# Roadmap de entrega — 0 → 100%

> **Audiencia:** Product Manager · **Última actualización:** julio 2026  
> **Progreso global:** 83 / 97 tareas (**86%**)

Documento maestro sintético. El detalle técnico está en los enlaces de cada fase.  
Los agentes deben **marcar `[x]`** al completar cada ítem — ver [`AGENTS.md`](../AGENTS.md).

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| `[x]` | Hecho: cumple requisitos y es **entregable** (no placeholder ni esqueleto) |
| `[ ]` | Pendiente |
| 📄 | Documentación de referencia |

> **Regla:** rutas que existen pero son HTML genérico sin identidad visual, diseño acordado o funcionalidad completa del requisito → **no marcar `[x]`**. Ver criterios en [`AGENTS.md`](../AGENTS.md).

---

## Fase 0 — Discovery y documentación

📄 [DOCUMENTO_REQUISITOS.md](./DOCUMENTO_REQUISITOS.md) · [legacy_project.md](./legacy_project.md) · [arquitectura.md](./arquitectura.md) · [ESTRATEGIA_DESARROLLO_LOCAL.md](./ESTRATEGIA_DESARROLLO_LOCAL.md)

- [x] **RD-001** — Reverse-engineering del legacy Angular + DRS ampliado
- [x] **RD-002** — Arquitectura objetivo (Next.js monolito + Supabase prod)
- [x] **RD-003** — Estrategia desarrollo local (SQLite, `./storage/`, sin Docker)
- [x] **RD-004** — Dominio esquela vs obituario documentado
- [x] **RD-005** — Flujo foto esquela (familiar envía → empleado retoca → publica)
- [x] **RD-006** — Flujo foto en paper (escaneo desde backoffice)
- [x] **RD-007** — Página pública esquela (mapas, mensajes, flores) especificada
- [x] **RD-008** — E-commerce flores + admin catálogo especificado
- [x] **RD-009** — Plantilla visual esquela (patrón Pujols) documentada
- [x] **RD-010** — Formulario admin esquela + preview especificado
- [x] **RD-011** — Este roadmap maestro (`ROADMAP_ENTREGA.md`)
- [x] **RD-012** — Catálogo de lugares: iglesias, cementerios, salas de vetlla ([`requisits-lugares.md`](./legacy/requisits-lugares.md))
- [x] **RD-013** — Inventario proyecto legacy ([`legacy_project.md`](./legacy_project.md)) — gap analysis vs roadmap

---

## Fase 1 — Fundación técnica (MVP scaffold)

- [x] **RD-020** — Proyecto Next.js 16 + TypeScript + Tailwind en raíz del repo
- [x] **RD-021** — Route groups: `(public)`, `(family)`, `admin`
- [x] **RD-022** — SQLite + Drizzle (`data/dev.db`, scripts `db:setup` / `db:reset`)
- [x] **RD-023** — Storage local (`./storage/`) + API `/api/media/[...path]`
- [x] **RD-024** — Seed demo (funerària Pujols, esquela Ramon, código `DEMO1234`)
- [x] **RD-025** — Auth admin mock (`admin@local.dev` / `admin123`)
- [x] **RD-026** — Auth familiar JWT (cookie `family_session`, 24 h)
- [x] **RD-027** — Middleware protección rutas admin y `/mi-esquela`
- [x] **RD-028** — Assets legacy copiados a `public/rescate/` *(integrados en home y páginas públicas — RD-058)*

---

## Fase 2 — Modelo de datos

- [x] **RD-030** — Tablas core: `funeral_homes`, `site_config`, `churches`, `cemeteries`
- [x] **RD-031** — Tabla `obituaries` con campos esquela estructurados
- [x] **RD-032** — Campos foto moderada (`customImagePath`, `familyImageStatus`)
- [x] **RD-033** — Campos obituario familiar (`obituarioPoemTemplateId`, `obituarioText`)
- [x] **RD-034** — Tabla `poem_templates` + seed
- [x] **RD-035** — Tabla `content_sections` (estructura, sin UI)
- [x] **RD-038** — Tabla `wake_rooms` + `obituaries.wakeRoomId` (sales de vetlla)
- [x] **RD-036** — Tabla `commemorative_messages` (missatges conmemoratius) *(#7)*
- [x] **RD-037** — Tablas `flower_products` + `flower_orders` *(#8)*

---

## Fase 3 — Plantilla esquela impresa

📄 [requisits-esquela-plantilla.md](./legacy/requisits-esquela-plantilla.md)

- [x] **RD-040** — Componente `EsquelaPrintLayout` con patrón visual Pujols
- [x] **RD-041** — Builder `buildEsquelaPrintData()` (campos → textos)
- [x] **RD-042** — Integración técnica de la plantilla en `/esquelas/[slug]` y `/mi-esquela`
- [x] **RD-043** — `siteConfig`: `brandName`, `mortuaryDefault`, `contact.website`
- [x] **RD-044** — Estilos finales alineados 1:1 con PDF impreso (tipografía, márgenes)

---

## Fase 4 — Web pública (mínimo viable)

📄 [requisits-esquela-publica.md](./legacy/requisits-esquela-publica.md) · [requisits-home-plantilla.md](./legacy/requisits-home-plantilla.md) · [requisits-home-cms.md](./legacy/requisits-home-cms.md)

- [ ] **RD-050** — Home pública (`/`) segons mockup [`home-referencia-mockup.png`](./legacy/home-referencia-mockup.png) — **codi implementat** (`HomePageLayout`, 7 seccions); pendent **validació visual PM** i sign-off *(no marcar fins acord amb client)*
- [x] **RD-051** — Listado esquelas (`/esquelas`) con diseño de producto *(PublicSiteShell, cards unificadas, textura Pujols — #5)*
- [x] **RD-052** — Página pública del difunto (`/esquelas/[slug]`) completa según requisitos *(plantilla + obituario + mapas + missatges + flors — #6–8)*
- [x] **RD-053** — Obituario poètic en secció separada (si existeix)
- [x] **RD-054** — Secció llocs: església + cementiri amb enllaços Google Maps *(EsquelaPlacesSection — #6)*
- [x] **RD-055** — Formulari missatge conmemoratiu (text + nom → sala de vetlla) *(#7)*
- [x] **RD-056** — Catàleg flors + checkout des de l'esquela *(#8)*
- [x] **RD-057** — Home corporativa amb seccions editables des de CMS *(RD-094, #9 jul 2026)*
- [x] **RD-058** — Integració assets `public/rescate/` + identitat visual legacy *(home, listado esquelas, sales de vetlla — #5)*
- [x] **RD-059** — Pàgina pública sales de vetlla (`/sales-de-vetlla`) — nom, foto, text + identitat Pujols *(#5)*

---

## Fase 5 — Zona familiar

📄 [requisits-obituary.md](./legacy/requisits-obituary.md)

- [x] **RD-060** — Pàgina accés per codi (`/acceso`)
- [x] **RD-061** — Validació codi + errors (`NO_OBITUARY`, `NOT_ACTIVE`)
- [x] **RD-062** — Vista `/mi-esquela` (esquela + obituari separats)
- [x] **RD-063** — Enviar foto esquela (queda pendent de retocar, no publica)
- [x] **RD-064** — Personalitzar obituari (poema + text)
- [x] **RD-065** — Logout familiar
- [x] **RD-066** — Notificació a l'empleat quan arriba foto pendent *(#11, jul 2026)*

---

## Fase 5b — Catálogo de lugares (admin) — **prerrequisito formulario esquela**

📄 [requisits-lugares.md](./legacy/requisits-lugares.md)

L'empleat ha de poder **assignar** església, cementiri i sala de vetlla des de catàlegs abans de crear esquelas.

- [x] **RD-067** — CRUD esglésies (`/admin/lugares/iglesias`) — nom, ciutat, geoloc Google, foto
- [x] **RD-068** — CRUD cementiris (`/admin/lugares/cementerios`) — nom, ciutat, geoloc Google, foto
- [x] **RD-069** — CRUD sales de vetlla (`/admin/lugares/salas-vetlla`) — nom, text, foto, actiu

---

## Fase 6 — Backoffice esquelas

📄 [requisits-esquela-admin-form.md](./legacy/requisits-esquela-admin-form.md)

> **Depèn de:** Fase 5b (RD-067, RD-068, RD-069) per als `<select>` de llocs.

- [x] **RD-070** — Login admin (`/admin/login`)
- [x] **RD-071** — Dashboard amb estadístiques bàsiques
- [x] **RD-072** — Llistat esquelas (taula + badge foto familiar pendent)
- [x] **RD-073** — Crear esquela (`/admin/esquelas/nueva`) — formulari + preview viu
- [x] **RD-074** — Editar esquela (`/admin/esquelas/[id]`) — formulari + preview viu
- [x] **RD-075** — Upload foto retocada / escanejada → `imagePath`
- [x] **RD-076** — Gestionar foto familiar pendent (veure, descarregar, publicar retoc)
- [x] **RD-077** — Generar `visitCode` i `slug` automàtics
- [x] **RD-078** — Pestanya comandes flors per difunt *(#8)*
- [x] **RD-079** — Pestanya missatges conmemoratius per difunt *(#7)*
- [x] **RD-088** — Missatges: flag `reviewed` + filtre admin (legacy `Condolence.checked`) — veure [`legacy_project.md`](./legacy_project.md) §7 *(#11, jul 2026)*

---

## Fase 7 — E-commerce flors

📄 [requisits-flores.md](./legacy/requisits-flores.md) · [requisits-flores-admin.md](./legacy/requisits-flores-admin.md)

- [x] **RD-080** — CRUD productes flors (`/admin/flores`) — nom, preu, foto, actiu *(#8)*
- [x] **RD-081** — Upload imatge producte *(#8)*
- [x] **RD-082** — Catàleg públic a l'esquela (només productes actius) *(#8)*
- [x] **RD-083** — Checkout amb dedicatòria obligatòria + dades comprador *(#8)*
- [x] **RD-084** — Pasarela stub dev (comanda → `paid` automàtic; només entorn local) *(#8)*
- [x] **RD-085** — Llistat comandes admin (global + per difunt) *(#8)*
- [x] **RD-086** — Estats comanda (`paid` → `in_preparation` → `delivered`) *(#8)*
- [ ] **RD-087** — Stripe real en producció (Checkout, webhook `pending_payment` → `paid`) — veure [`legacy_project.md`](./legacy_project.md) §10

---

## Fase 8 — Admin complementari

- [x] **RD-092** — CRUD poemes obituari (`poem_templates`) *(#9, jul 2026)*
- [x] **RD-093** — Configuració funerària (`site_config`) — contacte, marca, casa mortuòria, WhatsApp *(#9)*
- [x] **RD-094** — CMS seccions home (`content_sections`) — veure [`requisits-home-cms.md`](./legacy/requisits-home-cms.md) *(#9)*

> Iglesias, cementerios y salas de vetlla → **Fase 5b** (RD-067–069).

---

## Fase 9 — Producción e idiomas

📄 [arquitectura.md](./arquitectura.md) · [ESTRATEGIA_DESARROLLO_LOCAL.md](./ESTRATEGIA_DESARROLLO_LOCAL.md)

- [x] **RD-100** — Migració schema SQLite → Supabase PostgreSQL *(dual driver, schema.pg, exec async — #10, jul 2026)*
- [x] **RD-101** — Storage local → Supabase Storage (paths compatibles) *(SupabaseStorageAdapter — #10)*
- [x] **RD-102** — Auth admin → Supabase Auth *(email + JWT híbrido; Google OAuth pendent — #10)*
- [x] **RD-103** — Deploy Vercel *(staging `develop`; guia [`DEPLOY_STAGING.md`](./DEPLOY_STAGING.md) — #10)*
- [x] **RD-104** — Variables entorn prod + secrets *(`.env.staging.example` — #10)*
- [ ] **RD-105** — i18n next-intl (CA + ES ja implementats; EN legacy opcional post-MVP; admin i18n pendent)
- [ ] **RD-106** — Theming per client (colors, logo des de `site_config`)

---

## Fase 10 — Calidad y entrega

- [ ] **RD-110** — Tests E2E fluxos crítics (acces familiar, esquela pública, admin login)
- [ ] **RD-111** — Revisió accessibilitat (esquela, formularis)
- [ ] **RD-112** — Revisió SEO esquelas (`generateMetadata`, sitemap)
- [ ] **RD-113** — Documentació desplegament per al client
- [ ] **RD-114** — Formació empleats (guia backoffice)
- [ ] **RD-115** — Entrega producció + handoff

---

## Fase 11 — Admin UX listas (filtros, paginación, acciones inline)

📄 Batch issues: [`manifest.admin-listas-v1.json`](./issues/manifest.admin-listas-v1.json)

- [x] **RD-116** — Infra listas admin (URL params, paginación 10, componentes compartidos) + piloto **Poemas** *(#12, jul 2026)*
- [x] **RD-117** — Lista **Esquelas**: filtros (activa, visible, foto/missatges pendents, cerca), toggles inline, PATCH flags *(#13, jul 2026)*
- [ ] **RD-118** — Listas **Lugares** (iglesias, cementerios, sales): búsqueda, paginación, toggle activo sala, eliminar
- [ ] **RD-119** — Catálogo **Flores**: filtros activo, paginación, toggle inline
- [ ] **RD-120** — **Comandas** flores: filtros UI por estado, paginación, enlace sidebar
- [ ] **RD-121** — **Dashboard** enlaces a filtros + missatges esquela (bulk revisat, paginación)

---

## Mapa de documentación

| Tema | Documento |
|------|-----------|
| Requisitos completos | [DOCUMENTO_REQUISITOS.md](./DOCUMENTO_REQUISITOS.md) |
| Proyecto legacy (inventario) | [legacy_project.md](./legacy_project.md) |
| Arquitectura | [arquitectura.md](./arquitectura.md) |
| Dev local | [ESTRATEGIA_DESARROLLO_LOCAL.md](./ESTRATEGIA_DESARROLLO_LOCAL.md) |
| Esquela vs obituario | [legacy/requisits-obituary.md](./legacy/requisits-obituary.md) |
| Plantilla impresa | [legacy/requisits-esquela-plantilla.md](./legacy/requisits-esquela-plantilla.md) |
| Formulari admin esquela | [legacy/requisits-esquela-admin-form.md](./legacy/requisits-esquela-admin-form.md) |
| Pàgina pública visitant | [legacy/requisits-esquela-publica.md](./legacy/requisits-esquela-publica.md) |
| Home — plantilla visual | [legacy/requisits-home-plantilla.md](./legacy/requisits-home-plantilla.md) |
| Home — CMS / contingut | [legacy/requisits-home-cms.md](./legacy/requisits-home-cms.md) |
| Mockup home (referència) | [legacy/home-referencia-mockup.png](./legacy/home-referencia-mockup.png) |
| Missatges conmemoratius | [legacy/requisits-missatges.md](./legacy/requisits-missatges.md) |
| Compra flors | [legacy/requisits-flores.md](./legacy/requisits-flores.md) |
| Admin e-commerce flors | [legacy/requisits-flores-admin.md](./legacy/requisits-flores-admin.md) |
| Lugares (iglesias, cementerios, salas) | [legacy/requisits-lugares.md](./legacy/requisits-lugares.md) |
| Exemple visual | [legacy/2020025.jpg](./legacy/2020025.jpg) |

---

## Resumen ejecutivo PM

| Área | Hecho | Pendiente | Prioridad siguiente |
|------|-------|-----------|---------------------|
| Documentación | 100% | Roadmap vivo | Mantener al día |
| Infra + scaffold | 100% | — | — |
| Esquela plantilla web | 100% | — | — |
| Zona familiar | 100% | UI sin pulir | Baja |
| Web pública | 85% | Validación visual home (RD-050) | Media |
| Backoffice esquelas | 100% | — | — |
| Catálogo lugares | 100% | — | — |
| E-commerce flors | 85% | Stripe prod (RD-087); stub dev hecho (RD-084) | Media (pre-prod) |
| Admin complementario | 100% | Listas UX RD-118–121 (#14–#17) | Alta |
| Producción | 85% | Staging listo (RD-100–104); dominio prod + RD-105/106 | Media |

**Siguiente hito recomendado:** **RD-118** — listas lugares con búsqueda y paginación ([#14](https://github.com/3urega/funeraria/issues/14)).

---

## GitHub issues (batch admin-listas-v1 — publicadas)

Manifest: [`manifest.admin-listas-v1.json`](./issues/manifest.admin-listas-v1.json)

| # | RD | Issue |
|---|-----|-------|
| 12 | RD-116 | [Admin list foundation](https://github.com/3urega/funeraria/issues/12) |
| 13 | RD-117 | [Admin esquelas list](https://github.com/3urega/funeraria/issues/13) |
| 14 | RD-118 | [Admin lugares lists](https://github.com/3urega/funeraria/issues/14) |
| 15 | RD-119 | [Admin flores catálogo](https://github.com/3urega/funeraria/issues/15) |
| 16 | RD-120 | [Admin comandas flores](https://github.com/3urega/funeraria/issues/16) |
| 17 | RD-121 | [Dashboard + sub-listas](https://github.com/3urega/funeraria/issues/17) |

Borradores locales: `docs/issues/rd-116-*.md` … `rd-121-*.md`

---

## GitHub issues (publicadas)

Issues publicadas: [ver en GitHub](https://github.com/3urega/funeraria/issues).

| # | Roadmap | Issue | Estado |
|---|---------|-------|--------|
| 1 | RD-073, RD-077 | [Admin crear esquela](https://github.com/3urega/funeraria/issues/1) | Implementado (#1, jul 2026) |
| 2 | RD-074 | [Admin editar esquela](https://github.com/3urega/funeraria/issues/2) | Implementado (#2, jul 2026) |
| 3 | RD-075, RD-076 | [Admin fotos esquela](https://github.com/3urega/funeraria/issues/3) | Implementado (#3, jul 2026) |
| 4 | RD-040, RD-044 | [Plantilla Pujols 1:1](https://github.com/3urega/funeraria/issues/4) | Implementado (#4, jul 2026) |
| 5 | RD-051, RD-058, RD-059 | [Web pública identidad](https://github.com/3urega/funeraria/issues/5) | Implementado (#5, jul 2026) |
| 6 | RD-054 | [Esquela: mapas](https://github.com/3urega/funeraria/issues/6) | Implementado (#6, jul 2026) |
| 7 | RD-036, RD-055, RD-079 | [Missatges](https://github.com/3urega/funeraria/issues/7) | Implementado (#7, jul 2026) |
| 8 | RD-037, RD-056, RD-078, RD-080–086 | [Flores e-commerce](https://github.com/3urega/funeraria/issues/8) | Implementado (#8, jul 2026) |
| 9 | RD-092–094, RD-057 | [Admin complementario](https://github.com/3urega/funeraria/issues/9) | Implementado (#9, jul 2026) |
| 10 | RD-100–104 | [Producción](https://github.com/3urega/funeraria/issues/10) | Implementado (#10, jul 2026) |
| 11 | RD-088, RD-066 | [Paridad legacy (missatges + foto)](https://github.com/3urega/funeraria/issues/11) | Implementado (#11, jul 2026) |
| 12 | RD-116 | [Admin list foundation](https://github.com/3urega/funeraria/issues/12) | Implementado (#12, jul 2026) |
| 13 | RD-117 | [Admin esquelas list](https://github.com/3urega/funeraria/issues/13) | Implementado (#13, jul 2026) |
| 14 | RD-118 | [Admin lugares lists](https://github.com/3urega/funeraria/issues/14) | Pendiente |
| 15 | RD-119 | [Admin flores catálogo](https://github.com/3urega/funeraria/issues/15) | Pendiente |
| 16 | RD-120 | [Admin comandas flores](https://github.com/3urega/funeraria/issues/16) | Pendiente |
| 17 | RD-121 | [Dashboard + sub-listas esquela](https://github.com/3urega/funeraria/issues/17) | Pendiente |

Ítems pendientes sin issue dedicada aún: RD-050 (home validación), RD-087 (Stripe prod), RD-105 (i18n admin), RD-110–115 (calidad).

---

## Historial de progreso

| Fecha | Tareas | % | Notas |
|-------|--------|---|-------|
| 2026-07-30 | 83/97 | 86% | Admin esquelas list — filtros URL combinables, paginación, toggles PATCH, copiar codi (#13, RD-117). |
| 2026-07-30 | 82/97 | 85% | Admin list foundation — paginación URL, componentes list, piloto Poemas (#12, RD-116). |
| 2026-07-30 | 81/97 | 84% | Batch admin listas — issues #12–#17 (RD-116–121): filtros, paginación, acciones inline. |
| 2026-07-30 | 81/91 | 89% | Producción staging — dual DB Postgres/SQLite, Supabase Storage/Auth, deploy Vercel doc (#10, RD-100–104). |
| 2026-07-12 | 76/91 | 84% | Paridad legacy — missatges `reviewed`, dashboard pendents, stub notif. foto (#11, RD-066, RD-088). |
| 2026-07-12 | 74/91 | 81% | Admin complementario — poemas, site_config, CMS home (#9, RD-092–094, RD-057). |
| 2026-07-12 | 70/91 | 77% | Gap analysis legacy (`legacy_project.md`, RD-013); nous RD-087 (Stripe prod), RD-088 (missatges reviewed); notes RD-050/057/084/105. |
| 2026-07-08 | 69/88 | 78% | E-commerce flors — schema, admin catàleg/comandes, checkout públic stub (#8, RD-037, RD-052, RD-056, RD-078, RD-080–086). |
| 2026-07-06 | 58/88 | 66% | Missatges conmemoratius — schema, formulari públic, pestanya admin (#7, RD-036, RD-055, RD-079). |
| 2026-07-06 | 55/88 | 63% | Esquela pública sección lugares + Google Maps — EsquelaPlacesSection (#6, RD-054). |
| 2026-07-06 | 54/88 | 61% | Web pública identidad Pujols — PublicSiteShell, `/esquelas`, `/sales-de-vetlla` (#5, RD-051, RD-058, RD-059). |
| 2026-07-06 | 52/88 | 59% | Plantilla esquela Pujols 1:1 — EsquelaPrintLayout + format-brand-name (#4, RD-040, RD-044). |
| 2026-07-06 | 50/88 | 57% | Upload foto admin + gestió foto familiar pendent (#3, RD-075, RD-076). |
| 2026-07-06 | 48/88 | 55% | Editar esquela admin + PUT API + enllaços llistat (#2, RD-074). |
| 2026-07-06 | 47/88 | 53% | Crear esquela admin + preview viu + slug/visitCode (#1, RD-073, RD-077). |
| 2026-07-04 | 45/88 | 51% | CRUD esglésies + cementiris amb geoloc Google Places (RD-067, RD-068). |
| 2026-07-04 | 43/88 | 49% | Home Pujols implementada (7 secciones + assets) — RD-050 pendiente validación visual. |
| 2026-07-04 | 43/88 | 49% | Auditoría honestidad: desmarcados RD-040, RD-051, RD-052 (placeholders). Ajuste % ejecutivo. |
| 2026-07-04 | 46/88 | 52% | Corrección: RD-050 home desmarcada — solo placeholder, falta identidad visual. |
| 2026-07-04 | 47/88 | 53% | CRUD sales de vetlla + pàgina pública `/sales-de-vetlla`. |
| 2026-07-04 | 45/87 | 52% | Catálogo lugares documentado; schema `wake_rooms`. |
| 2026-07-04 | 43/84 | 51% | Roadmap inicial. Scaffold, plantilla esquela, zona familiar, docs completas. |
