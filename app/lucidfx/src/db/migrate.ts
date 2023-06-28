import { connectDb, runMigrations } from './connection';

async function migrateDatabase() {
  connectDb().then(async db => {
    await runMigrations(db);
  });
}

migrateDatabase().catch(console.error);

