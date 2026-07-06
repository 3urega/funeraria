# Catálogo de lugares — esglésies, cementiris, sales de vetlla

> **Estat:** requisit confirmat. CRUD admin implementat per esglésies, cementiris i sales de vetlla, amb geolocalització Google Places al backoffice.

## Per què cal

En crear una esquela des del backoffice, l'empleat **assigna tres llocs** des de catàlegs predefinits — no escriu noms a mà:

| Lloc | Ús a l'esquela | Ús a la web pública |
|------|----------------|---------------------|
| **Església** | Funeral / missa | Enllaç Google Maps |
| **Cementiri** | Enterrament | Enllaç Google Maps |
| **Sala de vetlla** | Horaris de vetlla | Enllaç Google Maps (opcional) |

Sense aquest catàleg, cada esquela seria text lliure i inconsistent.

---

## Entitats

### `churches` (esglésies)

| Camp | Descripció |
|------|------------|
| `id`, `funeralHomeId` | Identificadors |
| `name` | Ex. «Església Parroquial de Gironella» |
| `city` | Ex. Gironella (auto des de geocoding) |
| `address` | Adreça formatada |
| `latitude`, `longitude` | Coordenades WGS84 |
| `googlePlaceId` | ID Google Places (per re-geocodificar) |
| `googleMapsUrl` | Enllaç per visitants |
| `imagePath` | Foto opcional (pàgina pública) |

### `cemeteries` (cementiris)

| Camp | Descripció |
|------|------------|
| `id`, `funeralHomeId` | Identificadors |
| `name` | Ex. «Cementiri de Gironella» |
| `city` | Ex. Gironella (auto des de geocoding) |
| `address` | Adreça formatada |
| `latitude`, `longitude` | Coordenades WGS84 |
| `googlePlaceId` | ID Google Places |
| `googleMapsUrl` | Enllaç per visitants |
| `imagePath` | Foto opcional |

### `wake_rooms` (sales de vetlla)

| Camp | Descripció |
|------|------------|
| `id`, `funeralHomeId` | Identificadors |
| `name` | Nom de la sala — **obligatori** |
| `description` | Text descriptiu per a la web pública |
| `imagePath` | Foto de la sala |
| `address` | Adreça (opcional) |
| `latitude`, `longitude` | Coordenades WGS84 |
| `googlePlaceId` | ID Google Places |
| `googleMapsUrl` | Enllaç Google Maps (opcional) |
| `isActive` | Si és activa: visible a la web pública i assignable a esquelas |

---

## Geolocalització (Google Places)

Al crear/editar un lloc, l'empleat escriu l'adreça i tria un resultat del cercador. El sistema omple automàticament:

- `address`, `city` (esglésies i cementiris)
- `latitude`, `longitude`, `googlePlaceId`
- `googleMapsUrl`

**Implementació:**

- Mòdul servidor: `src/lib/geo/google-places.ts`
- Component admin: `src/components/admin/place-address-field.tsx`
- APIs proxy (clau només servidor): `/api/admin/places/autocomplete`, `/api/admin/places/details`
- Variable d'entorn: `GOOGLE_MAPS_API_KEY` (Places API New activada)

Si la clau no està configurada, el formulari permet omplir adreça i URL de Maps manualment.

---

## Web pública — `/sales-de-vetlla`

Les sales **actives** es mostren en un llistat amb:

- Foto
- Nom
- Text descriptiu
- Adreça + enllaç Google Maps (si n'hi ha)

Implementat: `WakeRoomCard`, pàgina `(public)/sales-de-vetlla`.

---

## Backoffice — CRUD sales de vetlla

**Ruta:** `/admin/lugares/salas-vetlla`

| Acció | Ruta |
|-------|------|
| Llistar | `/admin/lugares/salas-vetlla` |
| Crear | `/admin/lugares/salas-vetlla/nueva` |
| Editar | `/admin/lugares/salas-vetlla/[id]` |

Formulari: **nom**, **text**, **foto**, ubicació (geoloc Google), actiu/inactiu.

APIs: `/api/admin/wake-rooms`, `/api/admin/wake-rooms/[id]`, `/api/admin/wake-rooms/[id]/photo`.

---

## Backoffice — CRUD esglésies

**Ruta:** `/admin/lugares/iglesias`

| Acció | Ruta |
|-------|------|
| Llistar | `/admin/lugares/iglesias` |
| Crear | `/admin/lugares/iglesias/nueva` |
| Editar | `/admin/lugares/iglesias/[id]` |

Formulari: **nom**, **ubicació + geoloc**, **foto**.

APIs: `/api/admin/churches`, `/api/admin/churches/[id]`, `/api/admin/churches/[id]/photo`.

---

## Backoffice — CRUD cementiris

**Ruta:** `/admin/lugares/cementerios`

| Acció | Ruta |
|-------|------|
| Llistar | `/admin/lugares/cementerios` |
| Crear | `/admin/lugares/cementerios/nueva` |
| Editar | `/admin/lugares/cementerios/[id]` |

Formulari: **nom**, **ubicació + geoloc**, **foto**.

APIs: `/api/admin/cemeteries`, `/api/admin/cemeteries/[id]`, `/api/admin/cemeteries/[id]/photo`.

---

## Formulari esquela (pendent)

| Camp esquela | Referència | Obligatori al formulari |
|--------------|------------|-------------------------|
| `churchId` | → `churches.id` | Sí |
| `cemeteryId` | → `cemeteries.id` | Sí |
| `wakeRoomId` | → `wake_rooms.id` | Sí |
| `wakeSchedule` | Text lliure | Sí — horari específic d'aquesta esquela |

**Horari de vetlla** (`wakeSchedule`) segueix sent text per esquela — ex. «Dilluns de 17:00 a 19:00» — perquè canvia segons el difunt. El **lloc** ve del catàleg.

**Text generat a la plantilla:**
- `Sales de vetlla: {wakeRoom.name}`
- `{wakeSchedule}`

> `wakeLocation` (text lliure) queda com a **fallback legacy**; esquelas noves usen `wakeRoomId`.

---

## Backoffice — CRUD

### Rutes previstes

```
/admin/lugares                    → hub o llistat
/admin/lugares/iglesias           → CRUD esglésies
/admin/lugares/cementerios        → CRUD cementiris
/admin/lugares/salas-vetlla       → CRUD sales de vetlla
```

### Operacions per entitat

- Llistar (taula amb nom, ciutat/adreça, actiu)
- Crear / editar (formulari)
- Pujar foto opcional
- Desactivar (preferible a esborrar si té esquelas vinculades)

### Formulari esquela — selectors

Al crear/editar esquela (`requisits-esquela-admin-form.md`):

```
§ Funeral
  churchId     → <select churches>
  cemeteryId   → <select cemeteries>   (obligatori)

§ Vetlla
  wakeRoomId   → <select wake_rooms>  (obligatori)
  wakeSchedule → <input text>         (horari d'aquesta esquela)
```

**Prerrequisit:** RD-067, RD-068, RD-069 (CRUD llocs) abans de RD-073 (formulari esquela).

---

## APIs previstes

```
GET/POST       /api/admin/churches
GET/PUT/DELETE /api/admin/churches/[id]
POST           /api/admin/churches/[id]/photo

GET/POST       /api/admin/cemeteries
GET/PUT/DELETE /api/admin/cemeteries/[id]
POST           /api/admin/cemeteries/[id]/photo

GET            /api/admin/places/autocomplete
GET            /api/admin/places/details

GET/POST       /api/admin/wake-rooms
GET/PUT/DELETE /api/admin/wake-rooms/[id]
POST           /api/admin/wake-rooms/[id]/photo
```

---

## Seed demo (previst)

- Església Parroquial de Gironella
- Cementiri de Gironella (o Montjuïc → actualitzar)
- Sala de vetlla: Funerària Pujols

---

## Implementació

- [x] Schema `churches` + `cemeteries`
- [x] Schema `wake_rooms` + `obituaries.wakeRoomId` + `description`
- [x] CRUD admin sales de vetlla + upload foto
- [x] Pàgina pública `/sales-de-vetlla`
- [x] CRUD admin esglésies + geoloc Google
- [x] CRUD admin cementiris + geoloc Google
- [ ] Selectors al formulari esquela
