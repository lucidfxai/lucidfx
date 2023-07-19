import { ResultSetHeader } from 'mysql2';
import { endDb } from '../../../../server/db/connection';
import { insertFile, getFilesByUserId, NewFile, File, deleteFile, deleteAllFilesByUserId } from '../../../../server/db/schema/files'
import { insertUser, NewUser, deleteUser } from '../../../../server/db/schema/users'

describe('Files model integration tests', () => {
  let newUser: NewUser;
  let newFile: NewFile;
  let newFile2: NewFile;

  beforeEach(async () => {
    newUser = {
      user_id: 'test-user',
    };

    newFile = {
      user_id: newUser.user_id,
      unique_key: 'test-file',
      uploaded_at: new Date().toISOString(),
    };

    newFile2 = {
      user_id: newUser.user_id,
      unique_key: 'test-file2',
      uploaded_at: new Date().toISOString(),
    };

    // Insert new user and file before each test
    await insertUser(newUser);
    await insertFile(newFile);
  });

  afterEach(async () => {
    // Clean up after each test
    await deleteAllFilesByUserId(newUser.user_id!);
    await deleteUser(newUser.user_id!);
  });

  test('inserts a new file into the database', async () => {
    const files: File[] = await getFilesByUserId(newUser.user_id!);
    const fileExists = files.some(file => file.unique_key === newFile.unique_key!);
    expect(fileExists).toBe(true);
  });

  test('fetches files from the database', async () => {
    const files: File[] = await getFilesByUserId(newUser.user_id!);
    expect(files).toBeDefined();
    expect(files.length).toBeGreaterThan(0);
    const fileExists = files.some(file => file.unique_key === newFile.unique_key!);
    expect(fileExists).toBe(true);
  });

  test('deletes a file from the database', async () => {
    const result = await deleteFile(newFile.unique_key!);
    const resultSet = result[0] as ResultSetHeader;
    expect(resultSet.affectedRows).toBe(1);
  });

  test('verifies the file is deleted from the database', async () => {
    await deleteFile(newFile.unique_key!);
    const files: File[] = await getFilesByUserId(newUser.user_id!);
    const fileExists = files.some(file => file.unique_key === newFile.unique_key!);
    expect(fileExists).toBe(false);
  });

  test('deletes all files by user id from the database', async () => {
    await insertFile(newFile2);
    const result = await deleteAllFilesByUserId(newUser.user_id!);
    const resultSet = result[0] as ResultSetHeader;
    expect(resultSet.affectedRows).toBeGreaterThan(0);
  });

  test('verifies all files by user id are deleted from the database', async () => {
    await insertFile(newFile2);
    await deleteAllFilesByUserId(newUser.user_id!);
    const files: File[] = await getFilesByUserId(newUser.user_id!);
    expect(files).toBeDefined();
    expect(files.length).toBe(0);
  });

  afterAll(async () => {
    endDb();
  });
});

