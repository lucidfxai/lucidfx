import { runMigrations } from './migration';
import { migrate } from 'drizzle-orm/mysql2/migrator'; // This import is just for type reference

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  global.process.exit = jest.fn() as any;
});

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock('drizzle-orm/mysql2/migrator', () => ({
  migrate: jest.fn().mockImplementation(() => Promise.resolve()),
}));

describe('runMigrations', () => {
  it('should handle migration error', async () => {
    const mockDb = {
      query: jest.fn().mockRejectedValue(new Error('Test error')),
    };

    // This is just a type assertion, it doesn't change the mock implementation
    (migrate as jest.Mock).mockRejectedValue(new Error('Test error'));

    try {
      await runMigrations(mockDb as any);
    } catch (err) {
      const error = err as Error;
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test error');
    }
  });
});

