import { runMigrations } from '../src/server/db/migration';
import { initializeSingleConnectionDb } from '../src/server/db/connection';

async function migrateDatabase() {
  const singleConnectionDb = await initializeSingleConnectionDb();
  console.log("Running migrations");
  await runMigrations(singleConnectionDb);
}

migrateDatabase().catch(console.error);

