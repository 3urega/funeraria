# Requisitos — pàgina pública de l'esquela

> **Estat:** requisit confirmat, **parcialment implementat** (plantilla impresa + obituari; sense mapes, missatges ni flors).

## Flux del visitant

```
Web pública → Llistat d'esquelas actives (`isVisible = true`)
        ↓
Click en una esquela → `/esquelas/[slug]`
        ↓
Pàgina completa del difunt (sense login)
```

## Contingut de la pàgina

### 1. Esquela impresa

Com es veurà **impresa** — versió final publicada per l'empleat:

- Nom del difunt
- Text de defunció, funeral i sales de vetlla
- Foto retocada (`imagePath`)
- Obituari poètic (si el familiar l'ha personalitzat)

### 2. Llocs de la cerimònia

| Lloc | Dades | Acció |
|------|-------|-------|
| **Missa / funeral** | Església (`church`) | Enllaç a Google Maps |
| **Enterrament** | Cementiri (`cemetery`) | Enllaç a Google Maps |

Camps: nom, ciutat (església), `googleMapsUrl`.

### 3. Missatge conmemoratiu (sala de vetlla)

El visitant pot escriure un text per conmemorar al difunt.

- **Text** del missatge
- **Nom** de qui l'envia
- S'entrega als **familiars a la sala de vetlla** (no es publica a la web)

> Entitat: `commemorative_messages` (abans «Condolence» al legacy)

### 4. Compra de flors

Des de la mateixa pàgina, el visitant compra flors **per aquell difunt concret**.

Cada comanda inclou **obligatòriament** una dedicatòria per la targeta de flors:

> *«De part dels teus cosins… amb amor»*

Veure detall: [`requisits-flores.md`](requisits-flores.md)

---

## Dues accions distintes del visitant

| | **Missatge conmemoratiu** | **Compra de flors** |
|---|---------------------------|---------------------|
| Què és | Text per als familiars a la vetlla | Producte floral + dedicatòria |
| Camps | `senderName` + `messageText` | Producte + `dedicationText` + dades comprador |
| On es lliura | Sala de vetlla (familiars) | Floristeria → lloc del funeral/vetlla |
| Es publica a la web? | No | No (només es veu la comanda al backoffice) |

---

## Backoffice — per difunt

A la fitxa de cada esquela, l'empleat ve:

### Comandes de flors
- Quines flors s'han comprat
- Dedicatòria de cada comanda (*«De part dels teus cosins…»*)
- Dades del comprador
- Estat (pagat, en preparació, lliurat…)
- **Per coordinar amb la floristeria**

### Missatges conmemoratius
- Text del missatge
- Nom de qui l'envia
- Data
- **Per lliurar als familiars a la sala de vetlla**

---

## APIs previstes

```
GET  /esquelas/[slug]              → pàgina (SSR)
POST /api/public/commemorative      → { obituaryId, senderName, messageText }
POST /api/public/flowers/order      → { obituaryId, productId, dedicationText, buyer… }
```

## Implementació (estat actual)

- [x] Esquela impresa a `/esquelas/[slug]` (estructura HTML provisional — no disseny Pujols final)
- [x] Obituari poètic en secció separada (si existeix)
- [x] Mapes Google (església + cementiri) — RD-054 *(#6, jul 2026)*
- [x] Formulari missatge conmemoratiu — RD-055 *(#7, jul 2026)*
- [ ] Catàleg + checkout flors — RD-056
- [ ] Admin catàleg e-commerce: [`requisits-flores-admin.md`](requisits-flores-admin.md)
- [x] Admin: missatges per esquela *(#7)*
