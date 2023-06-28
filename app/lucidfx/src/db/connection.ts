import { drizzle } from "drizzle-orm/mysql2";
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

export async function connectDb() {
  const connection = await mysql.createConnection({
    ...connectionDetails,
    port: connectionDetails.port ? parseInt(connectionDetails.port) : undefined,
  });
  const db = drizzle(connection);

  /* Automation for ensuring up-to-date migrations during local development */
  /* This is not required for staging/production, as migrations will be run
   * through CI/CD. To create new migrations, refer to the README.md */
  if (databaseUrl && databaseUrl.includes('localhost')) {
    try {
      await migrate(db, { migrationsFolder: './drizzle' });
    } catch (error) {
      const err = error as Error & { sqlMessage?: string };
      console.error('Error:', err.sqlMessage || err.message);
    }
  }

  return db;
}

// // Usage
// connectDb()
//   .then(db => {
//     // You can now use `db` here for your database operations
//   })
//   .catch(console.error);

