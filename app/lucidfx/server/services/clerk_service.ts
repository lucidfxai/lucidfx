import clerk from '@clerk/clerk-sdk-node';

export class ClerkService {
  constructor() {}

  public async deleteUser(id: string): Promise<string> {
    try {
      const user = await clerk.users.getUser(id);
      if(!user) return 'User not found in clerk';
      await clerk.users.deleteUser(id);
      return 'User deleted from clerk';
    } catch (error) {
      console.error(`Error deleting user from clerk with id ${id}: ${error}`);
      return 'Error occurred';
    }
  }
}
