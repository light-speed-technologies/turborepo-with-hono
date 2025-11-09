import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  minify: false,
  bundle: true,
  external: [
    // Don't bundle Prisma client
    "@prisma/client",
    ".prisma/client",
  ],
  noExternal: [
    // Bundle everything else including problematic ESM packages
    /^(?!@prisma|\.prisma).*/,
  ],
});

