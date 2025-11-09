import { publicProcedure } from "../../trpc";
import { database } from "../../db";
import { deleteUserSchema } from "@repo/constants/schemas";

/**
 * Delete user
 */
export const deleteUser = publicProcedure
  .input(deleteUserSchema)
  .mutation(async ({ input }) => {
    const user = await database.user.delete({
      where: { id: input.userId },
    });

    return user;
  });

