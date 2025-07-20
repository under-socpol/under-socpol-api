import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "node20.11",
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.json",
  minify: true,
});
