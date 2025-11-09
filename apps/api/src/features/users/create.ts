import { protectedProcedure } from "../../trpc";
import { database } from "../../db";
import { createUserSchema } from "@karina/shared/schemas";
import { auth } from "../../auth";
import { Role } from "@karina/shared/enums";

export const create = protectedProcedure
  .input(createUserSchema)
  .mutation(async ({ input, ctx }) => {
    // Check if user has admin role
    if (ctx.session.user.role !== Role.admin) {
      throw new Error("Accès administrateur requis");
    }

    // Check if user with email already exists
    const existingUser = await database.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error("Un utilisateur avec cette adresse email existe déjà");
    }

    // Create user using Better Auth admin API
    try {
      const response = await auth.api.createUser({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
          role: input.role,
        },
        headers: {
          cookie: ctx.headers.cookie || "",
        },
      });

      // Check if user was created successfully
      if (!response || !response.user) {
        throw new Error("Échec de la création de l'utilisateur");
      }

      await database.user.update({
        where: { email: input.email },
        data: {
          emailVerified: true,
        },
      });

      // Return created user
      return {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: input.role,
      };
    } catch (error) {
      console.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Échec de la création de l'utilisateur"
      );
    }
  });
