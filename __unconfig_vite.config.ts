
let __unconfig_data;
let __unconfig_stub = function (data = {}) { __unconfig_data = data };
__unconfig_stub.default = (data = {}) => { __unconfig_data = data };
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
const __unconfig_default =  defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    Icons({
      /* options */
    }),
  ],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    host: "0.0.0.0",
  },
});

if (typeof __unconfig_default === "function") __unconfig_default(...[{"command":"serve","mode":"development"}]);export default __unconfig_data;