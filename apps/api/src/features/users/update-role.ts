import { protectedProcedure } from "../../trpc";
import { database } from "../../db";
import { updateUserRoleSchema } from "@karina/shared/schemas";
import { auth } from "../../auth";

export const updateRole = protectedProcedure
  .input(updateUserRoleSchema)
  .mutation(async ({ input, ctx }) => {
    // Check if user exists
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Prevent changing own role
    if (user.id === ctx.session?.user.id) {
      throw new Error("Impossible de changer votre propre rôle");
    }

    // Update user role using Better Auth admin API
    await auth.api.setRole({
      body: {
        userId: input.userId,
        role: input.role,
      },
      headers: {
        cookie: ctx.headers.cookie || "",
      },
    });

    return { success: true };
  });
