# Esqueles — crear, publicar i gestionar

**Versió en castellà:** [../esquelas.md](../esquelas.md)

## Per a què serveix

Aquí prepares l'**esquela** de cada difunt: textos, església, cementiri, foto, codi per a la família i publicació a la web.

**Important:** abans de la primera esquela, has de tenir com a mínim **una església, un cementiri i una sala de vetlla** al catàleg. Si no, vegeu [Llocs](./llocs.md).

---

## 1. Veure totes les esqueles

1. Entra al panell ([Accés admin](./acces-admin.md)).
2. Al menú esquerre, prem **«Esquelas»**.
3. Veuràs una **taula** amb columnes: nom, codi, activa, visible, foto familiar, missatges, etc.
4. Per **editar** una esquela, prem sobre el **nom** del difunt.

Al **Dashboard** també veuràs avisos grocs si hi ha **fotos de familiars pendents** o **missatges sense revisar**.

---

## 2. Crear una esquela nova

1. Menú **Esquelas** → botó **«Nova esquela»** (a dalt a la dreta).
2. Omple el formulari de l'**esquerra**. A la **dreta** veus una **vista prèvia** de com quedarà.

### Dades del difunt

| Camp | Què posar (exemple) |
|------|---------------------|
| **Nom complet** | Nom en majúscules: `RAMON SANT TORNER` |
| **Lloc de defunció** | Ciutat: `Berga` |
| **Dia** | Dia del defunció: `1` |
| **Edat** | Edat: `75` |

### Funeral

| Camp | Què posar |
|------|-----------|
| **Data i hora del funeral** | Text lliure: `dimarts dia 3 a les 11:00` |
| **Església** | Tria de la llista desplegable |
| **Cementiri** | Tria de la llista desplegable |

### Vetlla

| Camp | Què posar |
|------|-----------|
| **Sala de vetlla** | Tria de la llista |
| **Horari de vetlla** | Exemple: `Dilluns de 17:00 a 19:00` |
| **Casa mortuòria** | Adreça (sol omplir-se sola amb la de configuració) |
| **Mostrar «E.P.D.»** | Deixa marcat si vols que surti «E.P.D.» a l'esquela |

### Foto (en esquela nova)

- La primera vegada **no pots pujar foto**: primer cal **desar** l'esquela.
- Després de desar, entra un altre cop a editar-la (pas 3).

### Publicació

| Camp | Significat |
|------|------------|
| **Codi d'accés familiar** | Codi que donaràs a la família (8 caràcters). Prem **«Generar»** si en vols un automàtic. **Anota'l** i dona'l al familiar. |
| **Slug URL** | Part de l'adreça web (exemple: `ramon-sant-torner`). Es genera sol del nom; no cal tocar-lo llevat que hi hagi conflicte. |
| **Codi d'expedient** | Opcional, per a ús intern |
| **Activa (familiar pot accedir amb codi)** | ✅ = la família pot entrar amb el codi |
| **Visible al llistat públic** | ✅ = apareix a `/esquelas` i a la home |
| **Esquela completa** | ✅ = marques que ja està acabada (control intern) |

3. Prem **«Desar esquela»** a baix.
4. Tornaràs al llistat. **Entra un altre cop** a l'esquela per pujar la foto.

---

## 3. Pujar o canviar la foto de l'esquela

*(Només en **editar** esquela, secció **§ Foto**)*

### Opció A — Escaneig o foto ja retocada (empleat)

1. A **§ Foto**, prem **«Escollir fitxer»** / **Examinar** i tria la imatge de l'ordinador (JPG, PNG o WebP; màxim 5 MB).
2. Prem **«Pujar foto retocada»**.
3. Veuràs la **foto publicada** en miniatura. Aquesta és la que veuen família i visitants.

### Opció B — Foto enviada pel familiar

Si el familiar ha pujat una foto des de la seva zona privada:

1. Apareix un requadre **groc**: «Foto pendent del familiar».
2. Prem **«Descarregar per retocar»** i obre-la al teu programa de retoc.
3. Retoca la foto **fora** de la web.
4. Puja la versió retocada amb **«Pujar foto retocada»** (com opció A).
5. **Mai** es publica la foto original del familiar sense retocar.

Si la foto no serveix:

- Prem **«Rebutjar foto»**. El familiar podrà enviar-ne una altra.

---

## 4. Missatges conmemoratius (visitants)

Els visitants poden deixar un missatge ** privat** per a la família (no es publica a la web).

1. Obre l'esquela → pestanya **«Missatges»** (a dalt).
2. Llegeix cada missatge (nom + text).
3. Marca **«Revisat»** quan la família ja l'hagi vist o anotat.
4. Pots filtrar només els no revisats.

---

## 5. Comandes de flors d'aquesta esquela

1. Obre l'esquela → pestanya **«Flors»** (a dalt).
2. Veuràs comandes: producte, dedicatòria, comprador, estat.
3. Per veure **totes** les comandes de la funerària: menú **Flors** → enllaç a comandes (vegeu [Flors](./flors.md)).

---

## 6. Com comprovar que l'esquela és a la web

1. Menú **«← Web pública»** (a baix del menú admin).
2. Prem **«Esqueles»** a la web.
3. Si has marcat **Visible**, ha d'aparèixer la targeta del difunt.
4. Prem la targeta: veuràs l'esquela completa, mapes, flors i formulari de missatge.

També pots obrir directament (substitueix l'adreça base):

`https://LA-TEVA-WEB/esquelas/nom-del-slug`

Exemple demo local: `/esquelas/ramon-sant-torner`

---

## 7. Resum ràpid del dia a dia

```
Crear esquela → Desar → Pujar foto retocada
→ Marcar Activa + Visible → Donar codi a la família
→ Revisar foto pendent / missatges al Dashboard
→ Comprovar a web pública
```

---

## Problemes freqüents

| Problema | Solució |
|----------|---------|
| No deixa desar: avís groc de llocs | Crea església, cementiri i sala a [Llocs](./llocs.md) |
| Slug o codi duplicat | Canvia el codi o el slug manualment |
| La família no entra | Comprova que **Activa** estigui marcada i el codi sigui correcte |
| No surt al llistat públic | Marca **Visible al llistat públic** |
| Error en pujar foto | Fes servir JPG/PNG/WebP i menys de 5 MB |

---

## Següent lectura

- [Zona familiar](./zona-familiar.md) — què fa la família amb el codi  
- [Web pública](./web-publica.md) — què veuen els visitants
