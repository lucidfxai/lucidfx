/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { publicProcedure, router } from '~/server/trpc';
import { z } from 'zod';
import { connectDb } from '../../../db/connection';


// Define users array here
const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  // more users...
];


const db = connectDb().then(db => {
    console.log('db connected');
    console.log('use database here in this block');
  })
  .catch(console.error);


const appRouter = router({
  greeting: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        text: `hello ${input?.name ?? 'world'}`,
      };
    }),
  
  getUser: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(({ input }) => {
      // Use users array here
      const user = users.find(user => user.id === input.id);
      if (!user) throw new Error('User not found');
      return user;
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
