import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./trpc";
import { apiRouter } from "./routers";
import { serve } from "@hono/node-server";

const app = new Hono();

// Health check endpoint
app.get("/health-check", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount tRPC on /trpc
app.use(
  "/trpc/*",
  trpcServer({
    router: apiRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

app.get("/", (c) => {
  return c.text("OK", 200);
});

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
