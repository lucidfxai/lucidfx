import { singleClientConnectDb, runMigrations } from './connection';

async function migrateDatabase() {
  singleClientConnectDb().then(async db => {
    await runMigrations(db);
  });
}

migrateDatabase().catch(console.error);

