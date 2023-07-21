import { InferModel } from 'drizzle-orm';
import { index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
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
