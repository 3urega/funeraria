# Web pública — qué ve un visitante

## Para qué sirve esta guía

Explica qué puede hacer **cualquier persona** que entra en la web **sin** ser empleado ni familiar. Útil para formación interna y para responder dudas de clientes.

---

## Página de inicio

**Dirección:** la raíz del sitio (ejemplo: `www.pujols.cat`).

El visitante ve:

- Nombre y logo de la funeraria.
- Titular y textos de servicios (editables en [Contenido home](./contenido-home.md)).
- **Esquelas recientes** — tarjetas de difuntos con esquela **visible**.
- Teléfono y enlaces del pie de página ([Configuración](./configuracion.md)).

Puede cambiar idioma **Català / Castellà** arriba a la derecha.

---

## Listado de esquelas

1. Menú → **Esqueles** / Esquelas.
2. Lista de tarjetas de difuntos **visibles**.
3. Pulsa una tarjeta → página del difunto.

Solo aparecen esquelas con **Visible** marcado en admin ([Esquelas](./esquelas.md)).

---

## Página de una esquela (detalle)

El visitante ve, de arriba abajo:

### 1. Esquela impresa (formato formal)

- Nombre del difunto, edad, lugar y día de defunción.
- Fecha/hora del funeral, iglesia.
- Velatorio, casa mortuòria.
- **E.P.D.** si está activado.
- **Foto** solo si el empleado publicó una (retocada).

### 2. Obituario (si existe)

- Bloque **separado** con texto poético.
- Lo escribe el **familiar** desde su zona privada; el visitante solo lo lee.

### 3. Lugares / mapas

- Tarjetas de **iglesia** y **cementerio**.
- Botón **«Com arribar (Google Maps)»** → abre Google Maps.

### 4. Compra de flores

- Catálogo con foto y precio ([Flores](./flores.md)).
- Botón **Comprar** → formulario:
  - Dedicatoria (obligatoria)
  - Nombre, email, teléfono del comprador
- Tras confirmar, el pedido llega al admin.

### 5. Mensaje conmemorativo

- Formulario: **nombre** + **mensaje**.
- **No se publica en la web.**
- Lo recibe la familia en la sala de vetlla; el empleado lo revisa en admin ([Esquelas](./esquelas.md) → pestaña Missatges).

---

## Sales de vetlla

Menú → **Sales de vetlla**.

- Información de las salas activas (nombre, foto, texto).
- Catálogo gestionado en [Lugares](./lugares.md).

---

## Acceso familiares (menú)

- Lleva a la pantalla de **código**.
- No es para visitantes generales; ver [Zona familiar](./zona-familiar.md).

---

## Qué NO puede hacer un visitante

- Entrar al **admin** (`/admin`) sin usuario y contraseña de empleado.
- Ver esquelas **no visibles** (aunque conozca la dirección, no aparecen en listados).
- Publicar mensajes en la web (solo envío privado a familia).
- Subir foto a la esquela pública (solo la familia envía foto privada; publicación = empleado).

---

## Comprobar que todo funciona (empleado)

| Comprobar | Dónde |
|-----------|--------|
| Home con textos correctos | `/` |
| Esquela en listado | `/esquelas` |
| Esquela completa | `/esquelas/[slug]` |
| Flores y mensaje | Misma página, scroll abajo |
| Salas | `/sales-de-vetlla` |
| Acceso familiar | `/acceso` + código |

Desde admin: enlace **«← Web pública»** abre la home en otra pestaña.

---

## Mapa rápido

```
Visitante
   │
   ├─ Home ─────────────── textos CMS + esquelas recientes
   ├─ Esquelas ─────────── listado → detalle (mapas, flores, mensaje)
   ├─ Sales de vetlla ──── catálogo salas
   └─ Acceso familiares ── solo con código (zona privada)

Empleado ──► /admin (panel)

Familiar ──► código → mi esquela (foto + obituario)
```

---

## Índice de guías para empleados

Volver al [README](./README.md) de esta carpeta.
