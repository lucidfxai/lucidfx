import 'dotenv/config';
import getDb from './connection';
import initializeDb from './connection';
import { MySql2Database } from 'drizzle-orm/mysql2';

describe('Database Connection', () => {
  it('should have correctly set DATABASE_URL env variable', async () => {
    expect(process.env.DATABASE_URL).toBeDefined();
  });
  it('should return db when db is initialized', async () => {
    let db: MySql2Database<Record<string, unknown>> | undefined;
    db = initializeDb();
    expect(getDb()).toEqual(db);
  });
});

