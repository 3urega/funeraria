# Deploy staging — Supabase + Vercel

Guía para levantar el entorno de **validación del cliente** (issue #10, RD-100–104).

| Entorno | Host | BD | Storage | Auth admin |
|---------|------|-----|---------|------------|
| Local | `localhost` | SQLite | `./storage/` | Mock |
| Staging | Vercel (`develop`) | Supabase Postgres | Supabase Storage | Supabase Auth |
| Prod | Vercel + dominio | Supabase (proyecto prod) | Idem | Idem |

## 1. Supabase (staging)

1. Crear proyecto en región **EU**.
2. **Database** → copiar `DATABASE_URL` (pooler, puerto 6543).
3. **Storage** → crear bucket `media`, marcar **Public**.
4. **Authentication** → habilitar Email; crear usuario admin para el cliente.
5. Copiar **Project URL**, **anon key** y **service role key**.

Políticas Storage (SQL Editor):

```sql
-- Lectura pública
CREATE POLICY "Public read media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Escritura solo service role (la app usa SUPABASE_SERVICE_ROLE_KEY en servidor)
```

## 2. Variables locales para seed

```powershell
copy .env.staging.example .env.staging
# Editar .env.staging con valores reales
# SEED_ADMIN_AUTH_USER_ID = UUID del usuario Auth creado en paso 1.5
```

## 3. Schema + seed en Supabase

```powershell
npm run db:setup:staging
```

## 4. Vercel

1. Importar repo `3urega/funeraria`.
2. **Production Branch** = `develop` (staging).
3. Añadir las mismas variables que `.env.staging` en **Settings → Environment Variables** (Production + Preview).
4. Deploy.

Build command: `npm run build`  
Install: `npm install`

## 5. Smoke test

- Home `/`
- Esquela demo `/esquelas/ramon-sant-torner`
- Familiar: `/acceso` → código `DEMO1234`
- Admin: `/admin/login` con credenciales Supabase Auth
- Subir foto en admin → visible vía URL Supabase Storage

## 6. Entregar al cliente

- URL `*.vercel.app`
- Credenciales admin (Supabase Auth)
- Código familiar `DEMO1234`
- Checklist home (RD-050) + flujos principales

## Prod (después)

Mismo procedimiento con **proyecto Supabase prod** + dominio cliente (DNS → Vercel).
