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

  it('should fetch user by id correctly', async () => {                         
    const newUser = { user_id: 'test_user_users_service_integration_test' };          
    await usersService.insertUser(newUser);     

    const fetchedUser = await usersService.fetchUserById(newUser.user_id);
    expect(fetchedUser.user_id).toBe(newUser.user_id);                                     
    
    await usersService.deleteUserFromSystem(newUser.user_id);                         
    
    await expect(usersService.fetchUserById(newUser.user_id)).rejects.toThrow(`User not found with id ${newUser.user_id}`);                      
  });

  it('should fetch all users correctly', async () => {                         
    const newUser1 = { user_id: 'test_user1_users_service_integration_test' };          
    await usersService.insertUser(newUser1);  

    const newUser2 = { user_id: 'test_user2_users_service_integration_test' };          
    await usersService.insertUser(newUser2);

    const fetchedUsers = await usersService.fetchUsers();
    const userIds = fetchedUsers.map(user => user.user_id);
    
    expect(userIds).toContain(newUser1.user_id);
    expect(userIds).toContain(newUser2.user_id);

    await usersService.deleteUserFromSystem(newUser1.user_id); 
    await usersService.deleteUserFromSystem(newUser2.user_id);                      
  });
});
