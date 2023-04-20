import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      name: "ts-debounce-throttle",
      fileName: "index",
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs", "umd"],
    },
  },
  plugins: [
    dts({
      outputDir: resolve(__dirname, "dist"),
    }),
  ],
});
