import { MySql2Database } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

export async function runMigrations(singleConnectionDb: MySql2Database<Record<string, unknown>>) { 
  try {
    await migrate(singleConnectionDb, { migrationsFolder: './drizzle' });
  } catch (error) {
    const err = error as Error & { sqlMessage?: string };
    console.error('Error:', err.sqlMessage || err.message);
  } 
  finally {
    console.log('Done');
    process.exit(0);
  }
}

