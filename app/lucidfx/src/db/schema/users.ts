import { index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
 
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 256 }),
  other: varchar('other', { length: 256 }),
}, (users) => ({
  nameIdx: index('name_idx').on(users.fullName),
}));
 
