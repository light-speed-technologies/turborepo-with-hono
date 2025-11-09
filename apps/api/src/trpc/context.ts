import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Create context for tRPC requests
 * This is where you can add authentication, database connections, etc.
 */
export function createContext(opts: FetchCreateContextFnOptions) {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

