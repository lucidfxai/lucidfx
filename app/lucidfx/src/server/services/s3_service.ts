import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

export class S3Service {
 private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  public async getSignedUrlPromise(): Promise<string> {
    const uniqueKey = await this.generateUniqueKey();
    const operation = 'putObject';
    const parameters = {
      Bucket: process.env.AWS_BUCKET_NAME || 'lucidfx-dev',
      Key: uniqueKey,
      Expires: 60,
    };
    return this.s3.getSignedUrlPromise(operation, parameters);
  }

  private async generateUniqueKey(): Promise<string> {
    const uuid = uuidv4();
    const uniqueKey = `${uuid}-${Date.now()}`;
    return uniqueKey;
  }
}

export const s3Service = new S3Service();
