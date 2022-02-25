import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import customPlugin from "./plugin/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    customPlugin(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ], // TODO: react()
});
