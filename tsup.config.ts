import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  ...options,
}));
