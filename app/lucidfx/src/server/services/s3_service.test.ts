import { S3Service } from './s3_service';

const mS3Instance = {
  upload: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mS3Instance) };
});

describe('S3Service', () => {
  beforeEach(() => {
    process.env.AWS_ACCESS_KEY = 'accessKeyId';
    process.env.AWS_SECRET_ACCESS_KEY = 'secretAccessKey';
    process.env.AWS_REGION = 'us-east';
    process.env.AWS_BUCKET_NAME = 'bucket-dev';
  });

  it('should upload correctly', async () => {
    mS3Instance.promise.mockResolvedValueOnce('fake response');
    const s3Service = new S3Service();
    const actual = await s3Service.upload('name', Buffer.from('ok'));
    expect(actual).toEqual('fake response');
    expect(mS3Instance.upload).toBeCalledWith({ Bucket: 'bucket-dev', Key: 'name', Body: Buffer.from('ok') });
  });
});

