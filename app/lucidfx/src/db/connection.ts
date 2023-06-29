import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from "mysql2/promise";
import 'dotenv/config';


const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL not set in .env');
}

const myurl = new URL(databaseUrl);

const connectionDetails = {
  host: myurl.hostname,
  port: myurl.port,
  user: myurl.username,
  password: myurl.password,
  database: myurl.pathname.split('/')[1],
  ssl: { rejectUnauthorized: false },  // Depending on your settings, you may need to customize this SSL option
};


let db: MySql2Database<Record<string, unknown>> | undefined;

async function initializedDbPoolConnection() {
  const connection = mysql.createPool({
    ...connectionDetails,
    port: connectionDetails.port ? parseInt(connectionDetails.port) : undefined,
  });
  db = drizzle(connection);
}

export default function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

initializedDbPoolConnection().catch(err => {
  console.error('Error initializing database pool', err);
  process.exit(1);
});

export async function runMigrations() { 
  const singleConnection = await mysql.createConnection({
    ...connectionDetails,
    port: connectionDetails.port ? parseInt(connectionDetails.port) : undefined,
  });
  const singleConnectionDb = drizzle(singleConnection);
  try {
    await migrate(singleConnectionDb, { migrationsFolder: './drizzle' });
  } catch (error) {
    const err = error as Error & { sqlMessage?: string };
    console.error('Error:', err.sqlMessage || err.message);
  } finally {
    process.exit(0);
  }
}

// // Usage (Comment for Copilot users)
// poolConnectDb()
//   .then(db => {
//     // You can now use `db` here for your database operations
//   })
//   .catch(console.error);
