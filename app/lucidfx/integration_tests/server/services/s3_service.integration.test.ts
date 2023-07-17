import { S3Service } from '../../../server/services/s3_service'; 
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

    const { url, uniqueKey } = await s3Service.getSignedPutUrlPromise();

    const response = await fetch(url, { method: 'PUT', body: 'Hello world' });

    expect(response.ok).toBe(true);

    const s3Object = await s3.getObject({ Bucket: params.Bucket, Key: uniqueKey }).promise();
    if (s3Object.Body) { 
      expect(s3Object.Body.toString()).toBe('Hello world');
    } else {
      throw new Error('S3 object Body is undefined');
    }

    await s3.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise();
  });

  it('should get signed get URL correctly', async () => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: 'test-file.txt',
      Expires: 60
    };

    const { url: uploadUrl, uniqueKey } = await s3Service.getSignedPutUrlPromise();
    const uploadResponse = await fetch(uploadUrl, { method: 'PUT', body: 'Hello world' });
    expect(uploadResponse.ok).toBe(true);

    const downloadUrl = await s3Service.getSignedGetUrlPromise(uniqueKey);

    const downloadResponse = await fetch(downloadUrl);
    expect(downloadResponse.ok).toBe(true);
    const downloadedFileContents = await downloadResponse.text();

    expect(downloadedFileContents).toBe('Hello world');

    await s3.deleteObject({ Bucket: params.Bucket, Key: uniqueKey }).promise();
  });

});

