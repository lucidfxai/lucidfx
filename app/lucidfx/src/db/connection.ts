import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import url from 'url';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL; // Your PlanetScale connection string

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
  return db;
}
// // Usage
// connectDb()
//   .then(db => {
//     // You can now use `db` here for your database operations
//   })
//   .catch(console.error);

