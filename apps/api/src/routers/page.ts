import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { database } from "../db";

/**
 * Page router with database operations
 */
export const pageRouter = router({
  // Get all pages
  getPages: publicProcedure.query(async () => {
    const pages = await database.page.findMany();
    return pages;
  }),

  // Get page by ID
  getPageById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const page = await database.page.findUnique({
        where: { id: input.id },
      });
      return page;
    }),

  // Create a new page
  createPage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const page = await database.page.create({
        data: {
          name: input.name,
        },
      });
      return page;
    }),

  // Delete a page
  deletePage: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const page = await database.page.delete({
        where: { id: input.id },
      });
      return page;
    }),
});
