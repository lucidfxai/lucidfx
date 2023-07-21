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


// const filesService = new FilesService(new S3Service());
//
// export async function insertUser(user: NewUser): Promise<MySqlRawQueryResult> {
//   const db = getDb();
//   return await db.insert(users).values(user);
// }
//
// export async function deleteUser(id: string): Promise<MySqlRawQueryResult> {
//   const db = getDb();
//   try {
//     await clerk.users.deleteUser(id);
//     await filesService.deleteAllFilesByUserId(id);
//     return await db.delete(users).where(eq(users.user_id, id));
//   } catch (error) {
//     console.error(`Error deleting user with id ${id}:`, error);
//     throw new Error(`Error deleting user with id ${id}: ${error}`);
//   }
// }
//
// export async function fetchUsers(): Promise<User[]> {
//   const db = getDb();
//   return await db.select().from(users);
// }
