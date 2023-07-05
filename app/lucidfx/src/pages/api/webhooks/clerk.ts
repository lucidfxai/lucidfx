// src/pages/api/webhooks/clerk.ts
import { NextApiRequest, NextApiResponse } from 'next'
import clerkHandler from '../../../server/handlers/clerk_handler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await clerkHandler(req, res);
}
