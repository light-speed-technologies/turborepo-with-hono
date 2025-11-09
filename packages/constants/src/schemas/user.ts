import { z } from "zod";

/**
 * User list filters schema
 * Used for filtering and paginating user lists
 */
export const userListFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  sortBy: z.enum(["createdAt", "email", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/**
 * Get user by ID schema
 */
export const getUserSchema = z.object({
  userId: z.number(),
});

/**
 * Create user schema
 */
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

/**
 * Update user schema
 */
export const updateUserSchema = z.object({
  userId: z.number(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

/**
 * Delete user schema
 */
export const deleteUserSchema = z.object({
  userId: z.number(),
});

/**
 * Type exports for TypeScript inference
 */
export type UserListFilters = z.infer<typeof userListFiltersSchema>;
export type GetUser = z.infer<typeof getUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type DeleteUser = z.infer<typeof deleteUserSchema>;
