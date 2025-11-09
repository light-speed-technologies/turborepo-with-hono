import { protectedProcedure } from "../../trpc/index.js";
import { database } from "../../db.js";
import { userSchema } from "@karina/shared/schemas";
import { z } from "zod";

// Schema for get user by ID
const getUserSchema = z.object({
  userId: z.string(),
});

export const get = protectedProcedure
  .input(getUserSchema)
  .query(async ({ input }) => {
    // Fetch user by ID
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Shape output to contract
    return userSchema.parse({
      id: user.id,
      name: user.name ?? null,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image ?? null,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason ?? null,
      banExpires: user.banExpires ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });
