import { index, int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
 
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 256 }),
  other: varchar('other', { length: 256 }),
}, (users) => ({
  nameIdx: index('name_idx').on(users.fullName),
}));
 
export const authOtps = mysqlTable('auth_otp', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 256 }),
  userId: int('user_id').references(() => users.id),
});
