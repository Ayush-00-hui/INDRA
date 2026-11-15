import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  root: "./",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "_assets",
    assetsInlineLimit: 8192,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/ws": {
        target: "ws://127.0.0.1:8000",
        ws: true,
      },
      "/assets": "http://127.0.0.1:8000",
      "/results": "http://127.0.0.1:8000",
      "/replays": "http://127.0.0.1:8000",
    },
  },
});
