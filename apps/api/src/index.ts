import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./trpc";
import { apiRouter } from "./routers";
import { serve } from "@hono/node-server";

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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info: any) => {
    console.log(`Server running successfully on port ${info.port}`);
  }
);

export default app;
