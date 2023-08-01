// integration_tests/pages/api/webhooks/clerk.integration.test.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookVerificationError } from 'svix';
import handler from '../../../../../src/pages/api/webhooks/clerk';
import 'dotenv/config';
import { FilesService } from '../../../../../server/services/files_service';
import { ClerkService } from '../../../../../server/services/clerk_service';
import { S3Service } from '../../../../../server/services/s3_service';
import { UsersService } from '../../../../../server/services/users_service';


// Add a test to make sure the webhook actually makes the call to our endpoint
// when a user is created.

// In the test setup
jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: jest.fn((payload, headers) => {
      if (payload === JSON.stringify({ data: { id: 'invalidPayload' } })) {
        throw new WebhookVerificationError('Mock verification error');
      }
      return 'verified_payload';
    }),
  })),
  WebhookVerificationError: jest.requireActual('svix').WebhookVerificationError,
}));

describe('Clerk Webhook Tests', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let usersService: UsersService;

  beforeAll(() => {
    const filesService = new FilesService();
    const clerkService = new ClerkService();
    const s3Service = new S3Service();
    usersService = new UsersService(filesService, clerkService, s3Service); 
  });

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        type: 'user.created',
        data: { id: 'test_id_clerk_integration', object: 'test_object' },
      },
      headers: {
        "svix-id": 'test_id',
        "svix-timestamp": 'test_timestamp',
        "svix-signature": 'test_signature',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    process.env.CLERK_SVIX_KEY = 'test_secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with 405 if method is not POST', async () => {
    req.method = 'GET';
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('should respond with 500 if CLERK_SVIX_KEY is not defined', async () => {
    delete process.env.CLERK_SVIX_KEY;
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should respond with 400 if webhook verification fails', async () => {
    req.body = { data: { id: 'invalidPayload' } };
    delete req.body.type;
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid webhook signature' });
  });

  it('should respond with 200 if webhook is verified and event is valid', async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
  });

  it('should call insertUser on "user.created" event', async () => {
    req.body.type = 'user.created';
    const user = { user_id: 'test_id_clerk_integration' }; // the user you're testing
    const userId = req.body.data.id;
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(await usersService.fetchUserById(userId)).toEqual(expect.objectContaining(user));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
    await usersService.deleteUserFromSystem(userId);
  });


  it('should call deleteUser on "user.deleted" event', async () => {
    req.body.type = 'user.created';
    const user = { user_id: 'test_id_clerk_integration' }; // the user you're testing
    const userId = req.body.data.id;
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(await usersService.fetchUserById(userId)).toEqual(expect.objectContaining(user));

    req.body.type = 'user.deleted';
    await handler(req as NextApiRequest, res as NextApiResponse);
    try {
      const deletedUser = await usersService.fetchUserById(userId);
      expect(deletedUser).not.toBeNull(); // This line should not be reached if the user was deleted
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', `User not found with id ${userId}`);
    }
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
  });
});


// Probably want to implement this integration test locally once we have funds
// to pay for ngrok to ensure our endpoint is working as expected with Clerk
// webhooks.
//
// Probably just set this up for staging.
//
//    CLERK API LIKELY BROKEN FOR NOW
//
// describe('Making real requests to the Clerk API', () => {
//   let req: Partial<NextApiRequest>;
//   let res: Partial<NextApiResponse>;
//   let userId: string;
//
//   beforeEach(async () => {
//     // Create a new user
//     console.log('create user', await clerk.users.createUser({
//       emailAddress: ['test@example.com'],
//       firstName: 'Test',
//       lastName: 'User'
//     }));
//   });
//   it('should call insertUser on "user.created" event', async () => {
//     req.body.type = {
//       type: 'user.created',
//       data: { id: userId },
//     };
//
//     await handler(req as NextApiRequest, res as NextApiResponse);
//
//     expect(insertUser).toHaveBeenCalledWith({ user_id: userId });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
//   });
// });
