import { execSync } from "child_process";
import dns from "dns";
import { randomBytes } from "crypto";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

dns.setDefaultResultOrder("ipv4first");

const DEFAULT_ADMIN_EMAIL = "admin@staging.pujols.cat";

async function ensureStoragePolicy(databaseUrl: string): Promise<void> {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    await sql.unsafe(`
      CREATE POLICY "Public read media"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'media');
    `);
    console.log("✓ Política Storage (lectura pública media)");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("already exists")) {
      console.log("✓ Política Storage ya existía");
      return;
    }
    throw err;
  } finally {
    await sql.end();
  }
}

async function ensureAdminAuthUser(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son obligatorios",
    );
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  let password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    password = randomBytes(18).toString("base64url");
    process.env.SEED_ADMIN_PASSWORD = password;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError) {
    throw new Error(`Auth listUsers failed: ${listError.message}`);
  }

  const existing = listData.users.find((user) => user.email === email);
  if (existing) {
    console.log(`✓ Usuario Auth admin ya existe: ${email}`);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    throw new Error(`Auth createUser failed: ${error.message}`);
  }
  if (!data.user) {
    throw new Error("Auth createUser no devolvió usuario");
  }

  console.log(`✓ Usuario Auth admin creado: ${email}`);
  console.log(`  Password: ${password}`);
  return data.user.id;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL es obligatorio (.env.staging)");
  }

  console.log("1/4 Política Storage...");
  await ensureStoragePolicy(databaseUrl);

  console.log("\n2/4 Usuario Auth admin...");
  const authUserId = await ensureAdminAuthUser();
  process.env.SEED_ADMIN_AUTH_USER_ID = authUserId;

  console.log("\n3/4 Schema Postgres (Supabase)...");
  execSync("npx drizzle-kit push --config drizzle.config.prod.ts", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("\n4/4 Seed demo...");
  execSync("npx tsx scripts/seed.ts", {
    stdio: "inherit",
    env: process.env,
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
  console.log("\n✓ Staging DB lista.");
  console.log("✓ Código familiar demo: DEMO1234");
  console.log(`✓ Admin login: ${adminEmail}`);
  if (process.env.SEED_ADMIN_PASSWORD) {
    console.log(`  Password: ${process.env.SEED_ADMIN_PASSWORD}`);
  }
  console.log(`✓ Auth UUID vinculado: ${authUserId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
