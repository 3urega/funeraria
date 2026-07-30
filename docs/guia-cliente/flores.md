# Flores — catálogo y pedidos

## Para qué sirve

Los **visitantes** pueden comprar flores desde la esquela pública de un difunto. Tú gestionas:

1. **Qué flores se venden** (catálogo).
2. **Qué pedidos han entrado** y en qué estado están.

*(En entorno de prueba el pago puede ser automático; en producción irá con pasarela real.)*

---

## Parte 1 — Catálogo de productos

### Ver productos

1. Menú → **Flors**.
2. Listado con nombre, precio y si está **activo**.

### Crear un producto nuevo

1. **Flors** → **«Nou producte»** / Nueva flor.
2. Rellena:
   - **Nom** — Ejemplo: `Corona clàssica`
   - **Descripció** — Texto corto para el visitante.
   - **Preu** — En euros (ejemplo: `85,00`).
   - **Ordre** — Número para ordenar en pantalla (0, 1, 2…).
   - **Actiu** — ✅ = se muestra en la web; ❌ = oculto pero no borrado.
3. **Foto** — Elige imagen (JPG, PNG o WebP).
4. **Guardar**.

### Editar o desactivar

1. Pulsa el **nombre** del producto en la lista.
2. Cambia datos o desmarca **Actiu** para dejar de venderlo sin borrarlo.
3. **Guardar**.

---

## Parte 2 — Pedidos (comandas)

### Ver todos los pedidos

1. Desde **Flors**, busca el enlace **«Comandes»** / pedidos (o menú directo si aparece).
2. Verás tabla: esquela, producto, dedicatoria, comprador, teléfono, email, **estado**.

### Estados del pedido

| Estado | Significado |
|--------|-------------|
| **Pagado** | Pedido recibido (pagado) |
| **En preparación** | Floristería preparando el ramo |
| **Entregado** | Ya entregado en el funeral/velatorio |

Para cambiar estado: abre el pedido o usa la acción en la tabla (según pantalla) y elige el nuevo estado.

### Pedidos de una esquela concreta

1. **Esquelas** → abre la esquela del difunto.
2. Pestaña **«Flors»** arriba.
3. Solo ves pedidos de **ese** difunto.

---

## Qué ve el visitante

1. Entra en la esquela pública del difunto.
2. Baja hasta **«Enviament de flors»** / compra de flores.
3. Elige producto → **Comprar** → rellena dedicatoria (obligatoria), nombre, email y teléfono.
4. Confirma el pago (según configuración).

Tú recibes el pedido en el panel admin.

---

## Qué verás al final

- Productos **activos** con foto y precio en cada esquela visible.
- Listado de **comandas** para preparar y marcar entregas.

---

## Problemas frecuentes

| Problema | Solución |
|----------|----------|
| No salen flores en la esquela | Producto debe estar **Actiu**; esquela **Visible** |
| Precio incorrecto | Edita el producto (precio en euros con coma o punto) |
| No llega pedido | Revisa pestaña Flors de esa esquela y listado global |

---

## Siguiente lectura

- [Esquelas](./esquelas.md) — publicar esquela donde se compran flores  
- [Web pública](./web-publica.md) — experiencia del visitante
