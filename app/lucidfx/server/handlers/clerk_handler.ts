import type { NextApiRequest, NextApiResponse } from 'next'
import { Webhook, WebhookVerificationError } from 'svix';
import { NewUser } from '../db/schema/users';
import { usersService } from '../services/services_index';

export default async function clerkHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const event = req.body;
  console.log('Received event:', event);

  const headers = {
    "svix-id": req.headers["svix-id"] as string,
    "svix-timestamp": req.headers["svix-timestamp"] as string,
    "svix-signature": req.headers["svix-signature"] as string,
  };

  const secret = process.env.CLERK_SVIX_KEY;
  if (!secret) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
  const wh = new Webhook(secret);

  let verifiedEvent;
  try {
    // Throws on error, returns the verified content on success
    wh.verify(JSON.stringify(event), headers);
    verifiedEvent = event;
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      res.status(400).json({ message: 'Invalid webhook signature' });
      return;
    } else {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  // Only execute if payload is verified
  if (verifiedEvent) {
    switch (verifiedEvent.type) {
      case 'user.created':
        const newUser: NewUser = {
          user_id: verifiedEvent.data.id
        }
        await usersService.insertUser(newUser);
        break;
      case 'user.deleted':
        await usersService.deleteUserInDatabaseAfterManualDeletionInClerkWebUi(verifiedEvent.data.id);
        break;
    }
  }
  res.status(200).json({ message: 'Event received' });
  console.log('all users', await usersService.fetchUsers());
}
