import { S3Service } from './s3_service';
import { insertFile } from '../db/schema/files';

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn().mockImplementation(() => Promise.resolve('https://mocksignedurl.com')),
  })),
}));

jest.mock('../db/schema/files', () => ({
  insertFile: jest.fn().mockImplementation(() => Promise.resolve({ insertId: 1 })),
}));

describe('S3Service', () => {
  let s3Service: S3Service;
  let mockGetSignedUrlPromise: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    s3Service = new S3Service();
    mockGetSignedUrlPromise = (s3Service.getS3Instance() as any).getSignedUrlPromise;
  });

  it('should create an instance correctly', () => {
    expect(s3Service).toBeDefined();
  });

  it('should call getSignedUrlPromise correctly', async () => {
    const mockUrl = 'https://mocksignedurl.com';

    const response = await s3Service.getSignedPutUrlPromise();

    expect(response.url).toEqual(mockUrl);
    expect(typeof response.uniqueKey).toEqual('string');
    expect(response.uniqueKey).toBeTruthy(); // checks that uniqueKey is not an empty string
    expect(response.uniqueKey).toMatch(/uuid-.*-date-.*/);
    expect(mockGetSignedUrlPromise).toBeCalledWith('putObject', expect.objectContaining({
      Bucket: expect.any(String),
      Key: expect.any(String),
      Expires: 60
    }));
  });

  it('should call getSignedGetUrlPromise correctly (which is a download link)', async () => {
    const mockUrl = 'https://mocksignedurl.com';

    // Mock the getSignedUrlPromise method for 'getObject' operation
    mockGetSignedUrlPromise.mockImplementation((operation, params) => {
      if (operation === 'getObject') {
        return Promise.resolve(mockUrl);
      }
      return Promise.resolve('https://mocksignedurl.com');
    });

    const mockKey = 'mock-file-key';
    const response = await s3Service.getSignedGetUrlPromise(mockKey);

    // The response should be the mockUrl
    expect(response).toEqual(mockUrl);
    
    // Verify the getSignedUrlPromise method was called with correct parameters
    expect(mockGetSignedUrlPromise).toBeCalledWith('getObject', {
      Bucket: expect.any(String),
      Key: mockKey,
      Expires: 60 * 5
    });
  });

  it('should call addFileToFilesTableDbPromise correctly', async () => {
    const mockUserId = 'test_user';
    const mockUniqueKey = 'file_key';

    const response = await s3Service.addFileToFilesTableDbPromise(mockUserId, mockUniqueKey);

    expect(response).toEqual('added file to files table in db successfully');

    // Verify the insertFile method was called with correct parameters
    expect(insertFile).toBeCalledWith({
      user_id: mockUserId,
      unique_key: mockUniqueKey,
      uploaded_at: expect.any(String),
    });
  });
});
