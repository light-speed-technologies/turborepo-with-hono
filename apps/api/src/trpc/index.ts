import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import { ZodError } from "zod";
import { createAuthMiddleware } from "../middleware/auth";

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    // Check if error has custom message property
    if (error.message && !error.message.startsWith("[")) {
      return {
        ...shape,
        message: error.message,
      };
    }

    // Handle Zod validation errors
    if (error.cause instanceof ZodError) {
      const firstError = error.cause.issues[0];
      return {
        ...shape,
        message: firstError?.message || "Erreur de validation",
        data: {
          ...shape.data,
          zodError: error.cause.flatten(),
        },
      };
    }

    return shape;
  },
});

// Create auth middleware instances
const { requireAdmin } = createAuthMiddleware(t);

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentification requise",
      cause: "No session",
    });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});

// Admin-only procedure (checks for both session and admin role)
export const adminProcedure = t.procedure.use(requireAdmin);

// Export types
export type { Context } from "./context";
export { createContext } from "./context";
