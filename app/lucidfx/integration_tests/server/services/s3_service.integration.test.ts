import { S3Service } from '../../../server/services/s3_service'; 
import { getFilesByUserId } from '../../../server/db/schema/files';
import AWS from 'aws-sdk';
import { NewUser, insertUser } from '../../../server/db/schema/users';

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

  it('should add file to files table correctly', async () => {
    const userId = 'test_userId_s3_service_integration_test';
    const uniqueKey = 'file_key';

    // Insert the user before adding the file
    const newUser: NewUser = {
        user_id: userId,
    };
    await insertUser(newUser);

    const response = await s3Service.addFileToFilesTableDbPromise(userId, uniqueKey);

    expect(response).toBe('added file to files table in db successfully');

    const files = await getFilesByUserId(userId);
    const file = files.find((file: any) => file.unique_key === uniqueKey);

    expect(file).toBeDefined();

    s3Service.removeFileFromFilesTableDbPromise(userId, uniqueKey);
  });
});

