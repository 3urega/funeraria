import fs from "fs/promises";
import path from "path";

async function main() {
  const root = path.resolve(process.cwd(), "storage");
  await fs.rm(root, { recursive: true, force: true });
  console.log("storage/ eliminado.");
}

main();
