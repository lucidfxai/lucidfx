import { InferModel } from 'drizzle-orm';
import { index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
 
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 256 }),
}, (users) => ({
  nameIdx: index('name_idx').on(users.user_id),
}));
 
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>; // insert type
