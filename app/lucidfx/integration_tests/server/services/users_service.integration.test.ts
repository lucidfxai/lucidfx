import { endDb } from '../../../server/db/connection';
import { NewUser, User } from '../../../server/db/schema/users'

import { UsersService } from '../../../server/services/users_service';
import { FilesService } from '../../../server/services/files_service';
import { S3Service } from '../../../server/services/s3_service';
import { ClerkService } from '../../../server/services/clerk_service';

describe('UsersService integration tests', () => {
  let usersService: UsersService;
  let filesService: FilesService;
  let clerkService: ClerkService;
  let s3Service: S3Service;

  beforeAll(async () => {
    // This would actually be a connection to your test database
    // await setupDatabaseConnection();

    // These would be the real instances, not mocks

    s3Service = new S3Service();
    filesService = new FilesService();
    clerkService = new ClerkService();

    usersService = new UsersService(filesService, clerkService, s3Service);
  });

  afterAll(async () => {
    // Clean up the database after tests
    // await teardownDatabaseConnection();
  });

  it('should insert and delete user correctly', async () => {
    const newUser = { id: 1, user_id: 'test_user' };
    await usersService.insertUser(newUser);

    const users = await usersService.fetchUsers();
    expect(users).toEqual(expect.arrayContaining([newUser]));

    await usersService.deleteUserFromSystem(newUser.user_id);
    const usersAfterDeletion = await usersService.fetchUsers();
    expect(usersAfterDeletion).toEqual(expect.not.arrayContaining([newUser]));
  });

  // More tests...
});
