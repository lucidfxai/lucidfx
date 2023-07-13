import { S3Service } from '../../../src/server/services/s3_service'; 
import AWS from 'aws-sdk';

describe('S3Service Integration Test', () => {
  let s3Service: S3Service;
  const s3 = new AWS.S3();

  beforeEach(() => {
    s3Service = new S3Service();
  });

  it('should get signed URL correctly', async () => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: 'test-file.txt',
      Expires: 60 
    };

    const { url, uniqueKey } = await s3Service.getSignedUrlPromise();

    const response = await fetch(url, { method: 'PUT', body: 'Hello world' });

    expect(response.ok).toBe(true);  // The fetch API sets the ok property to true if the status is successful

    const s3Object = await s3.getObject({ Bucket: params.Bucket, Key: uniqueKey }).promise();
    if (s3Object.Body) { 
      expect(s3Object.Body.toString()).toBe('Hello world');
    } else {
      throw new Error('S3 object Body is undefined');
    }

    await s3.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise();
  });
});

