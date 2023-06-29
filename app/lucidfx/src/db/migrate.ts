import { runMigrations } from './connection';

async function migrateDatabase() {
  console.log("Running migrations");
  await runMigrations();
}

migrateDatabase().catch(console.error);

