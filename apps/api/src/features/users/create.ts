import { publicProcedure } from "../../trpc";
import { database } from "../../db";
import { createUserSchema } from "@repo/constants/schemas";

/**
 * Create a new user
 */
export const create = publicProcedure
  .input(createUserSchema)
  .mutation(async ({ input }) => {
    const user = await database.user.create({
      data: {
        name: input.name,
        email: input.email,
      },
    });

    return user;
  });
