import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

async function main() {
  await fs.mkdir("./data", { recursive: true });
  await fs.mkdir("./storage", { recursive: true });

  execSync("npx drizzle-kit push", { stdio: "inherit" });
  execSync("npx tsx scripts/seed.ts", { stdio: "inherit" });

  console.log("\n✓ Base de datos lista: data/dev.db");
  console.log("✓ Admin: admin@local.dev / admin123");
  console.log("✓ Código familiar demo: DEMO1234");
  console.log("\nEjecuta: npm run dev");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
