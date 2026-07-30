# Web pública — què ve un visitant

**Versió en castellà:** [../web-publica.md](../web-publica.md)

## Per a què serveix aquesta guia

Explica què pot fer **qualsevol persona** que entra a la web **sense** ser empleat ni familiar. Útil per a formació interna i per respondre dubtes de clients.

---

## Pàgina d'inici

**Adreça:** l'arrel del lloc (exemple: `www.pujols.cat`).

El visitant veu:

- Nom i logo de la funerària.
- Titular i textos de serveis (editables a [Contingut home](./contingut-home.md)).
- **Esqueles recents** — targetes de difunts amb esquela **visible**.
- Telèfon i enllaços del peu de pàgina ([Configuració](./configuracio.md)).

Pot canviar idioma **Català / Castellà** a dalt a la dreta.

---

## Llistat d'esqueles

1. Menú → **Esqueles**.
2. Llista de targetes de difunts **visibles**.
3. Prem una targeta → pàgina del difunt.

Només apareixen esqueles amb **Visible** marcat a l'admin ([Esqueles](./esqueles.md)).

---

## Pàgina d'una esquela (detall)

El visitant veu, de dalt a baix:

### 1. Esquela impresa (format formal)

- Nom del difunt, edat, lloc i dia de defunció.
- Data/hora del funeral, església.
- Vetlla, casa mortuòria.
- **E.P.D.** si està activat.
- **Foto** només si l'empleat ha publicat una (retocada).

### 2. Obituari (si n'hi ha)

- Bloc **separat** amb text poètic.
- L'escriu el **familiar** des de la seva zona privada; el visitant només el llegeix.

### 3. Llocs / mapes

- Targetes d'**església** i **cementiri**.
- Botó **«Com arribar (Google Maps)»** → obre Google Maps.

### 4. Compra de flors

- Catàleg amb foto i preu ([Flors](./flors.md)).
- Botó **Comprar** → formulari:
  - Dedicatòria (obligatòria)
  - Nom, email, telèfon del comprador
- Després de confirmar, la comanda arriba a l'admin.

### 5. Missatge conmemoratiu

- Formulari: **nom** + **missatge**.
- **No es publica a la web.**
- El rep la família a la sala de vetlla; l'empleat el revisa a l'admin ([Esqueles](./esqueles.md) → pestanya Missatges).

---

## Sales de vetlla

Menú → **Sales de vetlla**.

- Informació de les sales actives (nom, foto, text).
- Catàleg gestionat a [Llocs](./llocs.md).

---

## Accés familiars (menú)

- Porta a la pantalla de **codi**.
- No és per a visitants generals; vegeu [Zona familiar](./zona-familiar.md).

---

## Què NO pot fer un visitant

- Entrar a l'**admin** (`/admin`) sense usuari i contrasenya d'empleat.
- Veure esqueles **no visibles** (encara que conegui l'adreça, no surten als llistats).
- Publicar missatges a la web (només enviament privat a família).
- Pujar foto a l'esquela pública (només la família envia foto privada; publicació = empleat).

---

## Comprovar que tot funciona (empleat)

| Comprovar | On |
|-----------|-----|
| Home amb textos correctes | `/` |
| Esquela al llistat | `/esquelas` |
| Esquela completa | `/esquelas/[slug]` |
| Flors i missatge | Mateixa pàgina, scroll avall |
| Sales | `/sales-de-vetlla` |
| Accés familiar | `/acceso` + codi |

Des de l'admin: enllaç **«← Web pública»** obre la home en una altra pestanya.

---

## Mapa ràpid

```
Visitant
   │
   ├─ Home ─────────────── textos CMS + esqueles recents
   ├─ Esqueles ─────────── llistat → detall (mapes, flors, missatge)
   ├─ Sales de vetlla ──── catàleg sales
   └─ Accés familiars ── només amb codi (zona privada)

Empleat ──► /admin (panell)

Familiar ──► codi → la meva esquela (foto + obituari)
```

---

## Índex de guies per a empleats

Torna al [README](./README.md) d'aquesta carpeta.
