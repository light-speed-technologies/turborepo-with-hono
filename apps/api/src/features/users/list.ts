import { protectedProcedure } from "../../trpc/index.js";
import { database } from "../../db.js";
import {
  userSchema,
  userListFiltersSchema,
  createPaginatedResponse,
} from "@karina/shared/schemas";

export const list = protectedProcedure
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

    // Role filter
    if (input.role) {
      where.role = input.role;
    }

    // Status filter
    if (input.status && input.status !== "all") {
      where.banned = input.status === "banned";
    }

    // Email verified filter
    if (input.emailVerified !== undefined) {
      where.emailVerified = input.emailVerified;
    }

    // Pagination params (optional - if not provided, fetch all)
    const page = input.page;
    const pageSize = input.pageSize;
    const skip = page && pageSize ? (page - 1) * pageSize : undefined;

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
        ...(skip !== undefined ? { skip } : {}),
        ...(pageSize ? { take: pageSize } : {}),
        orderBy,
      }),
      database.user.count({ where }),
    ]);

    // Shape output to contract
    const shaped = items.map((u) =>
      userSchema.parse({
        id: u.id,
        name: u.name ?? null,
        email: u.email,
        emailVerified: u.emailVerified,
        image: u.image ?? null,
        role: u.role,
        banned: u.banned,
        banReason: u.banReason ?? null,
        banExpires: u.banExpires ?? null,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })
    );

    return createPaginatedResponse(
      shaped.map((s) => ({ ...s, test2: "test" })),
      total,
      page,
      pageSize
    );
  });
