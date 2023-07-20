import { InferModel, eq } from 'drizzle-orm';
import { index, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';
import getDb from '../connection';
import { MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { deleteUser, fetchUsers, insertUser, users } from './users';
import AWS from 'aws-sdk';

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


export async function insertFile(file: NewFile): Promise<MySqlRawQueryResult> {
  const db = getDb();
  return await db.insert(files).values(file);
}

export async function deleteFile(uniqueKey: string): Promise<MySqlRawQueryResult> {
  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: uniqueKey,
    Expires: 60 
  };

  await s3.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise();
  const db = getDb();
  return await db.delete(files).where(eq(files.unique_key, uniqueKey));
}

export async function getFilesByUserId(user_id: string): Promise<File[]> {
  const db = getDb();
  return await db.select().from(files).where(eq(files.user_id, user_id));
}

export async function deleteAllFilesByUserId(user_id: string): Promise<MySqlRawQueryResult> {
  const db = getDb();
  const userFiles = await getFilesByUserId(user_id);
  const s3 = new AWS.S3();

  for (const file of userFiles) {
    if (file.unique_key) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: file.unique_key
      };
      await s3.deleteObject(params).promise();
      await db.delete(files).where(eq(files.unique_key, file.unique_key));
    }
  }
  return await db.delete(files).where(eq(files.user_id, user_id));
}

export async function fetchFiles(): Promise<File[]> {
  const db = getDb();
  return await db.select().from(files);
}
