import { S3 } from 'aws-sdk';
import 'dotenv/config';

export class S3Service {
  private readonly s3: S3;
  private readonly bucket: string;
  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucket = process.env.AWS_BUCKET_NAME as string;
  }

  public async upload(name: string, buffer: Buffer): Promise<any> {
    const bucket = this.bucket;
    const params = { Bucket: bucket, Key: name, Body: buffer };
    const upload = await this.s3.upload(params).promise();
    return upload;
  }
}
