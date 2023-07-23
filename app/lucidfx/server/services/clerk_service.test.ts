import clerk from '@clerk/clerk-sdk-node';
import { ClerkService } from './clerk_service';

// jest.mock('@clerk/clerk-sdk-node', () => ({
//   users: {
//     deleteUser: jest.fn(),
//     getUser: jest.fn(),
//   },
// }));

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
    await expect(clerkService.deleteUser(testUserId)).rejects.toThrow('User not found in clerk');
    expect(clerk.users.getUser).toHaveBeenCalledWith(testUserId);
    expect(clerk.users.deleteUser).not.toHaveBeenCalled();
  });

  it('should throw an error if deleteUser fails', async () => {
    const testUserId = 'test_user';
    (clerk.users.getUser as jest.Mock).mockResolvedValue({ id: testUserId }); // mock user existence
    (clerk.users.deleteUser as jest.Mock).mockRejectedValue(new Error('Test Error'));

    await expect(clerkService.deleteUser(testUserId)).rejects.toThrow('Test Error');
    expect(clerk.users.getUser).toHaveBeenCalledWith(testUserId);
    expect(clerk.users.deleteUser).toHaveBeenCalledWith(testUserId);
  });
});
