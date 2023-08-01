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
    const newUser = { user_id: 'test_user_users_service_integration_test' };
    await usersService.insertUser(newUser);
    const users = await usersService.fetchUsers();
    // We map the users to an array of user_id to perform the match
    const userIds = users.map(user => user.user_id);
    expect(userIds).toContain(newUser.user_id);

    await usersService.deleteUserFromSystem(newUser.user_id);
    const usersAfterDeletion = await usersService.fetchUsers();
    const userIdsAfterDeletion = usersAfterDeletion.map(user => user.user_id);
    expect(userIdsAfterDeletion).not.toContain(newUser.user_id);
  });

  // More tests...
});
