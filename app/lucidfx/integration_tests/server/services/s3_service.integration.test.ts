import { S3Service } from '../../../server/services/s3_service'; 
import { FilesService } from '../../../server/services/files_service';
import AWS from 'aws-sdk';

describe('S3Service Integration Test', () => {
  let s3Service: S3Service;
  let s3: AWS.S3;
  let filesService: FilesService;

  beforeAll(() => {
    s3Service = new S3Service();
    s3 = new AWS.S3();
  });

  beforeEach(() => {
    s3Service = new S3Service();
    filesService = new FilesService(s3Service);
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

  it('should getSignedGetURLPromise && getSignedPutUrlPromise correctly ' +
    'and correctly upload and download a file', async () => {
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

  it('should delete an object from S3 bucket', async () => {
    // Insert a test file into the S3 bucket
    const uniqueKey = 'test-file-key-s3_service_integration_test';
    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: uniqueKey,
      Body: 'Test file content'
    }).promise();

    // Call the method under test
    await s3Service.deleteObject(uniqueKey);

    // Verify that the file no longer exists in the bucket
    try {
      await s3.getObject({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: uniqueKey
      }).promise();
      fail('The file should have been deleted, but was still found in the bucket');
    } catch (err) {
      if (err instanceof Error) {
        expect(err.message).toBe('The specified key does not exist.');
      } else {
        fail('Expected error, got something else');
      }
    }
  });
});
