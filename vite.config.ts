import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    Icons({
      /* options */
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
});
