import getDb from "../db/connection";
import { FilesService } from "./files_service";
import { NewUser, User, users } from "../db/schema/users";
import { File } from "../db/schema/files";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import clerk from '@clerk/clerk-sdk-node';
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

  async insertUser(user: NewUser): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.insert(users).values(user);
  }

  public async deleteUserFromSystem(id: string): Promise<string> {
    await this.deleteUserInClerk(id);
    const files = await this.filesService.getFilesByUserId(id);
    await this.deleteMultipleFilesInS3(files);
    await this.deleteAllFilesByUserId(id);
    await this.deleteUserFromUsers(id);
    return 'User deleted';
  }

  private async deleteUserInClerk(id: string): Promise<string> {
    try {
      // await clerk.users.deleteUser(id);
      await this.clerkService.deleteUser(id);
      return 'User deleted from clerk';
    } catch (error) {
      console.error(`Error deleting user from clerk with id ${id}:`, error);
      throw new Error(`Error deleting user from clerk with id ${id}: ${error}`);
    }
  }

  private async deleteMultipleFilesInS3(files: File[]): Promise<string> {
    try {
      await this.s3Service.deleteMultipleObjects(files);
      return 'Files deleted from S3';
    } catch (error) {
      console.error(`Error deleting files from S3:`, error);
      throw new Error(`Error deleting files from S3: ${error}`);
    }
  }

  private async deleteAllFilesByUserId(id: string): Promise<string> {
    try {
      await this.filesService.deleteAllFilesByUserId(id);
      return 'User deleted from files';
    } catch (error) {
      console.error(`Error deleting all files for user in files table with id ${id}:`, error);
      throw new Error(`Error deleting all files for user in files table with id ${id}: ${error}`);
    }
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
}
