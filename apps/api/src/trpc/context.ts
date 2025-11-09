import type { Context as HonoContext } from "hono";
import { auth } from "../auth/index.js";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  // Get headers - compatible with both Hono and Next.js
  // Access headers through Hono's context API instead of raw Request
  const headers = new Headers();

  // Copy all headers from the request
  const cookieHeader = context.req.header("cookie");
  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  // Copy other common headers that might be needed
  const authHeader = context.req.header("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  const session = await auth.api.getSession({
    headers,
  });

  return {
    session,
    headers: {
      cookie: cookieHeader || "",
    },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
