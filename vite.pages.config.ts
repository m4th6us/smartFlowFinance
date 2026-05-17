import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

function normalizeBasePath(basePath: string | undefined) {
  if (!basePath || basePath === "/") return "/";
  return `/${basePath}/`.replace(/\/+/g, "/");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = normalizeBasePath(env.VITE_APP_BASE_PATH || env.GITHUB_PAGES_BASE_PATH || "/");

  return {
    base: basePath,
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    build: {
      outDir: "dist/pages",
      emptyOutDir: true,
    },
  };
});
