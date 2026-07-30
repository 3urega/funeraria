# Itinerari de demo — sessió amb el client

Guia per fer una **demostració en viu** de la web juntament amb el client (empleats de la funerària). Durada orientativa: **45–60 minuts**.

Documents de suport: [README](./README.md) · guies detallades per mòdul.

**Versió en castellà:** [../itinerario-demo.md](../itinerario-demo.md)

---

## Objectiu de la sessió

En acabar, el client ha de haver vist **de punta a punta**:

1. Com entra un empleat al panell.
2. Com es crea (o revisa) un lloc i una esquela.
3. Com es publica a la web pública.
4. Com accedeix un familiar amb codi.
5. Què ve un visitant (mapes, flors, missatge).

No cal ensenyar **tot** l'admin en una sola sessió; el secundari (CMS home, poemes, catàleg flors) es pot mencionar o deixar per a una segona reunió.

---

## Abans de la reunió (facilitador)

### Checklist tècnic

- [ ] Web accessible (local, staging o producció).
- [ ] Credencials **admin** preparades (no les de demo pública si és entorn real).
- [ ] Una **foto de prova** a l'ordinador (JPG/PNG, &lt; 5 MB) per pujar a l'esquela.
- [ ] Navegador en pantalla gran o projector; tancar pestanyes irrellevants.
- [ ] Provar un cop el flux complet **la vigília** (login → crear esquela → veure a web).

### URLs i credencials (entorn local d'exemple)

| Què | Valor |
|-----|--------|
| Web pública | `http://localhost:3000` |
| Admin | `http://localhost:3000/admin` |
| Admin email | `admin@local.dev` |
| Admin contrasenya | `admin123` |
| Esquela demo existent | `/esquelas/ramon-sant-torner` |
| Codi familiar demo | `DEMO1234` |

En **staging/producció**, substituir per l'URL i credencials reals ([DEPLOY_STAGING.md](../../DEPLOY_STAGING.md)).

### Persona fictícia per a la demo en viu

Crearem una esquela nova per no barrejar amb la demo Ramon:

| Camp | Valor suggerit |
|------|----------------|
| Nom | `MARIA GARCIA SOLER` |
| Lloc defunció | `Gironella` |
| Dia | `15` |
| Edat | `82` |
| Funeral | `dijous dia 18 a les 12:00` |
| Horari vetlla | `Dimecres de 16:00 a 20:00` |
| Codi familiar | `DEMOMAR1` (o prémer **Generar**) |
| Slug | `maria-garcia-soler` (s'autogenera) |

---

## Guió per al facilitador (què dir)

Fes frases curtes. Para després de cada bloc per preguntar: *«Us encaixa així?»* / *«Ho veieu clar?»*

---

### Bloc 0 — Benvinguda (3 min)

**Dir:**  
«Avui recorrerem la web com la veurien tres persones diferents: el visitant del carrer, l'empleat de la funerària i la família del difunt. Al final haurem creat una esquela de prova i la veurem publicada.»

**Mostrar:** home pública (`/`).

**Assenyalar:** logo, telèfon, bloc d'esqueles recents, menú (Esqueles, Sales de vetlla, Accés familiars).

**Opcional:** canviar idioma Català / Castellà.

→ Guia: [Web pública](./web-publica.md)

---

### Bloc 1 — Visitant: esquela ja publicada (5 min)

**Dir:**  
«Aquesta esquela ja és al sistema de demo. Així la veu qualsevol persona sense contrasenya.»

1. Menú → **Esqueles**.
2. Obrir **Ramon Sant Torner** (o la que existeixi).
3. Baixar a poc a poc: esquela impresa → mapes → flors → missatge conmemoratiu.

**Explicar:**

- L'esquela formal la prepareu vosaltres; l'obituari poètic el pot escriure la família.
- Els missatges **no es publiquen** a internet; arriben a l'empleat per a la família.
- Les flors es demanen des d'aquí (catàleg ja carregat a la demo).

**No fer** compra real ni enviar missatge si no voleu dades brossa a la BD (o fer-ho com a demo i esborrar-ho després).

→ Guies: [Web pública](./web-publica.md) · [Flors](./flors.md)

---

### Bloc 2 — Entrar a l'admin (3 min)

**Dir:**  
«Ara canviem de rol: entrem al panell privat, només per a empleats.»

1. Obrir **`/admin`** a la mateixa finestra o pestanya nova.
2. Email + contrasenya → **Entrar**.
3. Mostrar **Dashboard**: total esqueles, actives, públiques; avisos grocs (fotos / missatges pendents).

**Dir:**  
«Des d'aquí veieu d'un cop d'ull si hi ha fotos de familiars per retocar o missatges sense revisar.»

→ Guia: [Accés admin](./acces-admin.md)

---

### Bloc 3 — Llocs: catàleg (5 min)

**Dir:**  
«Abans de crear una esquela, cal tenir esglésies, cementiris i sales de vetlla al catàleg. A la demo ja n'hi ha; en producció els donareu d'alta un cop.»

1. Menú → **Esglésies** → mostrar llistat existent.
2. **Opció A (ràpida):** només ensenyar un registre ja creat.
3. **Opció B (completa):** **Nova església** → nom fictici `Església de Sant Pere (prova)` → ciutat + adreça → **Desar**.

Repetir menció de **Cementiris** i **Sales de vetlla** (no cal crear els tres si vaeu de pressa).

**Dir:**  
«Quan ompliu una esquela, només trieu de llistes; no escriviu l'adreça del cementiri cada vegada.»

→ Guia: [Llocs](./llocs.md)

---

### Bloc 4 — Crear esquela nova (10 min)

**Dir:**  
«Aquest és el flux del dia a dia: una esquela nova per a la persona fictícia Maria Garcia.»

1. Menú → **Esquelas** → **Nova esquela**.
2. Omplir camps amb la taula de [Persona fictícia](#persona-fictícia-per-a-la-demo-en-viu) (difunt, funeral, vetlla).
3. Triar església, cementiri i sala dels desplegables.
4. Secció **Publicació**:
   - Codi familiar: `DEMOMAR1` o **Generar**.
   - Marcar **Activa**, **Visible al llistat públic**, **Esquela completa**.
5. Mostrar **vista prèvia** a la dreta mentre escriviu.
6. **Desar esquela** → torna al llistat.

**Dir:**  
«La primera vegada no es pot pujar foto fins desar. Entrem un altre cop a editar.»

7. Clic a **MARIA GARCIA SOLER** → secció **§ Foto**.
8. Triar arxiu → **Pujar foto retocada**.
9. Confirmar que la miniatura apareix i la preview s'actualitza.

→ Guia: [Esqueles](./esqueles.md)

---

### Bloc 5 — Comprovar publicació (5 min)

**Dir:**  
«Anem a la web pública com si fóssim un veí que busca l'esquela.»

1. Menú admin → **← Web pública** (o obrir `/` en pestanya d'incògnit).
2. **Esqueles** → buscar targeta **Maria Garcia Soler**.
3. Entrar → comprovar foto, textos, mapes.

**Si no apareix:** tornar a l'admin i revisar casella **Visible**.

**Dir:**  
«Quan desmarqueu Visible, l'esquela deixa de sortir al llistat però l'enllaç directe pot seguir funcionant; en producció ho acordem amb vosaltres.»

→ Guia: [Web pública](./web-publica.md)

---

### Bloc 6 — Zona familiar (8 min)

**Dir:**  
«La família no entra a l'admin. Només té un codi que vosaltres li dieu.»

1. Pestanya d'incògnit o un altre navegador (simula mòbil de familiar).
2. Anar a **Accés familiars** (`/acceso`).
3. Codi `DEMOMAR1` → Entrar.
4. Mostrar **La meva esquela**: esquela + secció foto + obituari.

**Demo opcional — foto familiar:**

5. Pujar una foto de prova des de la zona familiar.
6. Tornar a l'**admin** → editar esquela → requadre groc **Foto pendent del familiar**.
7. Explicar flux: descarregar → retocar → **Pujar foto retocada** (no cal completar-ho a la reunió).

**Demo opcional — obituari:**

8. Triar un poema o escriure text → desar.
9. Refrescar esquela pública i mostrar bloc obituari.

→ Guia: [Zona familiar](./zona-familiar.md) · [Poemes](./poemes.md)

---

### Bloc 7 — Missatges i flors (5 min, opcional)

**Missatge (visitant):**

1. A l'esquela pública de Maria, formulari **Deixa un record**.
2. Enviar missatge de prova.
3. Admin → esquela → pestanya **Missatges** → marcar **Revisat**.

**Flors:**

1. Mencionar catàleg al menú **Flors** (productes ja a la demo).
2. Si hi ha temps: **Comprar** una flor a l'esquela (entorn demo = pagament simulat).
3. Admin → pestanya **Flors** de l'esquela o **Comandes**.

→ Guies: [Flors](./flors.md) · [Esqueles](./esqueles.md)

---

### Bloc 8 — Configuració i home (5 min, opcional)

**Dir:**  
«Això no ho canvieu cada dia, però convé saber que existeix.»

1. **Configuració** → telèfon, email, logo (només mostrar, no canviar a la demo amb client).
2. **Contingut home** → una secció (Hero) → explicar textos CA/ES.

→ Guies: [Configuració](./configuracio.md) · [Contingut home](./contingut-home.md)

---

### Bloc 9 — Tancament i feedback (5 min)

**Repassar amb el client:**

| Pregunta | Anotar resposta |
|----------|-----------------|
| ¿La home encaixa visualment amb el acordat? (RD-050) | |
| ¿El flux d'esquela és clar per al dia a dia? | |
| ¿Falta alguna dada o text a la plantilla? | |
| ¿Qui de l'equip usarà l'admin habitualment? | |
| ¿Quan voleu URL de staging per validar sols? | |

**Dir:**  
«Us deixem aquestes guies per escrit i, quan tingueu l'URL de prova a internet, repetiu el mateix recorregut al vostre ritme.»

**Lliurar:** enllaç a `docs/guia-cliente/` o PDF imprès si el prepareu.

---

## Resum visual del recorregut

```
[Visitant] Home → Esquela Ramon (demo existent)
     ↓
[Empleat] Admin login → Dashboard
     ↓
[Llocs] Esglésies (veure o crear) — mencionar cementiri + sala
     ↓
[Esquela] Nova esquela (Maria) → Desar → Foto → Activa + Visible
     ↓
[Visitant] Esqueles → Maria publicada
     ↓
[Familiar] Accés + codi DEMOMAR1 → foto / obituari (opcional)
     ↓
[Empleat] Missatges / Flors (opcional)
     ↓
[Tancament] Feedback + propers passos (staging, domini, formació)
```

---

## Pla B — si alguna cosa falla a la reunió

| Problema | Què fer en viu |
|----------|----------------|
| No carrega la web | Mostrar captures o repetir en local; ajornar demo tècnica |
| Error en crear esquela (llocs) | Fer servir esquela Ramon ja existent pels blocs 5–6 |
| Foto no puja | Continuar sense foto; explicar que en producció es revisa mida/format |
| Client perdut | Aturar i preguntar quina part els importa més (esquela vs familiar vs flors) |

---

## Segona sessió (si cal)

Temes per a una altra cita de 30 min:

- Editar textos de la **home** (validació RD-050 amb mockup).
- Gestionar **comandes de flors** i estats.
- **Poemes** i catàleg de flors propi del client.
- Esborrar esquela / lloc de prova creats a la demo.

---

## Neteja post-demo (facilitador)

Si la demo va ser en entorn compartit:

- [ ] Esborrar esquela **Maria Garcia Soler** (o marcar no visible).
- [ ] Esborrar església de prova si es va crear.
- [ ] Eliminar missatges/comandes de prova.

En local: `npm run db:reset` només si el client no necessita conservar dades.
