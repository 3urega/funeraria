# Requisitos legacy — esquela vs obituario

> **Actualizado** según aclaración de dominio (2026).

## Dos conceptos distintos

| | **Esquela** | **Obituario** |
|---|-------------|---------------|
| Qué es | Avís de defunció formal | Homenatge poètic |
| Qui crea el text | Empleat (backoffice) | Familiar (poema/text) |
| Foto | Sí — digital o en paper; l'empleat retoca i publica | No |
| Exemple | «Ha mort a Berga el dia 1 als 71 anys…» | Poema del catàleg + dedicatòria |

## Esquela — camps (admin)

### Plantilla impresa

Veure [`requisits-esquela-plantilla.md`](requisits-esquela-plantilla.md) — patró visual Funerària Pujols.

### Camps estructurats (generació automàtica)

- `name` — nom del difunt
- `deathPlace`, `deathDay`, `ageAtDeath` — «Morí a Berga el dia 1 a l'edat de 75 anys»
- `funeralDatetime` + `churchId` — funeral i església
- `cemeteryId` — cementiri (mapa públic)
- `wakeRoomId` + `wakeSchedule` — sala de vetlla i horari
- `showEpd` — mostrar E.P.D. (default true)
- `imagePath` — foto publicada

### Fallback (text lliure)

- `deathNotice`, `funeralDetails`, `wakeDetails` — compatibilitat amb dades antigues

## Foto de l'esquela — dues vies, sempre retocada per l'empleat

La foto **mai** es publica tal com arriba. L'empleat la retoca (retall, mida, ajustos, IA…) i puja la versió final a `imagePath`.

### Via A — Familiar envia digitalment (web)

1. Familiar puja foto → `customImagePath` + `familyImageStatus = pending`
2. L'esquela pública segueix amb `imagePath` anterior (si n'hi ha)
3. L'empleat descarrega, retoca i publica a `imagePath`
4. Neteja l'estat pendent

### Via B — Familiar porta foto en paper

1. El familiar porta la foto físicament a la funerària
2. L'empleat l'escaneja (o fa foto) des del backoffice
3. Retoca i publica directament a `imagePath`
4. No passa per `customImagePath` — el backoffice és l'origen

| Camp | Descripció |
|------|------------|
| `imagePath` | Foto retocada i publicada (origen: escaneig admin o retoc de foto digital) |
| `customImagePath` | Només via A: original digital enviat pel familiar |
| `familyImageStatus` | Només via A: `pending` \| `rejected` \| `null` |

Si la foto digital no serveix com a base → `rejected` (el familiar pot enviar-ne una altra o portar-la en paper).

## Obituario — camps (familiar)

- `obituarioPoemTemplateId` — poema triat del catàleg
- `obituarioText` — text personalitzat
- Es pot combinar poema + text

## APIs

- `POST /api/family/esquela` — envia foto de referència (no es publica directament)
- `POST /api/family/obituario` — poema + text

## Pendiente del legacy original

- `poemImage` (imatge associada al poema)
- UI admin per escanejar/pujar foto i publicar versió retocada
- Formulari admin esquela — veure [`requisits-esquela-admin-form.md`](requisits-esquela-admin-form.md)

## Veure també

- [`requisits-esquela-plantilla.md`](requisits-esquela-plantilla.md) — plantilla visual impresa
- [`requisits-lugares.md`](requisits-lugares.md) — catàleg iglesias, cementerios, salas vetlla
- [`requisits-esquela-admin-form.md`](requisits-esquela-admin-form.md) — formulari backoffice (pendent)
- [`requisits-esquela-publica.md`](requisits-esquela-publica.md) — pàgina pública completa
- [`requisits-missatges.md`](requisits-missatges.md) — missatges conmemoratius (abans Condolence)
- [`requisits-flores.md`](requisits-flores.md) — compra de flors
