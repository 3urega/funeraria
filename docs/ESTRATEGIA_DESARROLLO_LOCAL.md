# Estrategia de desarrollo local

## Plataforma web funeraria — Eurega Solutions

**Versión:** 1.1  
**Fecha:** 4 de julio de 2026  
**Documentos relacionados:** [arquitectura.md](./arquitectura.md) · [DOCUMENTO_REQUISITOS.md](./DOCUMENTO_REQUISITOS.md)

---

## 1. Objetivo

Desarrollar **100% en local** sin depender de servicios en la nube ni de **Docker**. Solo necesitas **Node.js** y el editor.

| Capa | Desarrollo local | Producción |
|------|------------------|------------|
| Base de datos | **SQLite** (fichero `./data/dev.db`) | Supabase PostgreSQL |
| Imágenes | Carpeta `./storage/` en disco | Supabase Storage |
| Auth admin | Mock local / credenciales fijas | Supabase Auth |
| Auth familiar | Cookie JWT (igual que prod) | Cookie JWT |
| Deploy | `next dev` | Vercel |

**Principio:** la lógica de negocio y los paths de imagen (`obituaries/{id}/foto.webp`) son **idénticos** en todos los entornos. Solo cambia el driver de cada capa.

**Consumo de recursos:** un único proceso Node.js + un fichero `.db` en disco. Sin contenedores, sin PostgreSQL en background, sin servicios extra.

---

## 2. Requisitos del entorno local

### 2.1 Software necesario

| Herramienta | Versión mínima | Uso |
|-------------|----------------|-----|
| Node.js | 20 LTS | Next.js + SQLite (via `better-sqlite3`) |
| npm / pnpm | latest | Gestión de paquetes |
| Git | 2.x | Control de versiones |

**No necesitas:** Docker, Docker Desktop, PostgreSQL instalado, cuenta Supabase, cuenta Vercel.

### 2.2 Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Next.js dev | 3000 | http://localhost:3000 |

Solo un puerto. Nada más escuchando en background.

---

## 3. Arranque en 2 pasos

```bash
# Primera vez (o tras db:reset)
npm install
npm run db:setup      # crea data/dev.db + seed + storage/

# Cada día
npm run dev
```

La app queda en **http://localhost:3000**.

Login admin: `admin@local.dev` / `admin123`  
Código familiar demo: `DEMO1234`

---

## 4. Base de datos — SQLite en fichero

### 4.1 Por qué SQLite en local

| Criterio | Docker + PostgreSQL | SQLite |
|----------|---------------------|--------|
| RAM extra | ~200–500 MB (Docker Desktop) | ~0 MB (dentro de Node) |
| Servicios background | PostgreSQL siempre corriendo | Ninguno |
| Setup | `docker compose up` | Automático al primer `db:setup` |
| Reset | Borrar volumen Docker | Borrar `data/dev.db` |
| Paridad con prod | Alta | Suficiente para MVP *(ver §16)* |

SQLite es el estándar de facto para desarrollo local ligero. Drizzle ORM soporta **SQLite y PostgreSQL** con el mismo schema TypeScript.

### 4.2 Ubicación del fichero

```
data/
└── dev.db          ← gitignored, se crea con db:setup
```

### 4.3 Dependencias

```json
{
  "dependencies": {
    "better-sqlite3": "^11.x",
    "drizzle-orm": "^0.x"
  },
  "devDependencies": {
    "drizzle-kit": "^0.x",
    "@types/better-sqlite3": "^7.x"
  }
}
```

### 4.4 Conexión Drizzle (local vs prod)

```typescript
// src/lib/db/index.ts

import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from './schema';

export function createDb() {
  const driver = process.env.DATABASE_DRIVER ?? 'sqlite';

  if (driver === 'postgres') {
    const client = postgres(process.env.DATABASE_URL!);
    return drizzlePostgres(client, { schema });
  }

  // Local: fichero SQLite
  const sqlite = new Database(process.env.DATABASE_URL ?? './data/dev.db');
  sqlite.pragma('journal_mode = WAL');  // mejor rendimiento en dev
  sqlite.pragma('foreign_keys = ON');
  return drizzleSqlite(sqlite, { schema });
}
```

### 4.5 Schema único, dos dialectos

El schema se define **una vez** en TypeScript (`src/lib/db/schema.ts`). Drizzle genera SQL según el dialecto:

```typescript
// drizzle.config.ts — local
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: { url: './data/dev.db' },
});
```

Para producción existe un `drizzle.config.prod.ts` con `dialect: 'postgresql'`.

### 4.6 Scripts npm

```json
{
  "scripts": {
    "dev": "next dev",
    "db:setup": "tsx scripts/setup-db.ts",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx scripts/seed.ts",
    "db:reset": "tsx scripts/reset-db.ts",
    "db:studio": "drizzle-kit studio",
    "storage:clean": "tsx scripts/clean-storage.ts"
  }
}
```

| Script | Qué hace |
|--------|----------|
| `db:setup` | Crea `data/`, aplica schema (`db:push`), ejecuta seed, copia imágenes demo |
| `db:push` | Sincroniza schema TypeScript → SQLite (sin ficheros SQL manuales) |
| `db:reset` | Borra `data/dev.db` + `storage/`, vuelve a ejecutar `db:setup` |
| `db:studio` | UI web para inspeccionar tablas |

### 4.7 Script de setup

```typescript
// scripts/setup-db.ts
import fs from 'fs';
import { execSync } from 'child_process';

fs.mkdirSync('./data', { recursive: true });
fs.mkdirSync('./storage', { recursive: true });

execSync('npx drizzle-kit push', { stdio: 'inherit' });
execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' });

console.log('\n✓ Base de datos lista: data/dev.db');
console.log('✓ Admin: admin@local.dev / admin123');
console.log('✓ Código familiar: DEMO1234');
console.log('\nEjecuta: npm run dev');
```

### 4.8 Script de reset

```typescript
// scripts/reset-db.ts
import fs from 'fs';

for (const path of ['./data/dev.db', './data/dev.db-wal', './data/dev.db-shm']) {
  if (fs.existsSync(path)) fs.unlinkSync(path);
}

// Limpiar storage (mantiene estructura)
if (fs.existsSync('./storage')) {
  fs.rmSync('./storage', { recursive: true });
}

console.log('BD e imágenes borradas. Ejecutando setup...');
// re-ejecutar setup-db
```

---

## 5. Variables de entorno

### 5.1 `.env.development.example` (commitear)

```bash
# ─── Entorno ───────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Base de datos (SQLite — sin Docker, sin PostgreSQL) ─
DATABASE_DRIVER=sqlite
DATABASE_URL=./data/dev.db

# ─── Drivers (local = sin servicios externos) ──────────
STORAGE_DRIVER=local
AUTH_DRIVER=local

# ─── Storage local ─────────────────────────────────────
STORAGE_LOCAL_ROOT=./storage
STORAGE_PUBLIC_BASE=/api/media

# ─── Auth local (solo dev) ─────────────────────────────
DEV_ADMIN_EMAIL=admin@local.dev
DEV_ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=dev-admin-secret-min-32-characters-long

# ─── Sesión familiar ───────────────────────────────────
FAMILY_SESSION_SECRET=dev-family-secret-min-32-characters-long

# ─── Google Places (geolocalització llocs admin) ───────
# Places API (New) — opcional en dev; sense clau, adreça manual
# GOOGLE_MAPS_API_KEY=

# ─── Supabase (vacío en local — no se usa) ─────────────
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
```

### 5.2 Producción (referencia)

```bash
DATABASE_DRIVER=postgres
DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres
STORAGE_DRIVER=supabase
AUTH_DRIVER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 5.3 Validación con Zod

```typescript
// src/lib/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_DRIVER: z.enum(['sqlite', 'postgres']).default('sqlite'),
  DATABASE_URL: z.string(),
  STORAGE_DRIVER: z.enum(['local', 'supabase']).default('local'),
  AUTH_DRIVER: z.enum(['local', 'supabase']).default('local'),
});

export const env = envSchema.parse(process.env);
```

---

## 6. Almacenamiento de imágenes en local

*(Sin cambios respecto a v1.0 — carpeta `storage/` en disco.)*

### 6.1 Estructura

```
storage/                          ← gitignored
├── obituaries/{obituary_id}/{uuid}.webp
├── places/churches/{church_id}/{uuid}.webp
├── places/cemeteries/{cemetery_id}/{uuid}.webp
├── content/{section_key}/{uuid}.webp
└── site/logo.webp
```

### 6.2 `.gitignore`

```gitignore
# Base de datos local
/data/

# Imágenes subidas en desarrollo
/storage/

# Entorno
.env.development
.env.local
.env*.local
```

### 6.3 Imágenes demo (sí commitear)

```
scripts/seed-assets/
├── obituaries/sample-01.webp
├── places/church-sample.webp
├── content/hero-default.webp
└── site/logo.webp
```

---

## 7. Storage Adapter

Interfaz común; implementación local escribe en `./storage/`, Supabase solo en prod.

```typescript
// src/lib/storage/types.ts
export type StorageBucket = 'obituaries' | 'places' | 'content' | 'site';

export interface StorageAdapter {
  upload(bucket: StorageBucket, relativePath: string, file: Buffer, mime: string): Promise<string>;
  delete(fullPath: string): Promise<void>;
  getPublicUrl(fullPath: string): string;
}
```

```typescript
// src/lib/storage/index.ts
export function getStorage(): StorageAdapter {
  return process.env.STORAGE_DRIVER === 'supabase'
    ? new SupabaseStorageAdapter()
    : new LocalStorageAdapter();
}
```

**Regla:** la UI nunca escribe en disco directamente. Siempre `getStorage()`.

---

## 8. Servir imágenes — `/api/media/[...path]`

Route Handler de Next.js que lee de `./storage/` cuando `STORAGE_DRIVER=local`:

```
http://localhost:3000/api/media/obituaries/{id}/{uuid}.webp
```

Incluye validación anti path-traversal. Ver implementación completa en [arquitectura.md §8](./arquitectura.md).

---

## 9. Autenticación en local

### 9.1 Admin — credenciales fijas

```typescript
// src/lib/auth/local.adapter.ts
// Login: DEV_ADMIN_EMAIL + DEV_ADMIN_PASSWORD → cookie admin_session (JWT httpOnly)
// Google OAuth: botón oculto cuando AUTH_DRIVER=local
```

### 9.2 Familiar — cookie JWT

Misma implementación en local y prod. No depende de Supabase.

---

## 10. Autorización sin RLS (SQLite)

PostgreSQL en prod usa **Row Level Security**. SQLite no tiene RLS.

| Entorno | Quién filtra permisos |
|---------|----------------------|
| Local (SQLite) | **Capa de aplicación** — queries con `WHERE funeral_home_id = ?` en Server Actions |
| Prod (PostgreSQL) | RLS en Supabase + capa de aplicación |

En local, la seguridad la garantizan:
1. Server Actions / Route Handlers (nunca confiar en el cliente).
2. Middleware en `/admin/*`.
3. Validación de sesión familiar en `/mi-esquela`.

Esto es suficiente para desarrollo. Al desplegar, se activan las políticas RLS de PostgreSQL.

---

## 11. Diferencias SQLite ↔ PostgreSQL (conocer, no bloquear)

| Feature | SQLite (local) | PostgreSQL (prod) | Impacto |
|---------|----------------|-------------------|---------|
| JSON | JSON (texto) | JSONB | Drizzle abstrae; mismo API |
| UUID | Texto `uuid` | Tipo `uuid` | Usar `text` en schema Drizzle para ambos |
| RLS | No existe | Supabase RLS | Solo en prod |
| `gen_random_uuid()` | No nativo | Sí | Generar UUIDs en TypeScript (`crypto.randomUUID()`) |
| Full-text search | FTS5 | `tsvector` | No necesario en MVP |
| Concurrent writes | WAL mode | Nativo | Suficiente para dev single-user |

**Regla de schema:** evitar SQL específico de PostgreSQL en queries de aplicación. Usar API de Drizzle ORM siempre.

---

## 12. Estructura del proyecto

```
funeraria/
├── data/                           ← gitignored (dev.db)
├── storage/                        ← gitignored (imágenes)
├── drizzle/                        ← migraciones generadas (prod)
├── scripts/
│   ├── setup-db.ts
│   ├── reset-db.ts
│   ├── seed.ts
│   ├── seed-assets/                ← imágenes demo versionadas
│   └── clean-storage.ts
├── src/
│   ├── app/
│   │   ├── api/media/[...path]/    ← sirve imágenes locales
│   │   └── ...
│   └── lib/
│       ├── config/env.ts
│       ├── db/
│       │   ├── index.ts            ← factory SQLite / Postgres
│       │   └── schema.ts           ← schema único Drizzle
│       ├── storage/
│       └── auth/
├── drizzle.config.ts               ← dialect: sqlite
├── drizzle.config.prod.ts          ← dialect: postgresql
├── .env.development.example
└── package.json
```

**No hay** `docker-compose.yml`.

---

## 13. Configuración inicial — Windows incluido

### Paso 1 — Clonar e instalar

```powershell
git clone <repo>
cd funeraria
npm install
copy .env.development.example .env.development
```

### Paso 2 — Crear BD + seed

```powershell
npm run db:setup
```

Crea automáticamente:
- `data/dev.db`
- `storage/` con imágenes demo
- Datos de prueba (esquelas, iglesias, CMS)

### Paso 3 — Arrancar

```powershell
npm run dev
```

### Paso 4 — Verificar

| Check | URL |
|-------|-----|
| Home | http://localhost:3000 |
| Esquelas | http://localhost:3000/esquelas |
| Admin | http://localhost:3000/admin/login |
| Acceso familiar | http://localhost:3000/acceso → `DEMO1234` |
| Imagen local | DevTools → `<img src="/api/media/...">` carga OK |

---

## 14. Workflow diario

```mermaid
flowchart TD
    A[Abrir proyecto] --> B[npm run dev]
    B --> C[Desarrollar]
    C --> D{¿Cambiaste schema?}
    D -->|Sí| E[npm run db:push]
    D -->|No| F[Guardar / commit]
    E --> F
    F --> G{¿BD corrupta?}
    G -->|Sí| H[npm run db:reset]
    G -->|No| C
    H --> B
```

### Comandos frecuentes

| Situación | Comando |
|-----------|---------|
| Empezar el día | `npm run dev` |
| Cambié el schema | `npm run db:push` |
| BD rota / empezar de cero | `npm run db:reset` |
| Limpiar imágenes subidas | `npm run storage:clean` |
| Inspeccionar tablas | `npm run db:studio` |
| Primera instalación | `npm run db:setup` |

---

## 15. Flujo completo en local

```mermaid
sequenceDiagram
    actor Dev as Desarrollador
    participant Next as next dev :3000
    participant SQLite as data/dev.db
    participant Disk as storage/

    Dev->>Next: npm run dev
    Next->>SQLite: Drizzle queries
    Next->>Disk: LocalStorageAdapter
    Dev->>Next: Upload imagen admin
    Next->>Disk: writeFile storage/...
    Next->>SQLite: UPDATE image_path
    Dev->>Next: GET /api/media/...
    Next->>Disk: readFile
    Next-->>Dev: imagen
```

**Un solo proceso. Dos carpetas locales (`data/` + `storage/`). Cero cloud. Cero Docker.**

---

## 16. Paridad local ↔ producción

| Aspecto | Local | Producción |
|---------|-------|------------|
| Path imagen en BD | `obituaries/id/uuid.webp` | Igual |
| URL imagen | `/api/media/...` | Supabase Storage URL |
| Schema datos | Drizzle schema.ts | Mismo schema.ts |
| Motor BD | SQLite fichero | PostgreSQL |
| Auth admin | Cookie + credenciales fijas | Supabase Auth |
| Auth familiar | Cookie JWT | Cookie JWT |
| RLS | App layer | App + PostgreSQL RLS |
| Google OAuth | Oculto | Disponible |

---

## 17. Cuándo conectar Supabase

Solo al preparar el **primer deploy**. Hasta entonces, no hace falta cuenta ni internet.

| Momento | Config |
|---------|--------|
| Desarrollo diario | `DATABASE_DRIVER=sqlite`, `STORAGE_DRIVER=local`, `AUTH_DRIVER=local` |
| Staging / prod | `DATABASE_DRIVER=postgres`, `STORAGE_DRIVER=supabase`, `AUTH_DRIVER=supabase` |

Migrar datos de dev a prod: script de export/import o repetir seed en Supabase.

---

## 18. Alternativa opcional — PostgreSQL nativo (sin Docker)

Si en algún momento necesitas **paridad SQL total** y tu PC aguanta un servicio ligero **sin Docker Desktop**:

1. Instalar [PostgreSQL para Windows](https://www.postgresql.org/download/windows/) (solo el server, ~50 MB RAM en idle).
2. Crear BD `funeral_dev`.
3. Cambiar `.env.development`:

```bash
DATABASE_DRIVER=postgres
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/funeral_dev
```

4. Usar `drizzle.config.prod.ts` para migrar.

**Recomendación:** quedarse con SQLite para el día a día. Usar PostgreSQL nativo solo si aparece un bug específico de dialecto SQL.

---

## 19. Testing en local

### Tests unitarios
- `LocalStorageAdapter`, `LocalAuthAdapter`, Route Handler `/api/media`.

### Tests e2e (Playwright)

```typescript
// playwright.config.ts
webServer: {
  command: 'npm run db:setup && npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

Sin Docker en CI: SQLite + `storage/` temporales.

---

## 20. Troubleshooting

| Problema | Solución |
|----------|----------|
| `Cannot find module 'better-sqlite3'` | `npm install` (requiere build tools en Windows; usar Node 20 LTS) |
| Error compilando `better-sqlite3` en Windows | Instalar [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) → workload "Desktop development with C++" **o** usar `npm install --build-from-source=false` si hay binary precompilado |
| `database is locked` | Cerrar Drizzle Studio u otra instancia que tenga abierto `dev.db` |
| Imagen 404 | Verificar fichero en `storage/` y path en BD |
| Login admin falla | Revisar `DEV_ADMIN_EMAIL` / `DEV_ADMIN_PASSWORD` |
| `db:push` falla | `npm run db:reset` |
| Puerto 3000 ocupado | `npx next dev -p 3001` |
| Antivirus bloquea `storage/` | Añadir excepción en Windows Defender |

---

## 21. Seguridad en local

- `.env.development` en `.gitignore`.
- `data/dev.db` en `.gitignore` — no commitear datos de prueba con info real.
- `storage/` en `.gitignore`.
- Route Handler valida path traversal.
- Datos ficticios en seed.

---

## 22. Resumen

```
┌─────────────────────────────────────────────────────────┐
│  DESARROLLO LOCAL LIGERO — Sin Docker, sin cloud        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  npm run dev  →  Next.js (:3000)                        │
│       │                                                 │
│       ├── data/dev.db        (SQLite, un fichero)        │
│       ├── storage/           (imágenes en disco)        │
│       ├── /api/media/*       (sirve imágenes)           │
│       ├── LocalAuthAdapter   (admin@local.dev)          │
│       └── family_session     (cookie JWT)               │
│                                                         │
│  RAM extra: ~0 MB (solo Node.js)                        │
│  Servicios background: 0                                │
│                                                         │
│  Prod = cambiar env vars → Supabase + Vercel            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Un solo código. Tres drivers (`sqlite` / `local` / `local`). Cero Docker.**

---

*Estrategia de desarrollo local v1.1 — Sin Docker, SQLite en fichero.*
