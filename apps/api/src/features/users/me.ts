import { protectedProcedure } from "../../trpc";
import { database } from "../../db";
import { userSchema } from "@karina/shared/schemas";

export const me = protectedProcedure.query(async ({ ctx }) => {
  // Fetch data
  const userId = ctx.session.user.id;
  const user = await database.user.findUnique({ where: { id: userId } });

  // Shape output to contract
  if (!user) return null;
  return userSchema.parse({
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
  });
});
