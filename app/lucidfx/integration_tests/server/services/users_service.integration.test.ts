import { endDb } from '../../../server/db/connection';
import { NewUser, User } from '../../../server/db/schema/users'

import { UsersService } from '../../../server/services/users_service';
import { FilesService } from '../../../server/services/files_service';
import { S3Service } from '../../../server/services/s3_service';


describe('users_service integration tests', () => {
  let filesService: FilesService;
  let usersService: UsersService;
  let s3Service: S3Service;
  let newUser: NewUser;
  let newUser2: NewUser;
  let newUser3: NewUser;

  beforeAll(() => {
    s3Service = new S3Service();
    filesService = new FilesService(s3Service);
    usersService = new UsersService(filesService);

    const userId = 'test-user-files-service-integration-test';
    newUser = {
      user_id: userId,
    };
    const user2Id = 'test-user2-files-service-integration-test';
    newUser2 = {
      user_id: user2Id,
    };
    const user3Id = 'test-user3-files-service-integration-test';
    newUser3 = {
      user_id: user3Id,
    };
  });

  beforeEach(async () => {
    await usersService.insertUser(newUser);
    await usersService.insertUser(newUser2);
  });

  afterEach(async () => {
    await usersService.deleteUserInDatabase(newUser.user_id!);
    await usersService.deleteUserInDatabase(newUser2.user_id!);
  });

  test('inserts a new user into the database & is fetched correctly', async () => {
    await usersService.insertUser(newUser3);
    const users: User[] = await usersService.fetchUsers();
    const userExists = users.some(user => user.user_id === newUser.user_id);
    expect(userExists).toBe(true);

    await usersService.deleteUserInDatabase(newUser3.user_id!);
  });

  test('fetches users from the database', async () => {
    const users: User[] = await usersService.fetchUsers();
    expect(users).toBeDefined();
    const userExists = users.some(user => user.user_id === newUser.user_id);
    const user2Exists = users.some(user => user.user_id === newUser2.user_id);
    expect(userExists).toBe(true);
    expect(user2Exists).toBe(true);
  });

  test('deletes a user from the database', async () => {
    const users: User[] = await usersService.fetchUsers();
    const userExists = users.some(user => user.user_id === newUser.user_id);
    expect(userExists).toBe(true);
    await usersService.deleteUserInDatabase(newUser.user_id!);
    const usersAfterDeletion: User[] = await usersService.fetchUsers();
    const userExistsAfterDeletion = usersAfterDeletion.some(user => user.user_id === newUser.user_id);
    expect(userExistsAfterDeletion).toBe(false);
  });

  afterAll(async () => {
    endDb();
  });
});

