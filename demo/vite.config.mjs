import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // load env vars based on mode
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || "/",
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});