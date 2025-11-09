import { z } from "zod";

// Base pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1).optional(),
  pageSize: z.number().int().positive().max(200).default(20).optional(),
});

// Extended pagination with search
export const searchPaginationSchema = paginationSchema.extend({
  search: z.string().optional(),
});

// Extended pagination with filters
export const filterPaginationSchema = searchPaginationSchema.extend({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Pagination response type
export const paginationResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  });

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Helper to create paginated response
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page?: number,
  pageSize?: number
): PaginatedResponse<T> {
  // If no pagination params, return all items with default pagination metadata
  if (!page || !pageSize) {
    return {
      items,
      total,
      page: 1,
      pageSize: total,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const totalPages = Math.ceil(total / pageSize);
  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
