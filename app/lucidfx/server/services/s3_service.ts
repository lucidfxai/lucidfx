import AWS, { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { File } from '../db/schema/files';

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

  async generateUniqueKey(): Promise<string> {
    const uuid = uuidv4();
    const uniqueKey = `uuid-${uuid}-date-${Date.now()}`;
    return uniqueKey;
  }

  public async getSignedGetUrlPromise(uniqueKey: string): Promise<string> {
    const operation = 'getObject';
    const parameters = {
      Bucket: process.env.AWS_BUCKET_NAME || 'lucidfx-dev',
      Key: uniqueKey,
      Expires: 60 * 5, // the URL will be valid for 5 minutes
    };
    return this.s3.getSignedUrlPromise(operation, parameters);
  }

  public async deleteObject(uniqueKey: string): Promise<AWS.S3.DeleteObjectOutput> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: uniqueKey,
      Expires: 60
    };
    return await this.s3.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise();
  }

  public async deleteMultipleObjects(files: File[]): Promise<string> {
    try {
      for (const file of files) {
        if (file.unique_key) {
          await this.deleteObject(file.unique_key);
        }
      }
      return 'Files deleted from S3';
    } catch (error) {
      console.error(`Error deleting files from S3:`, error);
      throw new Error(`Error deleting files from S3: ${error}`);
    }
  }
}

export const s3Service = new S3Service();
