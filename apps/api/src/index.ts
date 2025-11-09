import { Hono } from "hono";
import { database } from "./db";

const app = new Hono();

app.get("/create-page", async (c) => {
  const name = Math.random().toString(36).substring(2, 15);
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
