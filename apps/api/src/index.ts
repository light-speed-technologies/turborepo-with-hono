import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@repo/trpc";
import { apiRouter } from "./routers";

const app = new Hono();

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount tRPC on /trpc
app.use(
  "/trpc/*",
  trpcServer({
    router: apiRouter,
    createContext,
  })
);

export default app;
