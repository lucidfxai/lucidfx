// integrationTests/userModel.test.ts

import { insertUser, deleteUser, fetchUsers, NewUser, User } from '../../../src/db/schema/users'

describe('User model integration tests', () => {
  let newUser: NewUser;

  beforeAll(() => {
    newUser = {
      user_id: 'test-user',
    };
  });

  test('inserts a new user into the database', async () => {
    await insertUser(newUser);
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


  // test('deletes a user from the database', async () => {
  //   if (typeof newUser.user_id === 'string') { // Checking if newUser.user_id is not null or undefined
  //     const result = await deleteUser(newUser.user_id) as any; // Temporarily casting result to any
  //     expect(result.affectedRows).toBe(1); // Assuming result has a property affectedRows
  //   } else {
  //     throw new Error('User id is not defined'); // Throwing an error if newUser.user_id is not a string
  //   }
  // });
  //
  //
  // test('verifies the user is deleted from the database', async () => {
  //   const users: User[] = await fetchUsers();
  //
  //   const userExists = users.some(user => user.user_id === newUser.user_id);
  //   expect(userExists).toBe(false);
  // });
});

