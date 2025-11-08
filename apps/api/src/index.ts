import { Hono } from "hono";
import { database } from "./db";

const app = new Hono();

app.get("/create-page", async (c) => {
  const body = await c.req.json();
  const { name } = body;
  const page = await database.page.create({
    data: {
      name,
    },
  });
  return c.json(page);
});

app.get("/get-pages", async (c) => {
  const pages = await database.page.findMany();
  return c.json(pages);
});
export default app;
