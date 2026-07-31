import dns from "dns";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

dns.setDefaultResultOrder("ipv4first");

const DEFAULT_EMAIL = "admin@pujols.cat";
const DEFAULT_PASSWORD = "PujolsValidacio2026!";
const ADMIN_ROW_ID = "au-001";
const FUNERAL_HOME_ID = "fh-001";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  if (!url || !serviceKey || !databaseUrl) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o DATABASE_URL");
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim() || DEFAULT_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD;

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError) {
    throw new Error(`listUsers: ${listError.message}`);
  }

  let authUserId: string;
  const existing = listData.users.find((user) => user.email === email);

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) {
      throw new Error(`updateUser: ${error.message}`);
    }
    authUserId = existing.id;
    console.log(`✓ Password actualizado para ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      throw new Error(`createUser: ${error.message}`);
    }
    if (!data.user) {
      throw new Error("createUser no devolvió usuario");
    }
    authUserId = data.user.id;
    console.log(`✓ Usuario Auth creado: ${email}`);
  }

  const sql = postgres(databaseUrl, { max: 1 });
  try {
    await sql`
      insert into admin_users (id, auth_user_id, funeral_home_id, role)
      values (${ADMIN_ROW_ID}, ${authUserId}, ${FUNERAL_HOME_ID}, 'admin')
      on conflict (id) do update set
        auth_user_id = excluded.auth_user_id,
        funeral_home_id = excluded.funeral_home_id,
        role = excluded.role
    `;
    console.log(`✓ admin_users (${ADMIN_ROW_ID}) vinculado a Auth`);
  } finally {
    await sql.end();
  }

  console.log("\n--- Credenciales admin staging ---");
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log("Login:    /admin/login");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
