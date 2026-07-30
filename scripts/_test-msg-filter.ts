import { and, eq, inArray } from "drizzle-orm";
import { allRows } from "../src/lib/db/exec";
import { getDb } from "../src/lib/db/index";
import { commemorativeMessages, obituaries } from "../src/lib/db/schema";

async function main() {
  const db = getDb();

  const existsRows = await allRows(
    db
      .select({ id: obituaries.id, name: obituaries.name })
      .from(obituaries)
      .where(
        inArray(
          obituaries.id,
          db
            .select({ id: commemorativeMessages.obituaryId })
            .from(commemorativeMessages)
            .where(eq(commemorativeMessages.reviewed, false)),
        ),
      ),
  );

  console.log("inArray subquery:", existsRows);

  const counts = await allRows(
    db
      .select({
        obituaryId: commemorativeMessages.obituaryId,
      })
      .from(commemorativeMessages)
      .where(eq(commemorativeMessages.reviewed, false)),
  );
  console.log("unreviewed rows:", counts);
}

main().catch(console.error);
