import { InferModel, eq } from 'drizzle-orm';
import { index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import getDb from '../connection';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { users } from './users';

export const files = mysqlTable('files', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 256 }).references(() => users.user_id),
  unique_key: varchar('unique_key', { length: 256 }),
  uploaded_at: varchar('uploaded_at', { length: 256 })
}, (users) => ({
  nameIdx: index('name_idx').on(users.user_id),
}));

export type File = InferModel<typeof files>;
export type NewFile = InferModel<typeof files, 'insert'>; // insert type

export async function insertFile(file: NewFile): Promise<MySqlRawQueryResult> {
  const db = getDb();
  return await db.insert(files).values(file);
}

export async function deleteFile(uniqueKey: string): Promise<MySqlRawQueryResult> {
  const db = getDb();
  return await db.delete(files).where(eq(files.unique_key, uniqueKey));
}

export async function getFilesByUserId(user_id: string): Promise<File[]> {
  const db = getDb();
  return await db.select().from(files).where(eq(files.user_id, user_id));
}


