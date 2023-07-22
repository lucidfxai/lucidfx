// files_service.ts
import { NewFile, File, files } from '../db/schema/files';
import { S3Service } from './s3_service';
import getDb from '../db/connection';
import { eq } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

export class FilesService {
  private s3Service: S3Service;

  constructor(s3Service: S3Service) {
    this.s3Service = s3Service;
  }

  async insertFileToFilesTablePromise(userId: string, uniqueKey: string): Promise<MySqlRawQueryResult> {
    const file: NewFile = {
      user_id: userId,
      unique_key: uniqueKey,
      uploaded_at: new Date().toISOString(),
    };
    const db = getDb();
    return await db.insert(files).values(file);
  }

  async getFilesByUserId(user_id: string): Promise<File[]> {
    const db = getDb();
    return await db.select().from(files).where(eq(files.user_id, user_id));
  }

  async deleteFile(uniqueKey: string): Promise<MySqlRawQueryResult> {
    await this.s3Service.deleteObject(uniqueKey);
    const db = getDb();
    return await db.delete(files).where(eq(files.unique_key, uniqueKey));
  }

  async deleteAllFilesByUserId(user_id: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    const userFiles = await this.getFilesByUserId(user_id);

    for (const file of userFiles) {
      if (file.unique_key) {
        // delete in s3
        await this.s3Service.deleteObject(file.unique_key);
      }
    }
    return await db.delete(files).where(eq(files.user_id, user_id));
  }

  async fetchFiles(): Promise<File[]> {
    const db = getDb();
    return await db.select().from(files);
  }
}
