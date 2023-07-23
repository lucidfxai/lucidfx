import clerk from '@clerk/clerk-sdk-node';

export class ClerkService {
  constructor() {}

  public async deleteUser(id: string): Promise<string> {
    try {
      const user = await clerk.users.getUser(id);
      await clerk.users.deleteUser(id);
      return 'User deleted from clerk';
    } catch (error) {
      new Error(`Error deleting user from clerk with id ${id}: ${error}`);
      return 'User not found in clerk'
    }
  }
}
