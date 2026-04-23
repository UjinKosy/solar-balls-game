import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: Number(process.env.WEB_PORT ?? 5173),
  },
});
