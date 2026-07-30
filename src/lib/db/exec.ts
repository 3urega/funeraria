import { getDatabaseDriver } from "@/lib/db/index";

type SqliteGet<T> = { get(): T | undefined };
type SqliteAll<T> = { all(): T[] };
type SqliteRun = { run(): unknown };

/** Ejecuta select y devuelve la primera fila (SQLite sync / Postgres async). */
export async function oneRow<T>(
  builder: SqliteGet<T> | PromiseLike<T[]>,
): Promise<T | undefined> {
  if (getDatabaseDriver() === "postgres") {
    const rows = (await builder) as T[];
    return rows[0];
  }
  return (builder as SqliteGet<T>).get();
}

/** Ejecuta select y devuelve todas las filas. */
export async function allRows<T>(
  builder: SqliteAll<T> | PromiseLike<T[]>,
): Promise<T[]> {
  if (getDatabaseDriver() === "postgres") {
    return (await builder) as T[];
  }
  return (builder as SqliteAll<T>).all();
}

/** Ejecuta insert/update/delete. */
export async function runSql(
  builder: SqliteRun | PromiseLike<unknown>,
): Promise<void> {
  if (getDatabaseDriver() === "postgres") {
    await builder;
    return;
  }
  (builder as SqliteRun).run();
}
