import { router } from "@repo/trpc";
import { appRouter as baseRouter } from "@repo/trpc";
import { pageRouter } from "./page";

/**
 * Main API router that combines all sub-routers
 */
export const apiRouter = router({
  // Include base example routes
  example: baseRouter,
  // Add page routes
  page: pageRouter,
});

// Export type for client
export type ApiRouter = typeof apiRouter;
