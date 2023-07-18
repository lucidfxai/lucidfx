import { ResultSetHeader } from 'mysql2';
import { endDb } from '../../../../server/db/connection';
import { insertFile, getFilesByUserId, NewFile, File, deleteFile } from '../../../../server/db/schema/files'
import { insertUser, NewUser } from '../../../../server/db/schema/users'

describe('Files model integration tests', () => {
  let newUser: NewUser;
  let newFile: NewFile;

  beforeAll(() => {
    newUser = {
      user_id: 'test-user',
    };

    newFile = {
      user_id: newUser.user_id,
      unique_key: 'test-file',
      uploaded_at: new Date().toISOString(),
    };
  });

  test('inserts a new file into the database', async () => {
    await insertUser(newUser);
    await insertFile(newFile);
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
    const files: File[] = await getFilesByUserId(newUser.user_id!);
    const fileExists = files.some(file => file.unique_key === newFile.unique_key!);
    expect(fileExists).toBe(false);
  });

  afterAll(async () => {
    endDb();
  });
});

