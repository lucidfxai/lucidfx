import { publicProcedure, router } from './trpc';
import { z } from 'zod';

export const appRouter = router({
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
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;
