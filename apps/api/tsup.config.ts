import { defineConfig } from "tsup";
import { inferInternalPackages } from "./build.js";

export default defineConfig({
  entry: ["src/index.ts"],
  outExtension: () => ({ js: `.js` }),
  format: "esm",
  target: "node22",
  outDir: "dist",
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  bundle: true,
  noExternal: inferInternalPackages(process.cwd()),
});
