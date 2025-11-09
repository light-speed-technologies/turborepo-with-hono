import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc/context";
import { Role } from "@karina/shared/enums";
import type { t as TRPCInstance } from "../trpc";

// Factory functions to create middleware
export function createAuthMiddleware(t: typeof TRPCInstance) {
  // Check auth
  const requireAuth = t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentification requise",
      });
    }
    return next();
  });

  // Check role
  function requireRole(
    allowedRoles: readonly Role[],
    getRole: (session: Context["session"]) => Role | null
  ) {
    return t.middleware(({ ctx, next }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentification requise",
        });
      }

      const role = getRole(ctx.session);
      if (!role || !allowedRoles.includes(role)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Permissions insuffisantes",
        });
      }

      return next();
    });
  }

  // Check admin
  const requireAdmin = t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentification requise",
      });
    }

    // Check if user has admin role
    if (ctx.session.user.role !== Role.admin) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Accès administrateur requis",
      });
    }

    return next();
  });

  return { requireAuth, requireRole, requireAdmin };
}
