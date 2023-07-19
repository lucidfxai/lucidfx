import { ResultSetHeader } from 'mysql2';
import { endDb } from '../../../../server/db/connection';
import { insertUser, fetchUsers, NewUser, User, deleteUser } from '../../../../server/db/schema/users'

describe('User model integration tests', () => {
  let newUser: NewUser;

  beforeEach(async () => {
    newUser = {
      user_id: 'test-user-integration',
    };

    // Insert new user before each test
    await insertUser(newUser);
  });

  afterEach(async () => {
    // Clean up after each test
    if (typeof newUser.user_id === 'string') {
      await deleteUser(newUser.user_id).catch((error) => console.error(error));
    }
  });

  test('inserts a new user into the database', async () => {
    const users: User[] = await fetchUsers();
    const userExists = users.some(user => user.user_id === newUser.user_id);
    expect(userExists).toBe(true);
  });

  test('fetches users from the database', async () => {
    const users: User[] = await fetchUsers();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    const userExists = users.some(user => user.user_id === newUser.user_id);
    expect(userExists).toBe(true);
  });

  test('deletes a user from the database', async () => {
    if (typeof newUser.user_id === 'string') {
      const result = await deleteUser(newUser.user_id);
      const resultSet = result[0] as ResultSetHeader;
      expect(resultSet.affectedRows).toBe(1);
    } else {
      throw new Error('User id is not defined');
    }
  });

  test('verifies the user is deleted from the database', async () => {
    if (typeof newUser.user_id === 'string') {
      await deleteUser(newUser.user_id);
    }
    const users: User[] = await fetchUsers();
    const userExists = users.some(user => user.user_id === newUser.user_id);
    expect(userExists).toBe(false);
  });

  afterAll(async () => {
    endDb();
  });
});

