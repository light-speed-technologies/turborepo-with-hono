import { router } from "../trpc";
import { pageRouter } from "./page";
import { userRouter } from "./user-router";

/**
 * Main API router that combines all sub-routers
 */
export const apiRouter = router({
  // Page routes
  page: pageRouter,
  // User routes
  user: userRouter,
});

// Export type for client
export type ApiRouter = typeof apiRouter;
