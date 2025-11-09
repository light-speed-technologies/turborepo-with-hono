import { z } from "zod";

export const authSignInSchema = z.object({
  email: z.email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const authSignUpSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.email("Adresse e-mail invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  // Ensure passwords match
  .refine((vals) => vals.password === vals.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
