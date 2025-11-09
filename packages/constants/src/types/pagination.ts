import type {
  filterPaginationSchema,
  paginationSchema,
  searchPaginationSchema,
} from "../schemas/pagination";
import type { z } from "zod";

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchPaginationInput = z.infer<typeof searchPaginationSchema>;
export type FilterPaginationInput = z.infer<typeof filterPaginationSchema>;
