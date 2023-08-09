import getDb from "../db/connection";
import { FilesService } from "./files_service";
import { NewUser, User, users } from "../db/schema/users";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { ClerkService } from "./clerk_service";
import { S3Service } from "./s3_service";



export class UsersService {
  private filesService: FilesService;
  private clerkService: ClerkService;
  private s3Service: S3Service;

  constructor(filesService: FilesService,
              clerkService: ClerkService,
              s3Service: S3Service) {
    this.filesService = filesService;
    this.clerkService = clerkService;
    this.s3Service = s3Service;
  }

  public async insertUser(user: NewUser): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.insert(users).values(user);
  }

  public async deleteUserFromSystem(id: string): Promise<string> {
    await this.clerkService.deleteUser(id);
    const files = await this.filesService.getFilesByUserId(id);
    await this.s3Service.deleteMultipleObjects(files);
    await this.filesService.deleteAllFilesByUserId(id);
    await this.deleteUserFromUsers(id);
    return 'User deleted';
  }

  private async deleteUserFromUsers(id: string): Promise<string> {
    try {
      await this.deleteUserInUsersTable(id);
      return 'User deleted from database';
    } catch (error) {
      console.error(`Error deleting user from users table with id ${id}:`, error);
      throw new Error(`Error deleting user from users table with id ${id}: ${error}`);
    }
  }

  private async deleteUserInUsersTable(id: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.delete(users).where(eq(users.user_id, id));
  }

  async fetchUsers(): Promise<User[]> {
    const db = getDb();
    return await db.select().from(users);
  }

  async fetchUserById(id: string): Promise<User> {
    const db = getDb();
    const usersWithId = await db.select().from(users).where(eq(users.user_id, id));
    if (usersWithId.length === 0) {
      throw new Error(`User not found with id ${id}`);
    }
    return usersWithId[0];
  }
}
