import { NextApiRequest, NextApiResponse } from 'next';
import { Webhook, WebhookVerificationError } from 'svix';
import handler from './clerk_handler';
import { usersService } from '../services/services_index';

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

jest.mock('../services/services_index', () => ({
  usersService: {
    insertUser: jest.fn(),
    deleteUser: jest.fn(),
    deleteUserFromSystem: jest.fn(),  // Mock the method
    fetchUsers: jest.fn(),
  }
}));

describe('Clerk Webhook Tests', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        type: 'user.created',
        data: { id: 'test_id', object: 'test_object' },
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

    it('should call insertUser on "user.created" event', async () => {
    req.body.type = 'user.created';
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(usersService.insertUser).toHaveBeenCalledWith({ user_id: 'test_id' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
  });

  it('should call deleteUser on "user.deleted" event', async () => {
    req.body.type = 'user.deleted';
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(usersService.deleteUserFromSystem).toHaveBeenCalledWith('test_id');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
  });

  it('should respond with 200 if webhook is verified and event is valid', async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event received' });
  });

  it('should handle unexpected errors gracefully', async () => {
    (Webhook as unknown as jest.Mock).mockImplementationOnce(() => ({
      verify: () => { throw new Error('Unexpected error'); },
    }));
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
