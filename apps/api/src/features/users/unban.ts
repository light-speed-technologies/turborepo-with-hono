import { protectedProcedure } from "../../trpc/index.js";
import { database } from "../../db.js";
import { unbanUserSchema } from "@karina/shared/schemas";
import { auth } from "../../auth/index.js";

export const unban = protectedProcedure
  .input(unbanUserSchema)
  .mutation(async ({ input, ctx }) => {
    // Check if user exists
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Unban user using Better Auth admin API
    await auth.api.unbanUser({
      body: {
        userId: input.userId,
      },
      headers: {
        cookie: ctx.headers.cookie || "",
      },
    });

    return { success: true };
  });
