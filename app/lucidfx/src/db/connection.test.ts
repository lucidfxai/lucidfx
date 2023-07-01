import 'dotenv/config';

describe('Database Connection', () => {
  it('should have correctly set DATABASE_URL env variable', async () => {
    expect(process.env.DATABASE_URL).toBeDefined();
  });
});
