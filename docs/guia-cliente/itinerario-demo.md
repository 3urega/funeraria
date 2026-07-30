# Itinerario de demo — sesión con el cliente

Guía para hacer una **demostración en vivo** de la web junto con el cliente (empleados de la funeraria). Duración orientativa: **45–60 minutos**.

Documentos de apoyo: [README](./README.md) · guías detalladas por módulo.

**Versión en catalán:** [ca/itinerari-demo.md](./ca/itinerari-demo.md)

---

## Objetivo de la sesión

Al terminar, el cliente debe haber visto **de punta a punta**:

1. Cómo entra un empleado al panel.
2. Cómo se crea (o revisa) un lugar y una esquela.
3. Cómo se publica en la web pública.
4. Cómo accede un familiar con código.
5. Qué ve un visitante (mapas, flores, mensaje).

No hace falta enseñar **todo** el admin en una sola sesión; lo secundario (CMS home, poemas, catálogo flores) se puede mencionar o dejar para una segunda reunión.

---

## Antes de la reunión (facilitador)

### Checklist técnico

- [ ] Web accesible (local, staging o producción).
- [ ] Credenciales **admin** preparadas (no las de demo pública si es entorno real).
- [ ] Una **foto de prueba** en el ordenador (JPG/PNG, &lt; 5 MB) para subir a la esquela.
- [ ] Navegador en pantalla grande o proyector; cerrar pestañas irrelevantes.
- [ ] Probar una vez el flujo completo **la víspera** (login → crear esquela → ver en web).

### URLs y credenciales (entorno local de ejemplo)

| Qué | Valor |
|-----|--------|
| Web pública | `http://localhost:3000` |
| Admin | `http://localhost:3000/admin` |
| Admin email | `admin@local.dev` |
| Admin contraseña | `admin123` |
| Esquela demo existente | `/esquelas/ramon-sant-torner` |
| Código familiar demo | `DEMO1234` |

En **staging/producción**, sustituir por la URL y credenciales reales ([DEPLOY_STAGING.md](../DEPLOY_STAGING.md)).

### Persona ficticia para la demo en vivo

Crearemos una esquela nueva para no mezclar con la demo Ramon:

| Campo | Valor sugerido |
|-------|----------------|
| Nombre | `MARIA GARCIA SOLER` |
| Lugar defunción | `Gironella` |
| Día | `15` |
| Edad | `82` |
| Funeral | `dijous dia 18 a les 12:00` |
| Horario vetlla | `Dimecres de 16:00 a 20:00` |
| Código familiar | `DEMOMAR1` (o pulsar **Generar**) |
| Slug | `maria-garcia-soler` (se autogenera) |

---

## Guion para el facilitador (qué decir)

Usa frases cortas. Pausa después de cada bloque para preguntar: *«¿Os encaja así?»* / *«¿Lo veis claro?»*

---

### Bloque 0 — Bienvenida (3 min)

**Decir:**  
«Hoy vamos a recorrer la web como la verían tres personas distintas: el visitante de la calle, el empleado de la funeraria y la familia del difunto. Al final habremos creado una esquela de prueba y la veremos publicada.»

**Mostrar:** home pública (`/`).

**Señalar:** logo, teléfono, bloque de esquelas recientes, menú (Esquelas, Sales de vetlla, Acceso familiares).

**Opcional:** cambiar idioma Català / Castellà.

→ Guía: [Web pública](./web-publica.md)

---

### Bloque 1 — Visitante: esquela ya publicada (5 min)

**Decir:**  
«Esta esquela ya está en el sistema de demo. Así la ve cualquier persona sin contraseña.»

1. Menú → **Esquelas**.
2. Abrir **Ramon Sant Torner** (o la que exista).
3. Bajar despacio: esquela impresa → mapas → flores → mensaje conmemorativo.

**Explicar:**

- La esquela formal la preparáis vosotros; el obituario poético lo puede escribir la familia.
- Los mensajes **no se publican** en internet; llegan al empleado para la familia.
- Las flores se piden desde aquí (catálogo ya cargado en demo).

**No hacer** compra real ni enviar mensaje si no queréis datos basura en la BD (o hacerlo como demo y borrarlo después).

→ Guías: [Web pública](./web-publica.md) · [Flores](./flores.md)

---

### Bloque 2 — Entrar al admin (3 min)

**Decir:**  
«Ahora cambiamos de rol: entramos en el panel privado, solo para empleados.»

1. Abrir **`/admin`** en la misma ventana o pestaña nueva.
2. Email + contraseña → **Entrar**.
3. Mostrar **Dashboard**: total esquelas, activas, públicas; avisos amarillos (fotos / mensajes pendientes).

**Decir:**  
«Desde aquí veis de un vistazo si hay fotos de familiares por retocar o mensajes sin revisar.»

→ Guía: [Acceso admin](./acceso-admin.md)

---

### Bloque 3 — Lugares: catálogo (5 min)

**Decir:**  
«Antes de crear una esquela, hace falta tener iglesias, cementerios y salas de vetlla en el catálogo. En demo ya hay algunos; en producción los daréis de alta una vez.»

1. Menú → **Esglésies** → mostrar listado existente.
2. **Opción A (rápida):** solo enseñar un registro ya creado.
3. **Opción B (completa):** **Nova església** → nombre ficticio `Església de Sant Pere (prova)` → ciudad + dirección → **Desar**.

Repetir mención de **Cementiris** y **Sales de vetlla** (no hace falta crear los tres si hay prisa).

**Decir:**  
«Cuando rellenéis una esquela, solo elegís de listas; no escribís la dirección del cementerio cada vez.»

→ Guía: [Lugares](./lugares.md)

---

### Bloque 4 — Crear esquela nueva (10 min)

**Decir:**  
«Este es el flujo del día a día: una esquela nueva para la persona ficticia Maria Garcia.»

1. Menú → **Esquelas** → **Nova esquela**.
2. Rellenar campos con la tabla de [Persona ficticia](#persona-ficticia-para-la-demo-en-vivo) (difunto, funeral, vetlla).
3. Elegir iglesia, cementerio y sala de los desplegables.
4. Sección **Publicació**:
   - Código familiar: `DEMOMAR1` o **Generar**.
   - Marcar **Activa**, **Visible al llistat públic**, **Esquela completa**.
5. Mostrar **vista previa** a la derecha mientras escribís.
6. **Desar esquela** → vuelve al listado.

**Decir:**  
«La primera vez no se puede subir foto hasta guardar. Entramos otra vez a editar.»

7. Clic en **MARIA GARCIA SOLER** → sección **§ Foto**.
8. Elegir archivo → **Pujar foto retocada**.
9. Confirmar que la miniatura aparece y la preview se actualiza.

→ Guía: [Esquelas](./esquelas.md)

---

### Bloque 5 — Comprobar publicación (5 min)

**Decir:**  
«Vamos a la web pública como si fuéramos un vecino que busca la esquela.»

1. Menú admin → **← Web pública** (o abrir `/` en pestaña incógnito).
2. **Esquelas** → buscar tarjeta **Maria Garcia Soler**.
3. Entrar → comprobar foto, textos, mapas.

**Si no aparece:** volver al admin y revisar casilla **Visible**.

**Decir:**  
«Cuando desmarcáis Visible, la esquela deja de salir en el listado pero el enlace directo puede seguir funcionando; en producción lo acordamos con vosotros.»

→ Guía: [Web pública](./web-publica.md)

---

### Bloque 6 — Zona familiar (8 min)

**Decir:**  
«La familia no entra al admin. Solo tiene un código que vosotros le dais.»

1. Pestaña incógnito o otro navegador (simula móvil de familiar).
2. Ir a **Acceso familiares** (`/acceso`).
3. Código `DEMOMAR1` → Entrar.
4. Mostrar **La meva esquela**: esquela + sección foto + obituario.

**Demo opcional — foto familiar:**

5. Subir una foto de prueba desde la zona familiar.
6. Volver al **admin** → editar esquela → recuadro amarillo **Foto pendent del familiar**.
7. Explicar flujo: descargar → retocar → **Pujar foto retocada** (no hace falta completarlo en la reunión).

**Demo opcional — obituario:**

8. Elegir un poema o escribir texto → guardar.
9. Refrescar esquela pública y mostrar bloque obituario.

→ Guía: [Zona familiar](./zona-familiar.md) · [Poemas](./poemas.md)

---

### Bloque 7 — Mensajes y flores (5 min, opcional)

**Mensaje (visitante):**

1. En esquela pública de Maria, formulario **Deixa un record**.
2. Enviar mensaje de prueba.
3. Admin → esquela → pestaña **Missatges** → marcar **Revisat**.

**Flores:**

1. Mencionar catálogo en menú **Flors** (productos ya en demo).
2. Si hay tiempo: **Comprar** una flor en la esquela (entorno demo = pago simulado).
3. Admin → pestaña **Flors** de la esquela o **Comandes**.

→ Guías: [Flores](./flores.md) · [Esquelas](./esquelas.md)

---

### Bloque 8 — Configuración y home (5 min, opcional)

**Decir:**  
«Esto no lo cambiáis cada día, pero conviene saber que existe.»

1. **Configuració** → teléfono, email, logo (solo mostrar, no cambiar en demo con cliente).
2. **Contingut home** → una sección (Hero) → explicar textos CA/ES.

→ Guías: [Configuración](./configuracion.md) · [Contenido home](./contenido-home.md)

---

### Bloque 9 — Cierre y feedback (5 min)

**Repasar con el cliente:**

| Pregunta | Anotar respuesta |
|----------|------------------|
| ¿La home encaja visualmente con lo acordado? (RD-050) | |
| ¿El flujo de esquela es claro para el día a día? | |
| ¿Falta algún dato o texto en la plantilla? | |
| ¿Quién del equipo usará el admin habitualmente? | |
| ¿Cuándo queréis URL de staging para validar solos? | |

**Decir:**  
«Os dejamos estas guías por escrito y, cuando tengáis la URL de prueba en internet, repetís el mismo recorrido a vuestro ritmo.»

**Entregar:** enlace a `docs/guia-cliente/` o PDF impreso si lo preparáis.

---

## Resumen visual del recorrido

```
[Visitante] Home → Esquela Ramon (demo existente)
     ↓
[Empleado] Admin login → Dashboard
     ↓
[Lugares] Iglesias (ver o crear) — mencionar cementerio + sala
     ↓
[Esquela] Nova esquela (Maria) → Desar → Foto → Activa + Visible
     ↓
[Visitante] Esquelas → Maria publicada
     ↓
[Familiar] Acceso + codi DEMOMAR1 → foto / obituario (opcional)
     ↓
[Empleado] Missatges / Flors (opcional)
     ↓
[Cierre] Feedback + próximos pasos (staging, dominio, formación)
```

---

## Plan B — si algo falla en la reunión

| Problema | Qué hacer en vivo |
|----------|-------------------|
| No carga la web | Mostrar capturas o repetir en local; aplazar demo técnica |
| Error al crear esquela (lugares) | Usar esquela Ramon ya existente para bloques 5–6 |
| Foto no sube | Continuar sin foto; explicar que en producción se revisa tamaño/formato |
| Cliente perdido | Parar y preguntar qué parte les importa más (esquela vs familiar vs flores) |

---

## Segunda sesión (si hace falta)

Temas para otra cita de 30 min:

- Editar textos de la **home** (validación RD-050 con mockup).
- Gestionar **comandas de flores** y estados.
- **Poemas** y catálogo de flores propio del cliente.
- Borrar esquela / lugar de prueba creados en la demo.

---

## Limpieza post-demo (facilitador)

Si la demo fue en entorno compartido:

- [ ] Borrar esquela **Maria Garcia Soler** (o marcar no visible).
- [ ] Borrar iglesia de prueba si se creó.
- [ ] Eliminar mensajes/comandas de prueba.

En local: `npm run db:reset` solo si el cliente no necesita conservar datos.
