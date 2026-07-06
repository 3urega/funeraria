# Funeral Platform

Plataforma web funeraria — Next.js + SQLite local + imágenes en disco.

Documentación en [`docs/`](docs/):

- **[Roadmap de entrega (0→100%)](docs/ROADMAP_ENTREGA.md)** ← progreso del producto
- [Requisitos](docs/DOCUMENTO_REQUISITOS.md)
- [Arquitectura](docs/arquitectura.md)
- [Desarrollo local](docs/ESTRATEGIA_DESARROLLO_LOCAL.md)

## Requisitos

- Node.js 20+

## Arranque

```powershell
npm install
copy .env.development.example .env.development
npm run db:setup
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Credenciales de desarrollo

| Rol | Acceso |
|-----|--------|
| Admin | `admin@local.dev` / `admin123` → [/admin/login](http://localhost:3000/admin/login) |
| Familiar | Código `DEMO1234` → [/acceso](http://localhost:3000/acceso) |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run db:setup` | Crear BD + seed + imágenes demo |
| `npm run db:reset` | Borrar BD e imágenes y volver a setup |
| `npm run db:studio` | UI para inspeccionar SQLite |
| `npm run storage:clean` | Borrar carpeta `storage/` |

## Estructura local

```
data/dev.db     ← SQLite (gitignored)
storage/        ← imágenes (gitignored)
src/app/
  (public)/     ← web pública
  (family)/     ← acceso familiar
  admin/        ← backoffice
```

## Producción (futuro)

Cambiar variables de entorno a `STORAGE_DRIVER=supabase`, `AUTH_DRIVER=supabase`, `DATABASE_DRIVER=postgres`. Ver documentación de arquitectura.
