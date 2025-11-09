import { z } from "zod";
import { router, publicProcedure } from "./trpc";

/**
 * Example router with basic procedures
 * You can extend this with your own procedures
 */
export const appRouter = router({
  // Simple greeting procedure
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        message: `Hello, ${input.name}!`,
      };
    }),

  // Get current time
  getTime: publicProcedure.query(() => {
    return {
      time: new Date().toISOString(),
    };
  }),

  // Create item example
  createItem: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      // In a real app, you would save this to a database
      return {
        id: Math.random().toString(36).substring(7),
        name: input.name,
        description: input.description,
        createdAt: new Date().toISOString(),
      };
    }),
});

// Export type router type signature for client
export type AppRouter = typeof appRouter;
