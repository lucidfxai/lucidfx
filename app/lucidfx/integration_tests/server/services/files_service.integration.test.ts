import { endDb } from '../../../server/db/connection';
import { UsersService } from '../../../server/services/users_service';
import { FilesService } from '../../../server/services/files_service';
import { S3Service } from '../../../server/services/s3_service';
import { NewUser } from '../../../server/db/schema/users';
import { ResultSetHeader } from 'mysql2';
import { NewFile } from 'server/db/schema/files';


type FileData = {
  id: number;
  user_id: string | null;
  unique_key: string | null;
  uploaded_at: string | null;
}

describe('FilesService integration tests', () => {
  let filesService: FilesService;
  let usersService: UsersService;
  let s3Service: S3Service;


  beforeAll(() => {
    s3Service = new S3Service();
    filesService = new FilesService(s3Service);
    usersService = new UsersService(filesService);
  });

  let newUser: NewUser;
  let newFile: NewFile;
  let newFile2: NewFile;

  beforeEach(async () => {
    const userId = 'test-user-files-service-integration-test';
    const uniqueKey1 = 'test-file-unique-key-files-service-integration-test';
    const uniqueKey2 = 'test-file-unique-key-files-service-integration-test-2';

    newUser = {
      user_id: userId,
    };

    newFile = {
      user_id: userId,
      unique_key: uniqueKey1,
      uploaded_at: new Date().toISOString(),
    };

    newFile2 = {
      user_id: userId,
      unique_key: uniqueKey2,
      uploaded_at: new Date().toISOString(),
    };

    await usersService.insertUser(newUser);
  });

  afterEach(async () => {
    await filesService.deleteAllFilesByUserId(newUser.user_id!);
    await usersService.deleteUserInDatabase(newUser.user_id!);
  });

  test('inserts a new file into the database', async () => {
    await filesService.insertFileToFilesTablePromise(newUser.user_id!, newFile.unique_key!);
    const files: FileData[] = await filesService.getFilesByUserId(newUser.user_id!);
    const fileExists = files.some(file => file.unique_key === newFile.unique_key!);
    expect(fileExists).toBe(true);
  });

  test('fetches files from the database', async () => {
    await filesService.insertFileToFilesTablePromise(newUser.user_id!, newFile.unique_key!);
    const files = await filesService.fetchFiles();
    expect(files).toBeDefined();
    const fileExists = files.some(file => file.unique_key === newFile.unique_key);
    expect(fileExists).toBe(true);
  });

  test('deletes a file from the database', async () => {
    await filesService.insertFileToFilesTablePromise(newUser.user_id!, newFile.unique_key!);
    const files = await filesService.fetchFiles();
    const fileExists = files.some(file => file.unique_key === newFile.unique_key);
    expect(fileExists).toBe(true);

    const result = await filesService.deleteFile(newFile.unique_key!);
    const resultSet = result[0] as ResultSetHeader;
    expect(resultSet.affectedRows).toBe(1);

    const filesAfterDelete = await filesService.fetchFiles();
    const fileExistsAfterDelete = filesAfterDelete.some(file => file.unique_key === newFile.unique_key);
    expect(fileExistsAfterDelete).toBe(false);
  });

  test('verifies the file is deleted from the database', async () => {
    await filesService.insertFileToFilesTablePromise(newUser.user_id!, newFile.unique_key!);
    await filesService.deleteFile(newFile.unique_key!);
    const files = await filesService.getFilesByUserId(newUser.user_id!);
    const fileExists = files.some(file => file.unique_key === newFile.unique_key);
    expect(fileExists).toBe(false);
  });

  test('deletes and verifies deleted all files by user id from the database', async () => {
    await filesService.insertFileToFilesTablePromise(newUser.user_id!, newFile.unique_key!);
    await filesService.insertFileToFilesTablePromise(newUser.user_id!, newFile2.unique_key!);
    const files: FileData[] = await filesService.getFilesByUserId(newUser.user_id!);
    expect(files.length).toBe(2);
    const result = await filesService.deleteAllFilesByUserId(newUser.user_id!);
    expect(result).toBeDefined();
    const filesAfterDelete: FileData[] = await filesService.getFilesByUserId(newUser.user_id!);
    expect(filesAfterDelete.length).toBe(0);
  });

  afterAll(async () => {
    endDb();
  });
});

