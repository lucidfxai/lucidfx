import { InferModel } from 'drizzle-orm';
import { index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import getDb from '../connection';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
 
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 256 }),
  other: varchar('other', { length: 256 }),
}, (users) => ({
  nameIdx: index('name_idx').on(users.fullName),
}));
 
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>; // insert type

export async function insertUser(user: NewUser): Promise<MySqlRawQueryResult> {
  const db = getDb();
  return await db.insert(users).values(user);
}

export async function fetchUsers(): Promise<User[]> {
  const db = getDb();
  return await db.select().from(users);
}
