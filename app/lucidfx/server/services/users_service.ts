import getDb from "../db/connection";
import { FilesService } from "./files_service";
import { NewUser, User, users } from "../db/schema/users";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import clerk from '@clerk/clerk-sdk-node';
import { eq } from "drizzle-orm";


export class UsersService {
  private filesService: FilesService;

  constructor(filesService: FilesService) {
    this.filesService = filesService;
  }

  async insertUser(user: NewUser): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.insert(users).values(user);
  }

  // add proper error handling

  async deleteUserInDbAndClerk(id: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    try {
      await clerk.users.deleteUser(id);
      clerk.users.createUser({})
      await this.filesService.deleteAllFilesByUserId(id);
      return await db.delete(users).where(eq(users.user_id, id));
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw new Error(`Error deleting user with id ${id}: ${error}`);
    }
  }

  //private 
  async deleteUserInDatabase(id: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    try {
      await this.filesService.deleteAllFilesByUserId(id);
      return await db.delete(users).where(eq(users.user_id, id));
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw new Error(`Error deleting user with id ${id}: ${error}`);
    }
  }

  async deleteUserInUsersTable(id: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.delete(users).where(eq(users.user_id, id));
  }

  async fetchUsers(): Promise<User[]> {
    const db = getDb();
    return await db.select().from(users);
  }
}
