import { insertUser, fetchUsers, users, NewUser, deleteUser } from '../schema/users';
import getDb from '../connection';
import { deleteAllFilesByUserId } from '../schema/files';

jest.mock('../connection');

jest.mock('../schema/files', () => ({
  ...jest.requireActual('../schema/files'),
  deleteAllFilesByUserId: jest.fn(),
}));

describe('schema users.ts tests', () => {
  type MockDb = {
    insert: jest.Mock<MockDb>;
    delete: jest.Mock<MockDb>;
    select: jest.Mock<MockDb>;
    from: jest.Mock<MockDb>;
    values: jest.Mock<MockDb>;
    where: jest.Mock<MockDb>;
  };

  const mockDb: MockDb = {
    insert: jest.fn<MockDb, []>(() => mockDb),
    delete: jest.fn<MockDb, []>(() => mockDb),
    select: jest.fn<MockDb, []>(() => mockDb),
    from: jest.fn<MockDb, []>(() => mockDb),
    values: jest.fn<MockDb, []>(() => mockDb),
    where: jest.fn<MockDb, []>(() => mockDb),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    (getDb as jest.Mock).mockReturnValue(mockDb);
  });

  it('should insert user correctly', async () => {
    const user: NewUser = { user_id: 'test_user' };

    await insertUser(user);

    expect(mockDb.insert).toHaveBeenCalledWith(users);
    expect(mockDb.values).toHaveBeenCalledWith(user);
  });

  it('should delete user correctly', async () => {
    const id = 'test_user';

    // Mock successful deletion of all files
    (deleteAllFilesByUserId as jest.Mock).mockResolvedValue(true);

    await deleteUser(id);

    expect(deleteAllFilesByUserId).toHaveBeenCalledWith(id);
    expect(mockDb.delete).toHaveBeenCalledWith(users);
    expect(mockDb.where).toHaveBeenCalledWith(expect.anything()); // first, ensure `where` was called
    expect(mockDb.where).toHaveBeenCalledWith(expect.objectContaining({
      queryChunks: expect.arrayContaining([  // we expect `queryChunks` to be an array
        expect.objectContaining({
          value: 'test_user',  // and one of the elements should have `value` property equal to 'test_user'
        }),
      ]),
    }));
  });

  it('should throw an error if file deletion fails', async () => {
    const id = 'test_user';

    // Mock unsuccessful deletion of files
    const errorMessage = 'Error deleting files';
    (deleteAllFilesByUserId as jest.Mock).mockRejectedValue(new Error(errorMessage));

    try {
      await deleteUser(id);
      fail('deleteUser should have thrown an error');
    } catch (error) {
      expect(deleteAllFilesByUserId).toHaveBeenCalledWith(id);
      expect(error).toEqual(new Error(`Error deleting user with id ${id}: Error: ${errorMessage}`));
    }
  });

  it('should fetch users correctly', async () => {
    await fetchUsers();

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(users);
  });
});

