import { database } from "../../db.js";
import { deleteUserSchema } from "@karina/shared/schemas";
import { Role } from "@karina/shared/enums";
import { auth } from "../../auth/index.js";
import { protectedProcedure } from "../../trpc/index.js";

export const deleteUser = protectedProcedure
  .input(deleteUserSchema)
  .mutation(async ({ input, ctx }) => {
    // Check if user exists
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Prevent deleting admins
    if (user.role === Role.admin) {
      throw new Error(
        "Impossible de supprimer les utilisateurs administrateurs"
      );
    }

    // Prevent self-deletion
    if (user.id === ctx.session?.user.id) {
      throw new Error("Impossible de vous supprimer");
    }

    // Delete user using Better Auth admin API
    await auth.api.removeUser({
      body: {
        userId: input.userId,
      },
      headers: {
        cookie: ctx.headers.cookie || "",
      },
    });

    return { success: true };
  });
