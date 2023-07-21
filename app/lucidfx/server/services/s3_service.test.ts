import { S3Service } from './s3_service';
import { FilesService } from './files_service';

const s3Service = new S3Service();
const filesService = new FilesService(s3Service);
const mockDeleteObjectPromise = jest.fn().mockResolvedValue({});

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn().mockImplementation(() => Promise.resolve('https://mocksignedurl.com')),
    deleteObject: jest.fn().mockImplementation(() => ({ promise: mockDeleteObjectPromise })),
  })),
}));

jest.mock('../db/schema/files', () => ({
  insertFile: jest.fn().mockImplementation(() => Promise.resolve({ insertId: 1 })),
}));

describe('S3Service', () => {
  let s3Service: S3Service;
  let mockGetSignedUrlPromise: jest.Mock;
  let mockDeleteObject: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    s3Service = new S3Service();
    mockGetSignedUrlPromise = (s3Service.getS3Instance() as any).getSignedUrlPromise;
    mockDeleteObject = (s3Service.getS3Instance() as any).deleteObject;
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

  it('should call deleteObject correctly', async () => {
    const mockKey = 'mock-file-key';
    await s3Service.deleteObject(mockKey);

    expect(mockDeleteObject).toHaveBeenCalled();
    expect((s3Service.getS3Instance() as any).deleteObject).toHaveBeenCalledWith({ Bucket: expect.any(String), Key: mockKey });
  });
});

