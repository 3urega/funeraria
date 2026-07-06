# Plantilla de la home — patró visual (referència mockup)

> **Referència visual:** [`home-referencia-mockup.png`](home-referencia-mockup.png)  
> **Estat:** **implementat** per Funeraria Pujols — pendent validació visual abans de marcar RD-050.  
> **Ruta:** `/`  
> **Component futur:** `src/components/home/home-page-layout.tsx` (o seccions a `src/components/home/*`)

## Objectiu

La home ha de transmetre **serenor, confiança i disponibilitat 24h**, amb una estructura fixa de seccions i contingut editable per funerària. El mockup de referència («Serenitas») defineix el **layout i jerarquia visual**; cada client (p. ex. **Funeraria Pujols**) aporta nom, logo, colors, telèfon i textos via `site_config` + `content_sections`.

> **Multi-client:** el nom visible ve de `site_config.brand_name` (veure `src/lib/site/tenant.ts`). Cap text de marca hardcodejat al codi.

---

## Wireframe complet (7 blocs + capçalera)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR (fons fosc)                                                         │
│  Estamos disponibles 24 horas…          Atención inmediata  [telèfon]     │
├─────────────────────────────────────────────────────────────────────────────┤
│ HEADER (fons blanc)                                                         │
│  [logo] {brandName}          NAV links…              [📞 tel] ATENCIÓN 24H │
├─────────────────────────────────────────────────────────────────────────────┤
│ HERO (imatge full-width + overlay fosc)                                     │
│                                                                             │
│   {hero.title}                    ← serif gran, blanc                       │
│   {hero.subtitle}                 ← sans, blanc                             │
│   [ Necesito ayuda ahora ]  [ Ver servicios ]   ← botons primari/secundari  │
├─────────────────────────────────────────────────────────────────────────────┤
│ SERVICIOS (fons clar)                                                       │
│        NUESTROS SERVICIOS (petit, accent)                                   │
│        {services.heading}                                                   │
│   [icon] [icon] [icon] [icon] [icon] [icon] [icon]   ← graella 7 columnes │
│        {services.items[].label}                                             │
│              [ Ver todos los servicios ]                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ POR QUÉ ELEGIRNOS (split 50/50)                                             │
│  ┌──────────────────┬──────────────────────────────────────────────────┐  │
│  │  [foto capella   │  fons fosc                                       │  │
│  │   o instal·lació]│  {why_us.heading}                                │  │
│  │                  │  [icon] Atención 24h    [icon] Cercanía          │  │
│  │                  │  [icon] Transparencia   [icon] Experiencia         │  │
│  └──────────────────┴──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ESQUELAS RECIENTES (fons clar)                                              │
│        ESQUELAS RECIENTES                                                   │
│        {obituaries.heading}                                                 │
│   [card] [card] [card] [card]   ← dades reals `obituaries` (isVisible)     │
│              [ Ver todas las esquelas ]                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ CTA TRIPLE (fons gris molt clar)                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐                  │
│  │ Planifica   │  │ Apoyo duelo │  │ ¿Necesitas ayuda?   │  ← 3a caixa fosca│
│  │ + enllaç    │  │ + enllaç    │  │ telèfon gran        │                  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ FOOTER (fons fosc)                                                          │
│  logo + tagline    Enlaces    Servicios    Contacto 24h    [WhatsApp]       │
│  xarxes socials                                                             │
│  © {brandName} · avís legal · privacitat · cookies                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Seccions — contingut i origen de dades

| # | Secció | Contingut | Origen |
|---|--------|-----------|--------|
| 0 | **Top bar** | Disponibilitat 24h + telèfon d'urgència | `content_sections` clau `top_bar` o camps fixos a `site_config.contact` |
| 1 | **Header** | Logo, nom, navegació, CTA telèfon | `site_config` (logo, brand, contact) + nav fixa |
| 2 | **Hero** | Títol, subtítol, 2 botons, imatge de fons | `content_sections.hero` + `site_config.theme.heroImagePath` |
| 3 | **Servicios** | Títol + 7 serveis amb icona | `content_sections.services` |
| 4 | **Por qué elegirnos** | Foto + 4 punts forts | `content_sections.why_us` + imatge |
| 5 | **Esquelas recientes** | Fins a 4 targetes | **Query** `getVisibleObituaries()` — no és CMS |
| 6 | **CTA triple** | 2 blocs informatius + 1 urgència | `content_sections.cta_blocks` |
| 7 | **Footer** | Enllaços, contacte, legal, xarxes | `content_sections.footer` + `site_config.contact` |

### Funeraria Pujols — valors inicials acordats

| Camp | Valor demo |
|------|------------|
| `brand_name` | Funeraria Pujols |
| Telèfon | 938250119 |
| Adreça | C/. Roser, 22 08680 GIRONELLA |
| Email | funeraria@pujols.cat |
| Text presentació (hero o «nosotros») | *La Funeraria Pujols de Gironella es el centro funerario de referencia del Baix Berguedà…* (2 paràgrafs — veure seed) |

### Assets implementats (Pujols)

| Ús | Ruta |
|----|------|
| Logo header/footer | `/funeraria pujols.png` |
| Hero (fons) | `/gironella-10-1024x698.jpg` |
| Por qué elegirnos | `/rescate/salas/sala1.png` |
| Textura servicios | `/rescate/texturas/white_bg.jpg` |
| Textura CTA | `/rescate/texturas/texture_background_light.png` |
| Textura footer | `/rescate/texturas/top_bg.jpg` |

---

## Navegació (header)

Enllaços del mockup adaptats al producte actual:

| Mockup | Ruta MVP | Nota |
|--------|----------|------|
| INICIO | `/` | Home |
| NOSOTROS | `/nosotros` o secció `#nosotros` | **Fase 2** — pot ser anchor a `why_us` |
| SERVICIOS | `/servicios` o `#servicios` | **Fase 2** — anchor a graella serveis |
| ESQUELAS | `/esquelas` | Implementat (disseny pendent) |
| PLANIFICACIÓN | `/planificacion` | **Futur** |
| APOYO AL DUELO | `/apoyo-duelo` | **Futur** |
| CONTACTO | `/contacto` o `#contacto` | Footer + telèfon |
| — | `/sales-de-vetlla` | Extra Pujols — sales de vetlla |
| — | `/acceso` | Accés familiars (CTA destacat, no al mockup) |

La nav és **estructura fixa** al codi; els labels poden venir de `content_i18n` quan hi hagi i18n (RD-105).

---

## Hero — detall

| Element | Estil | Contingut Pujols (proposta) |
|---------|-------|----------------------------|
| Imatge fons | Full bleed, `object-cover`, overlay gradient fosc 40–60% | Asset client (`theme.heroImagePath`) — flor, capella o instal·lació |
| Títol | Serif, 2.5–3.5rem, blanc | *Acompañamos cuando más se necesita* (editable CMS) |
| Subtítol | Sans, 1–1.25rem, blanc/gris clar | Primer paràgraf del text de presentació (truncat o complet segons disseny) |
| Botó primari | Fons accent, icona telèfon | «Necesito ayuda ahora» → `tel:{phone}` |
| Botó secundari | Vora blanca, transparent | «Ver nuestros servicios» → `#servicios` |

---

## Graella de serveis (7 ítems)

Icones lineals daurades/accent sobre fons clar. Cada ítem:

```ts
{ icon: string; label: string; href?: string }
```

**Valors per defecte (seed)** — adaptables per funerària:

1. Funeral completo  
2. Incineración  
3. Traslados nacionales e internacionales  
4. Tanatorio  
5. Floristería  
6. Gestión documental  
7. Ceremonias religiosas y civiles  

Botó inferior: «Ver todos los servicios» → `/servicios` (quan existeixi).

---

## Por qué elegirnos — split

| Columna esquerra | Columna dreta |
|------------------|---------------|
| Foto vertical (capella, sala de vetlla, instal·lació) | Fons `#1E2A32` (o `theme.dark`) |
| `why_us.imagePath` | Eyebrow daurat + títol serif blanc |
| | Graella 2×2: icona + títol + descripció curta |

**4 punts per defecte** (com al mockup):

| Títol | Descripció |
|-------|------------|
| Atención 24 horas | Disponibles todos los días del año, a cualquier hora. |
| Cercanía y confianza | Un equipo humano que te acompaña de verdad. |
| Transparencia | Información clara y precios sin sorpresas. |
| Experiencia | Text configurable (p. ex. años en el sector). |

---

## Esquelas recientes

- Query: `getVisibleObituaries()` limit 4.
- Targeta: foto (`imagePath`), nom, anys (si disponibles), data/hora funeral (si disponibles), enllaç «Ver homenaje →» → `/esquelas/[slug]`.
- Reutilitzar i **estendre** `ObituaryCard` per coincidir amb el mockup (no la targeta Tailwind actual).
- Botó: «Ver todas las esquelas» → `/esquelas`.

---

## CTA triple (pre-footer)

| Caixa | Fons | Contingut |
|-------|------|-----------|
| Planifica | Beige clar `#F5F0E8` | Icona, títol, text, enllaç «Más información →» |
| Apoyo duelo | Beige clar | Icona, títol, text, enllaç «Ver recursos →» |
| Urgència | Fosc (mateix que footer) | «¿Necesitas ayuda ahora?», text curt, **telèfon gran** en accent |

---

## Footer

| Columna | Contingut |
|---------|-----------|
| 1 | Logo + tagline (`footer.tagline`) + icones xarxes (`footer.social`) |
| 2 | Enllaços ràpids (`footer.links`) |
| 3 | Llista serveis (`footer.services`) |
| 4 | Contacte 24h + botó WhatsApp (`contact.whatsapp` opcional) |
| Barra inferior | © `{brandName}` + legal |

---

## Estil visual

| Element | Valor mockup | Configurable per client |
|---------|--------------|-------------------------|
| Accent / daurat | `#C9A962` | `site_config.theme.primary` (Pujols: `#C41E3A` vermell — **decidir amb client**) |
| Fons fosc | `#1E2A32` | `site_config.theme.dark` |
| Fons clar seccions | `#FAFAF8` | `site_config.theme.background` |
| Beige caixes CTA | `#F5F0E8` | `site_config.theme.muted` |
| Títols | Serif (Georgia, Playfair, o similar) | `theme.fontHeading` |
| Cos | Sans (Inter, system-ui) | `theme.fontBody` |
| Logo | Esquerra header + footer | `site_config.logoPath` → `/api/media/...` |

---

## Fitxers previstos (implementació)

| Fitxer | Rol |
|--------|-----|
| `src/app/(public)/page.tsx` | Orquestra dades + `HomePageLayout` |
| `src/components/home/home-page-layout.tsx` | Composició de totes les seccions |
| `src/components/home/home-top-bar.tsx` | Barra 24h |
| `src/components/home/home-header.tsx` | Capçalera (substitueix `PublicHeader` a `/`) |
| `src/components/home/home-hero.tsx` | Hero amb imatge |
| `src/components/home/home-services-grid.tsx` | Graella serveis |
| `src/components/home/home-why-us.tsx` | Split foto + punts forts |
| `src/components/home/home-recent-obituaries.tsx` | Esquelas recents |
| `src/components/home/home-cta-blocks.tsx` | Triple CTA |
| `src/components/home/home-footer.tsx` | Peu (substitueix `PublicFooter` a `/`) |
| `src/lib/home/build-home-data.ts` | `site_config` + `content_sections` → props |
| `src/lib/site/tenant.ts` | `brandName`, tenant (ja existeix) |

---

## Relació amb altres pàgines

- La home comparteix **identitat visual** (colors, tipografia, header/footer) amb la resta de la web pública un cop RD-058 estigui fet.
- Les **esquelas** de la home enllacen a `/esquelas/[slug]` (plantilla impresa — [`requisits-esquela-plantilla.md`](requisits-esquela-plantilla.md)).
- El **CMS** per editar textos/imatges: [`requisits-home-cms.md`](requisits-home-cms.md).

---

## Criteri «fet» (RD-050)

Marca `[x]` al roadmap **només** quan:

- [ ] Layout coincideix amb el mockup (7 seccions + capçalera).
- [ ] Nom, telèfon i logo venen de `site_config` (zero hardcode).
- [ ] Hero amb imatge de fons real del client.
- [ ] Esquelas recents amb targetes estil mockup.
- [ ] Responsive (mòbil: nav col·lapsable, graella serveis 2 cols, split `why_us` apilat).
- [ ] `npm run build` passa.
