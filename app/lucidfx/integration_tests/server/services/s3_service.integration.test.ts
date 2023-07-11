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
      Expires: 300  // the URL will be valid for 300 seconds (5 minutes)
    };

    const signedUrl = await s3Service.getSignedUrlPromise('putObject', params);

    // Use fetch or any http client to PUT object. Here, 'node-fetch' is used.
    const response = await fetch(signedUrl, { method: 'PUT', body: 'Hello world' });

    expect(response.ok).toBe(true);  // The fetch API sets the ok property to true if the status is successful

    // Optionally, you can further verify that the object was correctly written
    // We only include Bucket and Key in params for getObject call
    const s3Object = await s3.getObject({ Bucket: params.Bucket, Key: params.Key }).promise();
    if (s3Object.Body) {  // Check if Body is defined before using it
      expect(s3Object.Body.toString()).toBe('Hello world');
    } else {
      throw new Error('S3 object Body is undefined');
    }

    // Cleanup the object after test
    // We only include Bucket and Key in params for deleteObject call
    await s3.deleteObject({ Bucket: params.Bucket, Key: params.Key }).promise();
  });
});

