import { protectedProcedure } from "../../trpc/index.js";
import { database } from "../../db.js";
import { revokeUserSessionsSchema } from "@karina/shared/schemas";
import { auth } from "../../auth/index.js";

export const revokeSessions = protectedProcedure
  .input(revokeUserSessionsSchema)
  .mutation(async ({ input, ctx }) => {
    // Check if user exists
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Get count before revoking
    const sessionsCount = await database.session.count({
      where: { userId: input.userId },
    });

    // Revoke all sessions using Better Auth admin API
    await auth.api.revokeUserSessions({
      body: {
        userId: input.userId,
      },
      headers: {
        cookie: ctx.headers.cookie || "",
      },
    });

    return { success: true, sessionsRevoked: sessionsCount };
  });
