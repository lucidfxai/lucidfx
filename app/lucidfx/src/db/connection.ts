import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import 'dotenv/config';


let db: MySql2Database<Record<string, unknown>> | undefined;
let pool: mysql.Pool | undefined;

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

async function initializeDb() {
  pool = mysql.createPool({
    ...connectionDetails,
    port: connectionDetails.port ? parseInt(connectionDetails.port) : undefined,
  });
  db = drizzle(pool);
  return db;
}

initializeDb().catch(err => {
  console.error('Error initializing database pool', err);
  process.exit(1);
});

export default function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export function endDb() {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool.end();
}

export async function initializeSingleConnectionDb() {
  const singleConnection = await mysql.createConnection({
    ...connectionDetails,
    port: connectionDetails.port ? parseInt(connectionDetails.port) : undefined,
  });
  const singleConnectionDb = drizzle(singleConnection);
  return singleConnectionDb;
}

