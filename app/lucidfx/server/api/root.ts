import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { s3ServiceRouter } from "./routers/s3_service_router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  s3_service_router: s3ServiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
