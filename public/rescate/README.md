# Assets rescatados del template Angular legacy

Imágenes copiadas desde `src/assets/images/` (proyecto original).

**No incluye logos** — pertenecen a otro proyecto.

## Contenido

### `salas/`

Fotos de salas para portfolio / galería.

| Archivo | Tamaño aprox. |
|---------|---------------|
| `sala1.png` | ~887 KB |
| `sala2.png` | ~612 KB |
| `sala3.png` | ~792 KB |
| `sala4.png` | ~688 KB |

### `texturas/`

Fondos y texturas para secciones de la home.

| Archivo | Uso en legacy |
|---------|---------------|
| `top_bg.jpg` | Fondo sección items-list |
| `white_bg.jpg` | Fondo sección servicios |
| `texture_4.png` | Textura decorativa |
| `texture_background1.png` | Fondo componentes |
| `texture_background2.png` | Fondo componentes |
| `texture_background_light.png` | Fondo claro |
| `texture_background_light2.png` | Fondo claro alternativo |

## Uso en Next.js

Servidas como estáticos desde `/rescate/`:

```
/rescate/salas/sala1.png
/rescate/texturas/top_bg.jpg
```

**Recomendación:** convertir PNG pesados a WebP antes de producción.
