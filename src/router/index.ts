import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const modules = import.meta.glob([
  "../views/*/index.tsx",
  "../views/*/index.vue",
]);
const generateRoutes = (): RouteRecordRaw[] => {
  return Object.keys(modules).map((path) => {
    const reg = /\.\.\/views\/(.*?)\/index\.(tsx|vue)/;
    return {
      path: `/${path.match(reg)?.[1]}`,
      component: () => import(path /* @vite-ignore */),
    };
  });
};

export const routes: RouteRecordRaw[] = generateRoutes();

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
