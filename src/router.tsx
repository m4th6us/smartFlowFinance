import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasePath() {
  const configuredBasePath = import.meta.env.VITE_APP_BASE_PATH;
  const viteBasePath = import.meta.env.BASE_URL;
  const basePath = configuredBasePath || viteBasePath || "/";
  const normalized = `/${basePath}`.replace(/\/+/g, "/").replace(/\/$/, "");

  return normalized === "" ? "/" : normalized;
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    basepath: getBasePath(),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
