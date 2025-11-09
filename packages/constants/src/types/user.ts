import type { z } from "zod";
import {
  userSchema,
  userUpdateProfileSchema,
  userListFiltersSchema,
  createUserSchema,
  banUserSchema,
  unbanUserSchema,
  updateUserRoleSchema,
  deleteUserSchema,
  revokeUserSessionsSchema,
} from "../schemas/user";

// User types
export type User = z.infer<typeof userSchema>;
export type UserUpdateProfile = z.infer<typeof userUpdateProfileSchema>;

// User filter types
export type UserListFilters = z.infer<typeof userListFiltersSchema>;

// User mutation types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;
export type UnbanUserInput = z.infer<typeof unbanUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type RevokeUserSessionsInput = z.infer<typeof revokeUserSessionsSchema>;
