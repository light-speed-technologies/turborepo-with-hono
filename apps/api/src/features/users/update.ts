import { publicProcedure } from "../../trpc";
import { database } from "../../db";
import { updateUserSchema } from "@repo/constants/schemas";

/**
 * Update user
 */
export const update = publicProcedure
  .input(updateUserSchema)
  .mutation(async ({ input }) => {
    const { userId, ...data } = input;

    const user = await database.user.update({
      where: { id: userId },
      data,
    });

    return user;
  });

