import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import 'dotenv/config';
import { CustomPutObjectRequest, S3Service } from '../../../src/server/services/s3_service';  // Change this path to your actual path

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => {
      return {
        getSignedUrlPromise: jest.fn().mockImplementation((operation, parameters) => {
          // Mock the behavior of getSignedUrlPromise
          // This is a simplified version that returns a predictable URL
          return Promise.resolve(`https://mock-s3-url/${parameters.Bucket}/${parameters.Key}`);
        })
      };
    })
  };
});

describe('S3Service Integration Test', () => {
  let s3Service: S3Service;

  beforeEach(() => {
    s3Service = new S3Service();
  });

  it('should get signed URL correctly', async () => {
    const parameters: CustomPutObjectRequest = {
      Bucket: 'test-bucket',
      Key: 'test-file.txt',
      Expires: 60// the URL will be valid for 60 seconds
    };

    const signedUrl = await s3Service.getSignedUrlPromise('putObject', parameters);

    expect(signedUrl).toEqual('https://mock-s3-url/test-bucket/test-file.txt');
  });
});

