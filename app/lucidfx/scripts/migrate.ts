import { runMigrations } from '../src/db/migration';
import { initializeSingleConnectionDb } from '../src/db/connection';

async function migrateDatabase() {
  const singleConnectionDb = await initializeSingleConnectionDb();
  console.log("Running migrations");
  await runMigrations(singleConnectionDb);
}

migrateDatabase().catch(console.error);

