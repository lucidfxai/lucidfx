import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import url from 'url';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL; // Your PlanetScale connection string

if (!databaseUrl) {
  throw new Error('DATABASE_URL not set in .env');
}

const params = url.parse(databaseUrl);

if (!params.auth || !params.hostname || !params.pathname) {
  throw new Error('Invalid DATABASE_URL format');
}

const [username, password] = params.auth.split(':');
const database = params.pathname.split('/')[1];

if (!username || !password || !database) {
  throw new Error('Invalid auth or database format in DATABASE_URL');
}

const connectionDetails = {
  host: params.hostname,
  port: params.port,
  user: username,
  password,
  database,
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

