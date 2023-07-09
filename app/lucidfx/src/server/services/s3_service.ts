import { S3 } from 'aws-sdk';
import 'dotenv/config';

export interface CustomPutObjectRequest {
  ACL?: string;
  Body?: Buffer;
  Bucket: string;
  Key: string;
  Expires: number;
}

export class S3Service {
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  public async getSignedUrlPromise(operation: string, parameters: CustomPutObjectRequest): Promise<string> {
    return this.s3.getSignedUrlPromise(operation, parameters);
  }
}

export const s3Service = new S3Service();
