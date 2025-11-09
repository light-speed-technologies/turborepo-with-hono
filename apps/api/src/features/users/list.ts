import { publicProcedure } from "../../trpc";
import { database } from "../../db";
import { userListFiltersSchema } from "@repo/constants/schemas";

/**
 * List users with optional filters and pagination
 */
export const list = publicProcedure
  .input(userListFiltersSchema)
  .query(async ({ input }) => {
    // Build where clause based on filters
    const where: any = {};

    // Search filter (email or name)
    if (input.search) {
      where.OR = [
        { email: { contains: input.search, mode: "insensitive" } },
        { name: { contains: input.search, mode: "insensitive" } },
      ];
    }

    // Pagination params with defaults
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    // Sorting
    const orderBy: any = {};
    if (input.sortBy) {
      orderBy[input.sortBy] = input.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    // Fetch data with filters
    const [items, total] = await Promise.all([
      database.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      database.user.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  });

