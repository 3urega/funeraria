# Home — CMS i contingut editable (backoffice)

> **Estat:** documentat, **no implementat**.  
> Plantilla visual: [`requisits-home-plantilla.md`](requisits-home-plantilla.md)  
> Roadmap: **RD-094** (admin CMS) · **RD-050** (render públic)

## Objectiu

Cada funerària ha de poder **personalitzar la home** sense tocar codi: textos, imatges, serveis, punts forts i enllaços. El layout és fix (mockup); el contingut ve de `site_config` + `content_sections`.

---

## Dades globals (`site_config`)

Ja existents al schema — s'usen a tota la web:

| Camp | Ús a la home |
|------|--------------|
| `brand_name` | Header, footer, © |
| `logo_path` | Header + footer |
| `contact.phone` | Top bar, header CTA, hero tel, CTA urgència, footer |
| `contact.email` | Footer |
| `contact.address` | Footer |
| `contact.website` | Footer (opcional) |
| `contact.whatsapp` | Botó WhatsApp footer *(afegir al JSON contact si cal)* |
| `theme.primary` | Botons, icones, accents |
| `theme.dark` | Top bar, panells foscos, footer |
| `theme.background` | Fons seccions clares |
| `theme.muted` | Caixes CTA beige |
| `theme.heroImagePath` | Imatge fons hero *(afegir a `theme` JSON)* |

**Admin:** pantalla `/admin/configuracion` (RD-093) — edició global de marca i contacte.

---

## Seccions (`content_sections`)

Taula existent: `section_key`, `content_i18n` (JSON), `is_published`, `sort_order`, `funeral_home_id`.

### Claus de secció per la home

| `section_key` | Secció visual | Publicable |
|---------------|---------------|------------|
| `top_bar` | Barra superior 24h | Sí |
| `hero` | Hero principal | Sí |
| `services` | Graella serveis | Sí |
| `why_us` | Por qué elegirnos | Sí |
| `obituaries_intro` | Títols sobre esquelas (no les dades) | Sí |
| `cta_blocks` | Triple CTA pre-footer | Sí |
| `footer` | Tagline, enllaços, xarxes | Sí |

Les **esquelas** no són CMS — són dades `obituaries`.

---

## Esquema JSON per secció

### `top_bar`

```json
{
  "availabilityText": {
    "es": "Estamos disponibles 24 horas, todos los días del año"
  },
  "urgencyLabel": {
    "es": "Atención inmediata"
  }
}
```

Telèfon: sempre `site_config.contact.phone` (no duplicar).

---

### `hero`

```json
{
  "title": {
    "es": "Acompañamos cuando más se necesita"
  },
  "subtitle": {
    "es": "Ofrecemos apoyo cercano y profesional a las familias en los momentos más difíciles."
  },
  "primaryButton": {
    "es": "Necesito ayuda ahora"
  },
  "secondaryButton": {
    "es": "Ver nuestros servicios"
  },
  "secondaryButtonHref": "/#servicios"
}
```

**Funeraria Pujols — alternativa:** el `subtitle` pot ser el text llarg de presentació (2 paràgrafs) si el disseny ho permet — veure seed actual.

Imatge: `site_config.theme.heroImagePath`.

---

### `services`

```json
{
  "eyebrow": { "es": "NUESTROS SERVICIOS" },
  "heading": { "es": "Estamos a tu lado en cada paso" },
  "items": [
    { "icon": "flower", "label": { "es": "Funeral completo" } },
    { "icon": "urn", "label": { "es": "Incineración" } },
    { "icon": "transfer", "label": { "es": "Traslados nacionales e internacionales" } },
    { "icon": "building", "label": { "es": "Tanatorio" } },
    { "icon": "florist", "label": { "es": "Floristería" } },
    { "icon": "document", "label": { "es": "Gestión documental" } },
    { "icon": "ceremony", "label": { "es": "Ceremonias religiosas y civiles" } }
  ],
  "ctaLabel": { "es": "Ver todos los servicios" },
  "ctaHref": "/servicios"
}
```

Icones: clau string → component SVG al codi (no URL externa).

---

### `why_us`

```json
{
  "eyebrow": { "es": "POR QUÉ ELEGIRNOS" },
  "heading": { "es": "Más de 30 años acompañando a familias como la tuya" },
  "imagePath": "content/why-us/chapel.jpg",
  "features": [
    {
      "icon": "clock",
      "title": { "es": "Atención 24 horas" },
      "text": { "es": "Disponibles todos los días del año, a cualquier hora." }
    },
    {
      "icon": "people",
      "title": { "es": "Cercanía y confianza" },
      "text": { "es": "Un equipo humano que te acompaña de verdad." }
    },
    {
      "icon": "shield",
      "title": { "es": "Transparencia" },
      "text": { "es": "Información clara y precios sin sorpresas." }
    },
    {
      "icon": "ribbon",
      "title": { "es": "Experiencia" },
      "text": { "es": "Referencia en el Baix Berguedà desde Gironella." }
    }
  ]
}
```

---

### `obituaries_intro`

```json
{
  "eyebrow": { "es": "ESQUELAS RECIENTES" },
  "heading": { "es": "Homenajes y recuerdos" },
  "ctaLabel": { "es": "Ver todas las esquelas" },
  "maxItems": 4
}
```

---

### `cta_blocks`

```json
{
  "blocks": [
    {
      "variant": "muted",
      "icon": "leaf",
      "title": { "es": "Planifica con tranquilidad" },
      "text": { "es": "Te ayudamos a tomar decisiones con calma y sin prisas." },
      "linkLabel": { "es": "Más información →" },
      "linkHref": "/planificacion"
    },
    {
      "variant": "muted",
      "icon": "heart-hands",
      "title": { "es": "Apoyo en el duelo" },
      "text": { "es": "Recursos y orientación para familiares en el proceso." },
      "linkLabel": { "es": "Ver recursos →" },
      "linkHref": "/apoyo-duelo"
    },
    {
      "variant": "dark",
      "icon": "phone",
      "title": { "es": "¿Necesitas ayuda ahora?" },
      "text": { "es": "Estamos disponibles 24 horas para atenderte cuando lo necesites." },
      "showPhone": true
    }
  ]
}
```

Telèfon del bloc fosc: `site_config.contact.phone`.

---

### `footer`

```json
{
  "tagline": {
    "es": "La Funeraria Pujols de Gironella — centro funerario de referencia del Baix Berguedà."
  },
  "social": {
    "facebook": "https://facebook.com/...",
    "instagram": "https://instagram.com/...",
    "youtube": null
  },
  "linkGroups": [
    {
      "title": { "es": "Enlaces" },
      "links": [
        { "label": { "es": "Inicio" }, "href": "/" },
        { "label": { "es": "Esquelas" }, "href": "/esquelas" },
        { "label": { "es": "Sales de vetlla" }, "href": "/sales-de-vetlla" }
      ]
    },
    {
      "title": { "es": "Servicios" },
      "links": [
        { "label": { "es": "Funeral completo" }, "href": "/servicios" }
      ]
    }
  ],
  "legal": [
    { "label": { "es": "Aviso legal" }, "href": "/legal/aviso" },
    { "label": { "es": "Política de privacidad" }, "href": "/legal/privacidad" },
    { "label": { "es": "Política de cookies" }, "href": "/legal/cookies" }
  ]
}
```

---

## Builder (codi)

`src/lib/home/build-home-data.ts` — patró igual que `buildEsquelaPrintData()`:

```ts
buildHomePageData({
  siteConfig,
  sections: Record<sectionKey, ContentSection>,
  obituaries: Obituary[],
  brandName: string,
  locale: "es",
}) → HomePageData
```

Resol textos i18n amb fallback `ca` → `es`.

---

## Backoffice — pantalla CMS

**Ruta:** `/admin/contenido/home` (RD-094)

**Layout:** pestanyes o acordió per secció; vista prèvia en iframe o split (com formulari esquela).

| Secció admin | Camps editables |
|--------------|-----------------|
| Hero | títol, subtítol, botons, upload imatge fons |
| Servicios | llista d'ítems (drag reorder), icona, text, enllaç |
| Por qué elegirnos | foto, títol, 4 features |
| Esquelas intro | títols (no les esquelas) |
| CTA blocks | 3 blocs |
| Footer | tagline, xarxes, enllaços |

Botó **Desar** per secció → `PATCH /api/admin/content-sections/[key]`.

Vista prèvia: enllaç «Obrir home» o preview inline.

---

## Seed demo (Funeraria Pujols)

Al executar `npm run db:seed`, omplir totes les claus amb valors coherents amb el mockup i el text de presentació acordat. Actualment només existeix `hero` parcial — cal ampliar el seed quan s'implementi RD-050.

---

## APIs previstes

```
GET  /api/public/home              → JSON agregat (opcional, per ISR)
PATCH /api/admin/content-sections/[key]  → actualitzar secció
POST /api/admin/site-config/hero-image   → upload imatge hero
```

La home pública pot continuar sent **SSR** llegint directament de SQLite (sense API pública obligatòria).

---

## Fitxers

| Fitxer | Rol |
|--------|-----|
| `docs/legacy/requisits-home-plantilla.md` | Layout visual |
| `docs/legacy/home-referencia-mockup.png` | Mockup referència |
| `src/lib/home/build-home-data.ts` | Builder *(pendent)* |
| `src/lib/db/schema.ts` | `content_sections`, `site_config` |
| `scripts/seed.ts` | Dades demo Pujols |
