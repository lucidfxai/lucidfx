// src/pages/api/webhooks/clerk.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { Webhook, WebhookVerificationError } from 'svix';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  console.log('Received headers:', headers)


  const secret = process.env.CLERK_SVIX_KEY;
  if (!secret) {
    console.error("CLERK_SVIX_KEY is not defined in your environment variables");
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
  const wh = new Webhook(secret);

  let verifiedEvent;
  try {
    // Throws on error, returns the verified content on success
    const verifiedPayload = wh.verify(JSON.stringify(event), headers);
    verifiedEvent = event;
    console.log('Verified payload:', verifiedPayload);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.error('Webhook verification failed:', err.message);
      res.status(400).json({ message: 'Invalid webhook signature' });
      return;
    } else {
      console.error('Unexpected error:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }

  // Only execute if payload is verified
  if (verifiedEvent) {
    switch (verifiedEvent.type) {
      case 'user.created':
        console.log(verifiedEvent.data.object + " created");
        break;
      case 'user.updated':
        console.log(verifiedEvent.data.object + " updated");
        break;
      case 'session.created':
        console.log("New session created: " + verifiedEvent.data.id);
        break;
      // ... handle other events
    }
  }
  res.status(200).json({ message: 'Event received' });
}


