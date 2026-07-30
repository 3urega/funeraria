import { execSync } from "child_process";

async function main() {
  console.log("Aplicando schema Postgres (Supabase)...");
  execSync("npx drizzle-kit push --config drizzle.config.prod.ts", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("\nEjecutando seed...");
  execSync("npx tsx scripts/seed.ts", {
    stdio: "inherit",
    env: process.env,
  });

  console.log("\n✓ Staging DB lista.");
  console.log("✓ Código familiar demo: DEMO1234");
  console.log(
    "\nRecuerda: vincula admin_users.auth_user_id al UUID de Supabase Auth",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
