# Requisitos — backoffice e-commerce de flores

> **Estado:** requisito confirmado, **no implementado**.  
> Catálogo público: [`requisits-flores.md`](requisits-flores.md)

## Qué gestiona el empleado

Un **mini e-commerce** integrado en el backoffice para la venta de flores vinculadas a esquelas.

Dos áreas:

| Área | Ruta prevista | Función |
|------|---------------|---------|
| **Catálogo de productos** | `/admin/flores` | CRUD artículos (coronas, ramos…) |
| **Comandas** | `/admin/flores/comandas` o pestaña en esquela | Pedidos por difunto |

---

## Gestión de productos (`flower_products`)

### RF-FLR-ADM-01 — Listado de productos

Tabla con columnas:

- Foto (miniatura)
- Nombre
- Precio
- Activo (sí/no)
- Orden

Acciones: crear, editar, activar/desactivar.

### RF-FLR-ADM-02 — Crear / editar producto

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `name` | Sí | Ej. «Corona clásica», «Ramo de rosas» |
| `description` | No | Texto para la ficha del producto |
| `priceCents` | Sí | Precio en céntimos (ej. 8500 = 85,00 €) |
| `currency` | Sí | Por defecto `EUR` |
| `imagePath` | Sí | Foto del producto — subida desde backoffice |
| `isActive` | Sí | Si está activo, aparece en la web pública |
| `sortOrder` | No | Orden de aparición en el catálogo |

### RF-FLR-ADM-03 — Subir foto del producto

- Upload desde formulario admin (JPEG, PNG, WebP).
- Almacenamiento local (`./storage/flowers/`) en dev; Supabase Storage en prod.
- Vista previa antes de guardar.

### RF-FLR-ADM-04 — Activar / desactivar producto

- Producto **inactivo** → no aparece en `/esquelas/[slug]`.
- No se elimina — se puede reactivar.
- Las comandas ya hechas de ese producto se conservan.

### RF-FLR-ADM-05 — Eliminar producto (opcional)

- Preferible **desactivar** en lugar de borrar si hay comandas históricas.
- Si se elimina: solo si nunca tuvo ventas (o soft-delete).

---

## Gestión de comandas (`flower_orders`)

### RF-FLR-ADM-06 — Listado global de comandas

- Filtros: por difunto, por estado, por fecha.
- Columnas: fecha, difunto, producto, dedicatoria (resumen), comprador, estado, importe.

### RF-FLR-ADM-07 — Comandas por difunto

Desde la ficha de cada esquela (`/admin/esquelas/[id]`):

- Listado de flores compradas para ese difunto.
- Dedicatoria completa de cada comanda.
- Datos del comprador.
- Estado de la comanda.

Para **coordinar con la floristería**.

### RF-FLR-ADM-08 — Cambiar estado de comanda

Estados:

| Estado | Significado |
|--------|-------------|
| `pending_payment` | Esperando pago |
| `paid` | Pagado — pendiente preparar |
| `in_preparation` | Floristería preparando |
| `delivered` | Entregado |
| `cancelled` | Cancelado |

El empleado puede avanzar el estado manualmente (p. ej. marcar como entregado).

---

## Modelo de datos (resumen)

```typescript
flower_products {
  id, funeralHomeId
  name, description
  priceCents, currency
  imagePath
  isActive, sortOrder
  createdAt, updatedAt
}

flower_orders {
  id, obituaryId, funeralHomeId, productId
  quantity
  dedicationText      // obligatorio
  buyerName, buyerEmail, buyerPhone
  status, paymentReference
  totalCents
  createdAt, updatedAt
}
```

---

## Rutas admin previstas

```
/admin/flores              → listado productos + crear
/admin/flores/[id]         → editar producto
/admin/flores/comandas     → listado comandas
/admin/esquelas/[id]       → pestaña «Flores» + «Missatges» del difunto
```

---

## Implementación (futur)

- [ ] Schema `flower_products` + `flower_orders`
- [ ] Seed productos demo (2–3 coronas/ramos)
- [ ] `/admin/flores` — CRUD + upload foto
- [ ] Toggle activar/desactivar
- [ ] Listado comandas + estados
- [ ] Integración en ficha esquela
