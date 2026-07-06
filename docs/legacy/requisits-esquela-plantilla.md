# Plantilla d'esquela — patró visual (Funerària Pujols)

> Referència: [`2020025.jpg`](2020025.jpg)  
> Component web: `src/components/esquela/esquela-print-layout.tsx`

## Objectiu

La web ha de mostrar l'esquela **tal com es veurà impresa**. L'empleat la genera des del backoffice omplint camps estructurats; el sistema renderitza la plantilla fixa.

---

## Layout (3 zones)

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPÇALERA                                                      │
│  funerària PUJOLS          C/. Roser, 22 08680 GIRONELLA       │
│  (marca, vermell)          Telèfon / email / web (gris, dreta) │
├──────────────────┬──────────────────────────────────────────────┤
│                  │  RAMON SANT TORNER                           │
│                  │  Morí a Berga el dia 1 a l'edat de 75 anys   │
│   [ FOTO ]       │              E.P.D.                          │
│   vertical       │  Enterrament i funeral, dimarts dia 3…       │
│   vora fina      │  A l'Església Parroquial de Gironella      │
│                  │  Casa mortuòria: Ctra. de Bassacs, 40        │
│                  │  Sales de vetlla: Funerària Pujols         │
│                  │      Dilluns de 17:00 a 19:00              │
└──────────────────┴──────────────────────────────────────────────┘
```

| Zona | Contingut | Origen dades |
|------|-----------|--------------|
| **Capçalera esquerra** | Nom comercial funerària | `funeralHomes.name` o `siteConfig.brandName` |
| **Capçalera dreta** | Adreça, telèfon, email, web | `siteConfig.contact` |
| **Foto** | Retrat vertical | `obituaries.imagePath` |
| **Nom** | Nom complet del difunt | `obituaries.name` |
| **Defunció** | Lloc, dia, edat | Camps estructurats o `deathNotice` |
| **E.P.D.** | Text fix | Configurable (`showEpd`, per defecte sí) |
| **Funeral** | Data/hora + església | `funeralDatetime` + `churches.name` |
| **Vetlla** | Lloc + horari | `wakeRoomId` + `wakeSchedule` |
| **Casa mortuòria** | Adreça | `mortuaryAddress` o default de `siteConfig` |

---

## Camps estructurats (backoffice)

### Per esquela (`obituaries`)

| Camp | Exemple | Obligatori |
|------|---------|------------|
| `name` | RAMON SANT TORNER | Sí |
| `deathPlace` | Berga | Sí |
| `deathDay` | 1 | Sí |
| `ageAtDeath` | 75 | Sí |
| `funeralDatetime` | dimarts dia 3 a les 11:00 | Sí |
| `wakeRoomId` | → Sala de vetlla | Sí |
| `wakeSchedule` | Horari vetlla (text per esquela) | Sí |
| `churchId` | → Església Parroquial de Gironella | Sí |
| `cemeteryId` | → Cementiri | Sí |
| `mortuaryAddress` | Ctra. de Bassacs, 40 | No |
| `imagePath` | Foto retocada | No |
| `showEpd` | true | No (default true) |

### Textos generats automàticament

```
deathLine     = "Morí a {deathPlace} el dia {deathDay} a l'edat de {ageAtDeath} anys"
funeralLine1  = "Enterrament i funeral, {funeralDatetime}"
funeralLine2  = "A l'{church.name}"   // església en negreta
mortuaryLine  = "Casa mortuòria: {mortuaryAddress}"
wakeLine1     = "Sales de vetlla: {wakeRoom.name}"
wakeLine2     = "{wakeSchedule}"      // negreta, sagnat
```

### Fallback (compatibilitat)

Si no hi ha camps estructurats, es mostren els blocs de text lliure antics:

- `deathNotice`, `funeralDetails`, `wakeDetails`

---

## Estil visual

| Element | Estil |
|---------|-------|
| Fons | Blanc |
| Marca funerària | Sans-serif, negreta, color primari (vermell `#C41E3A` o `theme.primary`) |
| Contacte capçalera | Sans-serif, petit, gris `#666`, alineat a la dreta |
| Cos del text | Serif (Georgia), negre |
| Nom difunt | Serif, negreta, majúscules, gran |
| Línies clau | Negreta (funeral, església, horari vetlla) |
| E.P.D. | Centrat dins la columna de text |
| Horari vetlla | Sagnat (`padding-left`) respecte la línia anterior |
| Foto | Retrat vertical, vora fina grisa |

---

## Backoffice — formulari de generació

Especificació completa: [`requisits-esquela-admin-form.md`](requisits-esquela-admin-form.md)

Resum:
1. Pantalla `/admin/esquelas/[id]` — formulari + vista prèvia en viu
2. Camps estructurats → textos generats automàticament
3. Upload foto / gestió foto familiar pendent
4. Pestanyes futures: flors, missatges

*(Formulari admin: documentat, pendent d'implementació.)*

---

## Relació amb la pàgina pública

A `/esquelas/[slug]`:

- Es mostra `EsquelaPrintLayout` (aquesta plantilla)
- A sota: mapes Google (església + cementiri), missatges, flors

L'obituari poètic **no forma part** de l'esquela impresa — va en secció separada.

---

## Fitxers

| Fitxer | Rol |
|--------|-----|
| `src/lib/esquela/build-esquela-print-data.ts` | Camps DB → props plantilla |
| `src/components/esquela/esquela-print-layout.tsx` | Render HTML/CSS |
| `src/components/family/esquela-view.tsx` | Wrapper que usa la plantilla |
