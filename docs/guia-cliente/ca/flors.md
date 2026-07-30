# Flors — catàleg i comandes

**Versió en castellà:** [../flores.md](../flores.md)

## Per a què serveix

Els **visitants** poden comprar flors des de l'esquela pública d'un difunt. Tu gestiones:

1. **Quines flors es venen** (catàleg).
2. **Quines comandes han entrat** i en quin estat estan.

*(En entorn de prova el pagament pot ser automàtic; en producció anirà amb passarel·la real.)*

---

## Part 1 — Catàleg de productes

### Veure productes

1. Menú → **Flors**.
2. Llistat amb nom, preu i si està **actiu**.

### Crear un producte nou

1. **Flors** → **«Nou producte»** / Nova flor.
2. Omple:
   - **Nom** — Exemple: `Corona clàssica`
   - **Descripció** — Text curt per al visitant.
   - **Preu** — En euros (exemple: `85,00`).
   - **Ordre** — Número per ordenar a pantalla (0, 1, 2…).
   - **Actiu** — ✅ = es mostra a la web; ❌ = ocult però no esborrat.
3. **Foto** — Tria imatge (JPG, PNG o WebP).
4. **Desar**.

### Editar o desactivar

1. Prem el **nom** del producte al llistat.
2. Canvia dades o desmarca **Actiu** per deixar de vendre'l sense esborrar-lo.
3. **Desar**.

---

## Part 2 — Comandes

### Veure totes les comandes

1. Des de **Flors**, busca l'enllaç **«Comandes»** (o menú directe si apareix).
2. Veuràs taula: esquela, producte, dedicatòria, comprador, telèfon, email, **estat**.

### Estats de la comanda

| Estat | Significat |
|-------|------------|
| **Pagat** | Comanda rebuda (pagada) |
| **En preparació** | Floristeria preparant el ram |
| **Lliurat** | Ja lliurat al funeral/vetlla |

Per canviar estat: obre la comanda o fes servir l'acció a la taula (segons pantalla) i tria el nou estat.

### Comandes d'una esquela concreta

1. **Esquelas** → obre l'esquela del difunt.
2. Pestanya **«Flors»** a dalt.
3. Només veus comandes d'**aquest** difunt.

---

## Què veu el visitant

1. Entra a l'esquela pública del difunt.
2. Baixa fins **«Enviament de flors»** / compra de flors.
3. Tria producte → **Comprar** → omple dedicatòria (obligatòria), nom, email i telèfon.
4. Confirma el pagament (segons configuració).

Tu reps la comanda al panell admin.

---

## Què veuràs al final

- Productes **actius** amb foto i preu a cada esquela visible.
- Llistat de **comandes** per preparar i marcar lliuraments.

---

## Problemes freqüents

| Problema | Solució |
|----------|---------|
| No surten flors a l'esquela | Producte ha d'estar **Actiu**; esquela **Visible** |
| Preu incorrecte | Edita el producte (preu en euros amb coma o punt) |
| No arriba comanda | Revisa pestanya Flors d'aquesta esquela i llistat global |

---

## Següent lectura

- [Esqueles](./esqueles.md) — publicar esquela on es compren flors  
- [Web pública](./web-publica.md) — experiència del visitant
