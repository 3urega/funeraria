import fs from "fs";
import { execSync } from "child_process";

const files = ["./data/dev.db", "./data/dev.db-wal", "./data/dev.db-shm"];

for (const file of files) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

if (fs.existsSync("./storage")) {
  fs.rmSync("./storage", { recursive: true });
}

console.log("BD e imágenes borradas. Ejecutando setup...\n");
execSync("npx tsx scripts/setup-db.ts", { stdio: "inherit" });
