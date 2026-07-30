# Esquelas — crear, publicar y gestionar

## Para qué sirve

Aquí preparas la **esquela** de cada difunto: textos, iglesia, cementerio, foto, código para la familia y publicación en la web.

**Importante:** antes de la primera esquela, debes tener al menos **una iglesia, un cementerio y una sala de vetlla** en el catálogo. Si no, ver [Lugares](./lugares.md).

---

## 1. Ver todas las esquelas

1. Entra al panel ([Acceso admin](./acceso-admin.md)).
2. En el menú izquierdo, pulsa **«Esquelas»**.
3. Verás una **tabla** con columnas: nombre, código, activa, visible, foto familiar, mensajes, etc.
4. Para **editar** una esquela, pulsa sobre el **nombre** del difunto.

En el **Dashboard** también verás avisos amarillos si hay **fotos de familiares pendientes** o **mensajes sin revisar**.

---

## 2. Crear una esquela nueva

1. Menú **Esquelas** → botón **«Nova esquela»** (arriba a la derecha).
2. Rellena el formulario de la **izquierda**. A la **derecha** ves una **vista previa** de cómo quedará.

### Datos del difunto

| Campo | Qué poner (ejemplo) |
|-------|---------------------|
| **Nom complet** | Nombre en mayúsculas: `RAMON SANT TORNER` |
| **Lloc de defunció** | Ciudad: `Berga` |
| **Dia** | Día del fallecimiento: `1` |
| **Edat** | Edad: `75` |

### Funeral

| Campo | Qué poner |
|-------|-----------|
| **Data i hora del funeral** | Texto libre: `dimarts dia 3 a les 11:00` |
| **Església** | Elige de la lista desplegable |
| **Cementiri** | Elige de la lista desplegable |

### Vetlla (velatorio)

| Campo | Qué poner |
|-------|-----------|
| **Sala de vetlla** | Elige de la lista |
| **Horari de vetlla** | Ejemplo: `Dilluns de 17:00 a 19:00` |
| **Casa mortuòria** | Dirección (suele rellenarse sola con la de configuración) |
| **Mostrar «E.P.D.»** | Deja marcado si quieres que salga «E.P.D.» en la esquela |

### Foto (en esquela nueva)

- La primera vez **no puedes subir foto**: primero hay que **guardar** la esquela.
- Después de guardar, entra otra vez a editarla (paso 3).

### Publicación

| Campo | Significado |
|-------|-------------|
| **Codi d'accés familiar** | Código que darás a la familia (8 caracteres). Pulsa **«Generar»** si quieres uno automático. **Anótalo** y dáselo al familiar. |
| **Slug URL** | Parte de la dirección web (ejemplo: `ramon-sant-torner`). Se genera solo del nombre; no hace falta tocarlo salvo conflicto. |
| **Codi d'expedient** | Opcional, para uso interno |
| **Activa** | ✅ = la familia puede entrar con el código |
| **Visible al llistat públic** | ✅ = aparece en `/esquelas` y en la home |
| **Esquela completa** | ✅ = marcas que ya está terminada (control interno) |

3. Pulsa **«Desar esquela»** (guardar) abajo.
4. Volverás al listado. **Entra otra vez** en la esquela para subir la foto.

---

## 3. Subir o cambiar la foto de la esquela

*(Solo en **editar** esquela, sección **§ Foto**)*

### Opción A — Escaneo o foto ya retocada (empleado)

1. En **§ Foto**, pulsa **«Escollir fitxer»** / **Examinar** y elige la imagen del ordenador (JPG, PNG o WebP; máximo 5 MB).
2. Pulsa **«Pujar foto retocada»**.
3. Verás la **foto publicada** en miniatura. Esa es la que ven familia y visitantes.

### Opción B — Foto enviada por el familiar

Si el familiar subió una foto desde su zona privada:

1. Aparece un recuadro **amarillo**: «Foto pendent del familiar».
2. Pulsa **«Descarregar per retocar»** y ábrela en tu programa de retoque.
3. Retoca la foto **fuera** de la web.
4. Sube la versión retocada con **«Pujar foto retocada»** (como opción A).
5. **Nunca** se publica la foto original del familiar sin retocar.

Si la foto no sirve:

- Pulsa **«Rebutjar foto»**. El familiar podrá enviar otra.

---

## 4. Mensajes conmemorativos (visitantes)

Los visitantes pueden dejar un mensaje **privado** para la familia (no se publica en la web).

1. Abre la esquela → pestaña **«Missatges»** (arriba).
2. Lee cada mensaje (nombre + texto).
3. Marca **«Revisat»** cuando la familia ya lo haya visto o anotado.
4. Puedes filtrar solo los no revisados.

---

## 5. Pedidos de flores de esa esquela

1. Abre la esquela → pestaña **«Flors»** (arriba).
2. Verás pedidos: producto, dedicatoria, comprador, estado.
3. Para ver **todos** los pedidos de la funeraria: menú **Flors** → enlace a comandas (ver [Flores](./flores.md)).

---

## 6. Cómo comprobar que la esquela está en la web

1. Menú **«← Web pública»** (abajo del menú admin).
2. Pulsa **«Esqueles»** en la web.
3. Si marcaste **Visible**, debe aparecer la tarjeta del difunto.
4. Pulsa la tarjeta: verás la esquela completa, mapas, flores y formulario de mensaje.

También puedes abrir directamente (sustituye la dirección base):

`https://TU-WEB/esquelas/nombre-del-slug`

Ejemplo demo local: `/esquelas/ramon-sant-torner`

---

## 7. Resumen rápido del día a día

```
Crear esquela → Guardar → Subir foto retocada
→ Marcar Activa + Visible → Dar código a la familia
→ Revisar foto pendiente / mensajes en Dashboard
→ Comprobar en web pública
```

---

## Problemas frecuentes

| Problema | Solución |
|----------|----------|
| No deja guardar: aviso amarillo de lugares | Crea iglesia, cementerio y sala en [Lugares](./lugares.md) |
| Slug o código duplicado | Cambia el código o el slug manualmente |
| La familia no entra | Comprueba que **Activa** esté marcada y el código sea correcto |
| No sale en la lista pública | Marca **Visible al llistat públic** |
| Error al subir foto | Usa JPG/PNG/WebP y menos de 5 MB |

---

## Siguiente lectura

- [Zona familiar](./zona-familiar.md) — qué hace la familia con el código  
- [Web pública](./web-publica.md) — qué ven los visitantes
