import { z } from "zod";
import { Role } from "../enums/roles";
import { filterPaginationSchema } from "./pagination";

// User schema for API responses
export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.email(),
  emailVerified: z.boolean().optional(),
  image: z.string().nullable().optional(),
  role: z.enum(Role).optional(),
  banned: z.boolean().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User profile update schema
export const userUpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
});

// User list filters schema
export const userListFiltersSchema = filterPaginationSchema.extend({
  role: z.enum(Role).optional(),
  status: z.enum(["active", "banned", "all"]).optional(),
  emailVerified: z.boolean().optional(),
});

// User mutation schemas (admin only)
export const createUserSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100),
  name: z.string().min(1, "Le nom est requis").max(100),
  role: z.enum(Role),
});

export const banUserSchema = z.object({
  userId: z.string(),
  banReason: z
    .string()
    .min(1, "La raison du bannissement est requise")
    .max(500, "La raison du bannissement ne peut pas dépasser 500 caractères"),
  banExpires: z.date().optional().nullable(),
});

export const unbanUserSchema = z.object({
  userId: z.string(),
});

export const updateUserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(Role),
});

export const deleteUserSchema = z.object({
  userId: z.string(),
});

export const revokeUserSessionsSchema = z.object({
  userId: z.string(),
});
