// src/pages/api/clerkWebhooks.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { NewUser, deleteUser, insertUser } from '~/db/schema/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const event = req.body;
  console.log('Received event:', event);

  // Make sure this is a valid event
  if (!event.data.id || !event.type) {
    res.status(400).json({ message: 'Invalid event' });
    return;
  }

  switch (event.type) {
    case 'user.created':
      // await db.user.create({ id: event.data.id, ...event.data.object });
      console.log(event.data.object + " created");
      console.log(event.data.id);
      const newUser: NewUser = {
        user_id: event.data.id
      }
      console.log(await insertUser(newUser));
      break;
    // case 'user.updated':
    //   // await db.user.update(event.data.id, event.data.object);
    //   console.log(event.data.object + " updated");
    //   break;
    case 'user.deleted':
      console.log("New session created: " + event.data.id);
      console.log(await deleteUser(event.data.id));
      break;
    // ... handle other events
  }


  res.status(200).json({ message: 'Event received' });
}


