# Checklist Vercel — staging

Después de `npm run db:setup:staging` exitoso, despliega en Vercel.

## 1. Importar proyecto

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository → `3urega/funeraria`
2. Framework: **Next.js** (auto-detectado)
3. Root Directory: `/` (raíz)
4. Build Command: `npm run build`
5. Install Command: `npm install`
6. Production Branch: **`main`**

## 2. Variables de entorno

Settings → Environment Variables → añadir **todas** las de `.env.staging` en **Production** y **Preview**.

| Variable | Notas |
|----------|--------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_URL` | Tras 1.er deploy: `https://tu-proyecto.vercel.app` |
| `DATABASE_DRIVER` | `postgres` |
| `DATABASE_URL` | **Obligatorio puerto 6543** (transaction pooler). Si usas 5432 verás `EMAXCONNSESSION`. Valor: `postgresql://postgres.pmvvnfjiccmxwrilmqnl:[PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:6543/postgres` |
| `STORAGE_DRIVER` | `supabase` |
| `AUTH_DRIVER` | `supabase` |
| `STORAGE_PUBLIC_BASE` | `https://pmvvnfjiccmxwrilmqnl.supabase.co/storage/v1/object/public/media` |
| `SUPABASE_STORAGE_BUCKET` | `media` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pmvvnfjiccmxwrilmqnl.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Igual que `.env.staging` |
| `SUPABASE_SERVICE_ROLE_KEY` | Igual que `.env.staging` |
| `FUNERAL_HOME_ID` | `fh-001` |
| `ADMIN_SESSION_SECRET` | Igual que `.env.staging` |
| `FAMILY_SESSION_SECRET` | Igual que `.env.staging` |

No hace falta `SEED_ADMIN_*` en Vercel (solo para seed local).

## 3. Deploy

1. Deploy → esperar build verde
2. Actualizar `NEXT_PUBLIC_APP_URL` con la URL real → **Redeploy**

## 4. Smoke test

- [ ] `/` — home
- [ ] `/esquelas/ramon-sant-torner` — esquela demo
- [ ] `/acceso` → código `DEMO1234`
- [ ] `/admin/login` — credenciales impresas por `db:setup:staging`
- [ ] Subir foto en admin → URL Supabase Storage

## 5. Entregar al cliente

- URL `*.vercel.app`
- Email/password admin
- Código familiar `DEMO1234`

Ver también [`DEPLOY_STAGING.md`](./DEPLOY_STAGING.md).
