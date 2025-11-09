import { publicProcedure } from "../../trpc";
import { database } from "../../db";
import { getUserSchema } from "@repo/constants/schemas";

/**
 * Get user by ID
 */
export const get = publicProcedure
  .input(getUserSchema)
  .query(async ({ input }) => {
    const user = await database.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  });

