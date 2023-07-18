import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { NewFile, deleteFile, insertFile } from '../db/schema/files';

export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  public getS3Instance() {
    return this.s3;
  }

  public async getSignedPutUrlPromise(): Promise<{url: string, uniqueKey: string}> {
    const uniqueKey = await this.generateUniqueKey();
    const operation = 'putObject';
    const parameters = {
      Bucket: process.env.AWS_BUCKET_NAME || 'lucidfx-dev',
      Key: uniqueKey,
      Expires: 60,
    };
    const url = await this.s3.getSignedUrlPromise(operation, parameters);
    return { url, uniqueKey };
  }


  private async generateUniqueKey(): Promise<string> {
    const uuid = uuidv4();
    const uniqueKey = `uuid-${uuid}-date-${Date.now()}`;
    return uniqueKey;
  }

  public async getSignedGetUrlPromise(s3Key: string): Promise<string> {
    const operation = 'getObject';
    const parameters = {
      Bucket: process.env.AWS_BUCKET_NAME || 'lucidfx-dev',
      Key: s3Key,
      Expires: 60 * 5, // the URL will be valid for 5 minutes
    };
    return this.s3.getSignedUrlPromise(operation, parameters);
  }

  public async addFileToFilesTableDbPromise(userId: string, uniqueKey: string): Promise<string> {
    console.log('addFileToFilesTableDbPromise', userId, uniqueKey);
    const file: NewFile = {
      user_id: userId,
      unique_key: uniqueKey,
      uploaded_at: new Date().toISOString(),
    };
    insertFile(file);
    return 'added file to files table in db successfully';
  }

  public async removeFileFromFilesTableDbPromise(userId: string, uniqueKey: string): Promise<string> {
    console.log('removeFileToFilesTableDbPromise', userId, uniqueKey);
    deleteFile(uniqueKey);
    return 'deleted file from files table in db successfully';
  }
}

export const s3Service = new S3Service();
