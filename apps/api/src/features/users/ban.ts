import { database } from "../../db";
import { banUserSchema } from "@karina/shared/schemas";
import { auth } from "../../auth";
import { Role } from "@karina/shared/enums";
import { protectedProcedure } from "../../trpc";

export const ban = protectedProcedure
  .input(banUserSchema)
  .mutation(async ({ input, ctx }) => {
    // Check if user exists
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Prevent banning admins
    if (user.role === Role.admin) {
      throw new Error("Impossible de bannir les utilisateurs administrateurs");
    }

    // Prevent self-banning
    if (user.id === ctx.session?.user.id) {
      throw new Error("Impossible de vous bannir");
    }

    // Ban user using Better Auth admin API
    await auth.api.banUser({
      body: {
        userId: input.userId,
        banReason: input.banReason,
        banExpiresIn: input.banExpires
          ? Math.floor((input.banExpires.getTime() - Date.now()) / 1000)
          : undefined,
      },
      headers: {
        cookie: ctx.headers.cookie || "",
      },
    });

    return { success: true };
  });
