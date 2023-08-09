jest.mock('@clerk/clerk-sdk-node', () => {
  return {
    users: {
      getUser: jest.fn(),
      deleteUser: jest.fn(),
    },
  };
});

import clerk from '@clerk/clerk-sdk-node';
import { ClerkService } from './clerk_service';


describe('ClerkService', () => {
  let clerkService: ClerkService;

  beforeEach(() => {
    jest.clearAllMocks();
    clerkService = new ClerkService();
  });

  it('should delete a user if user exists', async () => {
    const testUserId = 'test_user';
    (clerk.users.getUser as jest.Mock).mockResolvedValue({ id: testUserId }); // mock user existence
    await clerkService.deleteUser(testUserId);
    expect(clerk.users.getUser).toHaveBeenCalledWith(testUserId);
    expect(clerk.users.deleteUser).toHaveBeenCalledWith(testUserId);
  });

  it('should throw an error if user does not exist', async () => {
    const testUserId = 'non_existent_user';
    (clerk.users.getUser as jest.Mock).mockResolvedValue(null); // mock user non-existence
    const deleteUserResponse = await clerkService.deleteUser(testUserId);
    expect(deleteUserResponse).toEqual('User not found in clerk');
    expect(clerk.users.getUser).toHaveBeenCalledWith(testUserId);
    expect(clerk.users.deleteUser).not.toHaveBeenCalled();
  });

  it('should throw an error if deleteUser fails', async () => {
    const testUserId = 'test_user';
    (clerk.users.getUser as jest.Mock).mockResolvedValue({ id: testUserId }); // mock user existence
    (clerk.users.deleteUser as jest.Mock).mockRejectedValue(new Error('Test Error'));

    const result = await clerkService.deleteUser(testUserId);
    expect(result).toEqual('Error occurred');
    expect(clerk.users.getUser).toHaveBeenCalledWith(testUserId);
    expect(clerk.users.deleteUser).toHaveBeenCalledWith(testUserId);
  });
});
