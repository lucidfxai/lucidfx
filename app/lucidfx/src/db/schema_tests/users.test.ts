import { insertUser, fetchUsers, users, NewUser } from './users';
import getDb from '../connection';

jest.mock('../connection');

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

    await deleteUser(id);

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

  it('should fetch users correctly', async () => {
    await fetchUsers();

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(users);
  });
});

