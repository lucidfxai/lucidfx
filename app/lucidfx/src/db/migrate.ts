import { connectDb, runMigrations } from './connection';

async function migrateDatabase() {
  connectDb().then(db => {
    runMigrations(db);
  });
}

migrateDatabase();
