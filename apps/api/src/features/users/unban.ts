import { protectedProcedure } from "../../trpc";
import { database } from "../../db";
import { unbanUserSchema } from "@karina/shared/schemas";
import { auth } from "../../auth";

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
