import { runMigrations } from '../server/db/migration';
import { initializeSingleConnectionDb } from '../server/db/connection';

async function migrateDatabase() {
  const singleConnectionDb = await initializeSingleConnectionDb();
  console.log("Running migrations");
  await runMigrations(singleConnectionDb);
}

migrateDatabase().catch(console.error);

