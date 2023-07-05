import { NextApiRequest, NextApiResponse } from 'next'
import clerkHandler from '../../../server/handlers/clerk_handler';
import handler from '../../../pages/api/webhooks/clerk';

jest.mock('../../../server/handlers/clerk_handler', () => jest.fn());

describe('API Routes: clerk', () => {
  it('calls clerkHandler correctly', async () => {
    const req = {} as NextApiRequest;
    const res = {} as NextApiResponse;

    await handler(req, res);

    expect(clerkHandler).toHaveBeenCalledWith(req, res);
  });
});

