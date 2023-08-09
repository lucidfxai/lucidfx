// files_service.ts
import { NewFile, File, files } from '../db/schema/files';
import getDb from '../db/connection';
import { eq } from 'drizzle-orm';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';

export class FilesService {

  constructor() {}

  async insertFileToFilesTablePromise(userId: string, uniqueKey: string): Promise<MySqlRawQueryResult> {
    const file: NewFile = {
      user_id: userId,
      unique_key: uniqueKey,
      uploaded_at: new Date().toISOString(),
    };
    const db = getDb();
    return await db.insert(files).values(file);
  }

  public async getFilesByUserId(user_id: string): Promise<File[]> {
    const db = getDb();
    return await db.select().from(files).where(eq(files.user_id, user_id));
  }

  async deleteFile(uniqueKey: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.delete(files).where(eq(files.unique_key, uniqueKey));
  }

  async deleteAllFilesByUserId(user_id: string): Promise<MySqlRawQueryResult> {
    const db = getDb();
    return await db.delete(files).where(eq(files.user_id, user_id));
  }

  async fetchFiles(): Promise<File[]> {
    const db = getDb();
    return await db.select().from(files);
  }
}
