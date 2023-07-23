import { FilesService } from '../services/files_service';
import { S3Service } from '../services/s3_service';
import getDb from '../db/connection';
import { files } from '../db/schema/files';
import { eq } from 'drizzle-orm';

jest.mock('../db/connection');
jest.mock('../services/s3_service');

describe('FilesService', () => {
  let mockS3Service: jest.Mocked<S3Service>;
  let filesService: FilesService;

  const mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    (getDb as jest.Mock).mockReturnValue(mockDb);
    mockS3Service = new S3Service() as jest.Mocked<S3Service>;
    filesService = new FilesService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert file to files table correctly', async () => {
    const userId = 'test_user';
    const uniqueKey = 'unique_key';
    await filesService.insertFileToFilesTablePromise(userId, uniqueKey);

    expect(mockDb.insert).toHaveBeenCalledWith(files);
    expect(mockDb.values).toHaveBeenCalled();
  });

  it('should get files by user id correctly', async () => {
    const userId = 'test_user';
    await filesService.getFilesByUserId(userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(files);
    expect(mockDb.where).toHaveBeenCalledWith(eq(files.user_id, userId));
  });

  it('should delete file correctly', async () => {
    const uniqueKey = 'unique_key';
    await filesService.deleteFile(uniqueKey);

    expect(mockDb.delete).toHaveBeenCalledWith(files);
    expect(mockDb.where).toHaveBeenCalledWith(eq(files.unique_key, uniqueKey));
  });

  it('should delete all files by user id correctly', async () => {
    const userId = 'test_user';
    const userFiles = [
      {
        unique_key: 'unique_key1',
        id: 1,
        user_id: userId,
        uploaded_at: new Date().toISOString()
      },
      {
        unique_key: 'unique_key2',
        id: 2,
        user_id: userId,
        uploaded_at: new Date().toISOString()
      }
    ];
    jest.spyOn(filesService, 'getFilesByUserId').mockResolvedValue(userFiles);

    await filesService.deleteAllFilesByUserId(userId);

    expect(mockDb.delete).toHaveBeenCalledWith(files);
    expect(mockDb.where).toHaveBeenCalledWith(eq(files.user_id, userId));
  });

  it('should fetch all files', async () => {
    await filesService.fetchFiles();

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(files);
  });
});

