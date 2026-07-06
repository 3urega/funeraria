import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_URL ?? "./data/dev.db";

declare global {
  // eslint-disable-next-line no-var
  var __funeralDb: ReturnType<typeof createSqliteDb> | undefined;
}

function createSqliteDb() {
  const resolved = path.isAbsolute(dbPath)
    ? dbPath
    : path.resolve(process.cwd(), dbPath);

  const sqlite = new Database(resolved);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

export function getDb() {
  if (process.env.NODE_ENV === "production") {
    return createSqliteDb();
  }

  if (!global.__funeralDb) {
    global.__funeralDb = createSqliteDb();
  }

  return global.__funeralDb;
}

export { schema };
