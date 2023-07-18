import { insertFile, deleteFile, files, NewFile } from '../schema/files';
import getDb from '../connection';

jest.mock('../connection');

describe('schema files.ts tests', () => {
  type MockDb = {
    insert: jest.Mock<MockDb>;
    delete: jest.Mock<MockDb>;
    values: jest.Mock<MockDb>;
    where: jest.Mock<MockDb>;
  };

  const mockDb: MockDb = {
    insert: jest.fn<MockDb, []>(() => mockDb),
    delete: jest.fn<MockDb, []>(() => mockDb),
    values: jest.fn<MockDb, []>(() => mockDb),
    where: jest.fn<MockDb, []>(() => mockDb),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    (getDb as jest.Mock).mockReturnValue(mockDb);
  });

  it('should insert file correctly', async () => {
    const file: NewFile = {
      user_id: 'test_user_insert_file_test',
      unique_key: 'file_key',
      uploaded_at: '2023-07-20T13:33:22.225Z'
    };

    await insertFile(file);

    expect(mockDb.insert).toHaveBeenCalledWith(files);
    expect(mockDb.values).toHaveBeenCalledWith(file);
  });

  it('should delete file correctly', async () => {
    const fileKey = 'file_key';

    await deleteFile(fileKey);

    expect(mockDb.delete).toHaveBeenCalledWith(files);
    expect(mockDb.where).toHaveBeenCalledWith(expect.anything()); // first, ensure `where` was called
    expect(mockDb.where).toHaveBeenCalledWith(expect.objectContaining({
      queryChunks: expect.arrayContaining([  // we expect `queryChunks` to be an array
        expect.objectContaining({
          value: 'file_key',  // and one of the elements should have `value` property equal to 'file_key'
        }),
      ]),
    }));
  });
});

