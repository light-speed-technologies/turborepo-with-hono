import { protectedProcedure } from "../../trpc";
import { database } from "../../db";
import { userSchema, userUpdateProfileSchema } from "@karina/shared/schemas";

export const updateProfile = protectedProcedure
  .input(userUpdateProfileSchema)
  .mutation(async ({ ctx, input }) => {
    // Update data
    const updated = await database.user.update({
      where: { id: ctx.session.user.id },
      data: { name: input.name, image: input.image },
    });
    // Shape output to contract
    return userSchema.parse({
      id: updated.id,
      name: updated.name ?? null,
      email: updated.email,
      image: updated.image ?? null,
    });
  });
