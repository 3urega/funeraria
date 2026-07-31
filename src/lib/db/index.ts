import path from "path";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as sqliteSchema from "./schema.sqlite";
import * as pgSchema from "./schema.pg";

export type AppDb =
  | BetterSQLite3Database<typeof sqliteSchema>
  | PostgresJsDatabase<typeof pgSchema>;

export function getDatabaseDriver(): "sqlite" | "postgres" {
  const driver = process.env.DATABASE_DRIVER ?? "sqlite";
  return driver === "postgres" ? "postgres" : "sqlite";
}

declare global {
  // eslint-disable-next-line no-var
  var __funeralSqliteDb: BetterSQLite3Database<typeof sqliteSchema> | undefined;
  // eslint-disable-next-line no-var
  var __funeralPostgresDb: PostgresJsDatabase<typeof pgSchema> | undefined;
  // eslint-disable-next-line no-var
  var __funeralPostgresClient: import("postgres").Sql | undefined;
}

function createSqliteDb(): BetterSQLite3Database<typeof sqliteSchema> {
  // require evita cargar el nativo better-sqlite3 en Vercel (postgres)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3") as new (path: string) => {
    pragma: (s: string) => unknown;
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/better-sqlite3") as {
    drizzle: (
      client: InstanceType<typeof Database>,
      config: { schema: typeof sqliteSchema },
    ) => BetterSQLite3Database<typeof sqliteSchema>;
  };

  const dbPath = process.env.DATABASE_URL ?? "./data/dev.db";
  const resolved = path.isAbsolute(dbPath)
    ? dbPath
    : path.resolve(process.cwd(), dbPath);

  const sqlite = new Database(resolved);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema: sqliteSchema });
}

function createPostgresDb(): PostgresJsDatabase<typeof pgSchema> {
  if (global.__funeralPostgresDb) {
    return global.__funeralPostgresDb;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const postgres = require("postgres") as typeof import("postgres").default;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/postgres-js") as {
    drizzle: (
      client: import("postgres").Sql,
      config: { schema: typeof pgSchema },
    ) => PostgresJsDatabase<typeof pgSchema>;
  };

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required when DATABASE_DRIVER=postgres");
  }

  // Vercel/serverless: max 1 conexión por instancia + transaction pooler (6543)
  const poolMax = process.env.VERCEL === "1" ? 1 : 10;
  const client = postgres(url, {
    prepare: false,
    max: poolMax,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  global.__funeralPostgresClient = client;
  global.__funeralPostgresDb = drizzle(client, { schema: pgSchema });
  return global.__funeralPostgresDb;
}

export function getDb(): BetterSQLite3Database<typeof sqliteSchema> {
  if (getDatabaseDriver() === "postgres") {
    return createPostgresDb() as unknown as BetterSQLite3Database<
      typeof sqliteSchema
    >;
  }

  if (!global.__funeralSqliteDb) {
    global.__funeralSqliteDb = createSqliteDb();
  }
  return global.__funeralSqliteDb;
}

export { sqliteSchema as schema };
