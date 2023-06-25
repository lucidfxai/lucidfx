import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import 'dotenv/config';

let db: ReturnType<typeof drizzle> | undefined;
let connection: ReturnType<typeof connect> | undefined; 

export function getDb() {
  try {
    if (!db) {
      connection = connect({
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      });
      db = drizzle(connection);
    }
  } catch (error) {
      console.error('Failed to connect to the database: ', error);
  }
  return db;
}
