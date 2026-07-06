# Backoffice — formulari d'esquela (especificació per implementar)

> **Estat:** crear, editar i fotos esquela implementats (RD-073–077); pestanyes flors/missatges pendents.  
> Plantilla visual: [`requisits-esquela-plantilla.md`](requisits-esquela-plantilla.md)  
> Components ja existents: `EsquelaPrintLayout`, `buildEsquelaPrintData()`

## Objectiu

Permetre a l'empleat funerari **crear i editar esquelas** omplint camps estructurats, amb **vista prèvia en viu** idèntica al que veurà el visitant (i el que es imprimirà).

---

## Pantalla principal

**Ruta:** `/admin/esquelas/nueva` (crear) · `/admin/esquelas/[id]` (editar)

**Layout:** dues columnes en desktop; en mòbil, formulari a dalt i preview a sota.

```
┌─────────────────────────┬──────────────────────────┐
│  FORMULARI (esquerra)   │  VISTA PRÈVIA (dreta)    │
│                         │                          │
│  § Difunt               │  <EsquelaPrintLayout />  │
│  § Funeral              │                          │
│  § Vetlla               │  Actualització en viu    │
│  § Foto                 │  (sense guardar)         │
│  § Publicació           │                          │
│                         │                          │
│  [Desar esquela]        │                          │
└─────────────────────────┴──────────────────────────┘
```

**Principi clau:** reutilitzar el mateix component i builder que la web pública. L'empleat ve **exactament** el resultat final mentre escriu.

---

## Seccions del formulari

### § 1 — Difunt

| Camp DB | Control UI | Obligatori | Notes |
|---------|------------|------------|-------|
| `name` | `<input text>` | Sí | Nom complet, es mostra en majúscules a la plantilla |
| `deathPlace` | `<input text>` | Sí | Ex. Berga |
| `deathDay` | `<input text>` | Sí | Ex. «1» o «1 de juliol» — text curt |
| `ageAtDeath` | `<input number>` | Sí | Edat en anys |

**Text generat:** `Morí a {deathPlace} el dia {deathDay} a l'edat de {ageAtDeath} anys`

### § 2 — Funeral

| Camp DB | Control UI | Obligatori | Notes |
|---------|------------|------------|-------|
| `funeralDatetime` | `<input text>` | Sí | Ex. «dimarts dia 3 a les 11:00» |
| `churchId` | `<select>` | Sí | Catàleg `churches` |
| `cemeteryId` | `<select>` | Sí | Catàleg `cemeteries` — enterrament + mapa públic |

**Textos generats:**
- `Enterrament i funeral, {funeralDatetime}`
- `A l'{church.name}`

### § 3 — Vetlla

| Camp DB | Control UI | Obligatori | Notes |
|---------|------------|------------|-------|
| `wakeRoomId` | `<select>` | Sí | Catàleg `wake_rooms` — veure [`requisits-lugares.md`](requisits-lugares.md) |
| `wakeSchedule` | `<input text>` | Sí | Horari d'aquesta esquela — ex. «Dilluns de 17:00 a 19:00» |
| `mortuaryAddress` | `<input text>` | No | Default: `siteConfig.mortuaryDefault`, editable |
| `showEpd` | `<checkbox>` | No | Default `true` — mostrar «E.P.D.» |

**Textos generats:**
- `Casa mortuòria: {mortuaryAddress}`
- `Sales de vetlla: {wakeRoom.name}`
- `{wakeSchedule}` (sagnat, negreta)

### § 4 — Foto

Tres fluxos a la mateixa secció:

| Acció | Descripció |
|-------|------------|
| **Pujar / escanejar** | Upload directe a `imagePath` (versió publicada) |
| **Foto pendent del familiar** | Si `familyImageStatus = pending`, mostrar `customImagePath` + botó «Descarregar per retocar» |
| **Publicar versió retocada** | Després del retoc extern (crop, IA…), pujar resultat a `imagePath` i netejar estat pendent |

Veure [`requisits-obituary.md`](requisits-obituary.md) — secció foto.

### § 5 — Publicació

| Camp DB | Control UI | Notes |
|---------|------------|-------|
| `visitCode` | `<input text>` + botó «Generar» | Codi d'accés familiar |
| `slug` | `<input text>` | Auto-generat des del nom, editable |
| `expedientCode` | `<input text>` | Opcional, ús intern |
| `isActive` | `<toggle>` | Familiar pot accedir amb codi |
| `isVisible` | `<toggle>` | Apareix al llistat públic |
| `isReady` | `<toggle>` | Esquela completa |

---

## Vista prèvia en viu

### Implementació prevista

1. Formulari = **client component** (`esquela-admin-form.tsx`)
2. Estat local amb tots els camps del formulari
3. A cada canvi (`onChange`), cridar `buildEsquelaPrintData()` al client (funció pura, ja existent)
4. Passar resultat a `<EsquelaPrintLayout data={…} />`
5. **No cal desar** per veure la preview — només per publicar

### Dades necessàries al carregar la pàgina (SSR)

- Esquela existent (si edició)
- Llista `churches`, `cemeteries` i `wake_rooms` (CRUD a Fase 5b — [`requisits-lugares.md`](requisits-lugares.md))
- `siteConfig` (defaults: mortuary, wake location, capçalera)
- `funeralHome` (nom marca)
- URL foto actual (`imagePath`) i pendent familiar (`customImagePath`) si aplica

---

## Pestanyes futures (mateixa ruta `/admin/esquelas/[id]`)

| Pestanya | Contingut | Documentació |
|----------|-----------|--------------|
| **Esquela** | Formulari + preview | Aquest document |
| **Flors** | Comandes + dedicatòries | [`requisits-flores-admin.md`](requisits-flores-admin.md) |
| **Missatges** | Textos conmemoratius rebuts | [`requisits-missatges.md`](requisits-missatges.md) |
| **Foto familiar** | Original pendent + historial | [`requisits-obituary.md`](requisits-obituary.md) |

---

## APIs previstes

```
GET    /api/admin/esquelas              → llistat (ja existeix parcialment com a pàgina SSR)
GET    /api/admin/esquelas/[id]         → esquela + context (esglésies, cementiris, siteConfig)
POST   /api/admin/esquelas              → crear esquela
PUT    /api/admin/esquelas/[id]         → actualitzar camps estructurats + publicació
POST   /api/admin/esquelas/[id]/photo   → pujar imagePath (foto retocada / escaneig)
POST   /api/admin/esquelas/[id]/photo/publish-pending
                                        → copiar/custom → imagePath, netejar familyImageStatus
```

Totes les rutes protegides per sessió admin (`admin_session`).

### Validació (Zod)

Esquema mínim al servidor:

```typescript
{
  name: string.min(1),
  deathPlace: string.min(1),
  deathDay: string.min(1),
  ageAtDeath: number.int().positive(),
  funeralDatetime: string.min(1),
  churchId: string.min(1),
  cemeteryId: string.min(1),
  wakeRoomId: string.min(1),
  wakeSchedule: string.min(1),
  mortuaryAddress?: string,
  showEpd?: boolean,
  visitCode: string.min(4),
  slug: string.min(1),
  isActive: boolean,
  isVisible: boolean,
  isReady: boolean,
}
```

---

## Llistat `/admin/esquelas` (millores previstes)

Afegir a la taula actual:

- Enllaç **Editar** → `/admin/esquelas/[id]`
- Botó **Nova esquela** → `/admin/esquelas/nueva`
- Badge foto familiar pendent (ja existeix)

---

## Ordre d'implementació

| Fase | Abast | Prioritat |
|------|-------|-----------|
| **1** | Crear/editar esquela — formulari + preview + `PUT`/`POST` | Alta |
| **2** | Upload foto (`imagePath`) — escaneig / publicació directa | Alta |
| **3** | Foto familiar pendent — veure original, descarregar, publicar retoc | Mitjana |
| **4** | Enllaços des del llistat + generació automàtica `visitCode` / `slug` | Mitjana |
| **5** | Pestanyes flors i missatges (quan existeixin els mòduls) | Baixa |

---

## Què NO fer (decisions explícites)

| Evitar | Motiu |
|--------|-------|
| Editor WYSIWYG del text de l'esquela | Els textos es **generen** des de camps estructurats |
| Crop / IA dins l'app | Retoc extern; aquí només es puja el resultat |
| Camps duplicats (`deathNotice` + `deathPlace`…) | Només estructurats per esquelas noves; fallback legacy només lectura |
| Preview diferent de la pública | Un sol component: `EsquelaPrintLayout` |

---

## Fitxers previstos (implementació futura)

```
src/app/admin/(dashboard)/esquelas/nueva/page.tsx
src/app/admin/(dashboard)/esquelas/[id]/page.tsx
src/components/admin/esquela-admin-form.tsx      ← client, form + preview
src/components/admin/esquela-photo-upload.tsx
src/app/api/admin/esquelas/route.ts
src/app/api/admin/esquelas/[id]/route.ts
src/app/api/admin/esquelas/[id]/photo/route.ts
src/lib/esquela/admin-schema.ts                  ← Zod
```

---

## Estat actual del codi

| Element | Estat |
|---------|-------|
| `EsquelaPrintLayout` | ✅ Implementat |
| `buildEsquelaPrintData()` | ✅ Implementat |
| Camps estructurats a `schema.ts` | ✅ Implementat |
| Seed demo (Ramon / Pujols) | ✅ Implementat |
| Formulari admin crear | ✅ Implementat (`/admin/esquelas/nueva`) |
| Formulari admin editar | ✅ Implementat (`/admin/esquelas/[id]`) |
| APIs admin esquelas | ✅ POST crear + PUT editar + POST photo/reject |
| Upload foto admin | ✅ Implementat (`EsquelaPhotoSection` + `/api/admin/esquelas/[id]/photo`) |
