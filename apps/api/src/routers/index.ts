import { router } from "../trpc/index.js";
import { userRouter } from "./user-router.js";

/**
 * Main API router that combines all sub-routers
 */
export const apiRouter = router({
  // User routes
  user: userRouter,
});

// Export type for client
export type ApiRouter = typeof apiRouter;
