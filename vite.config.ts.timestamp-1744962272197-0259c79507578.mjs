// vite.config.ts
import { defineConfig } from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/vite@4.5.5_@types+node@20.5.1_less@4.2.0_sass@1.80.5_sugarss@4.0.1_postcss@8.4.47__terser@5.36.0/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@4.5.5_@types+node@20.5.1_less@4.2.0_sass@1.80.5_sugarss@4.0.1_p_vnqldoge257s2iig33yobpgnz4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@4.5.5_@types+node@20.5.1_less@4.2.0_sass@1.80.5_sugarss@4.0_ucwkqpnbnqx4molklqksyykam4/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/unplugin-auto-import@19.1.2_@vueuse+core@10.11.1_vue@3.5.13_typescript@4.9.5__/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/unplugin-vue-components@28.5.0_@babel+parser@7.26.3_vue@3.5.13_typescript@4.9.5_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/unplugin-vue-components@28.5.0_@babel+parser@7.26.3_vue@3.5.13_typescript@4.9.5_/node_modules/unplugin-vue-components/dist/resolvers.js";
import { createRequire } from "node:module";
import Icons from "file:///Users/das/Desktop/code/vue3-ts/node_modules/.pnpm/unplugin-icons@0.17.4_@vue+compiler-sfc@3.5.13_vue-template-compiler@2.7.16_webpack-sources@3.2.3/node_modules/unplugin-icons/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/das/Desktop/code/vue3-ts/vite.config.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    Icons({
      /* options */
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"]
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    },
    host: "0.0.0.0",
    port: 5174
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGFzL0Rlc2t0b3AvY29kZS92dWUzLXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZGFzL0Rlc2t0b3AvY29kZS92dWUzLXRzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9kYXMvRGVza3RvcC9jb2RlL3Z1ZTMtdHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5cbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tIFwibm9kZTptb2R1bGVcIjtcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5pbXBvcnQgSWNvbnMgZnJvbSBcInVucGx1Z2luLWljb25zL3ZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICAvLyBja2VkaXRvcjUoeyB0aGVtZTogcmVxdWlyZS5yZXNvbHZlKFwiQGNrZWRpdG9yL2NrZWRpdG9yNS10aGVtZS1sYXJrXCIpIH0pLFxuICAgIEljb25zKHtcbiAgICAgIC8qIG9wdGlvbnMgKi9cbiAgICB9KSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgIH0pLFxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbXCJAZmZtcGVnL2ZmbXBlZ1wiLCBcIkBmZm1wZWcvdXRpbFwiXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeVwiOiBcInNhbWUtb3JpZ2luXCIsXG4gICAgICBcIkNyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3lcIjogXCJyZXF1aXJlLWNvcnBcIixcbiAgICB9LFxuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IDUxNzQsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxvQkFBb0I7QUFDNVMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUVwQyxTQUFTLHFCQUFxQjtBQUU5QixPQUFPLFdBQVc7QUFUb0osSUFBTSwyQ0FBMkM7QUFRdk4sSUFBTUEsV0FBVSxjQUFjLHdDQUFlO0FBSTdDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQTtBQUFBLElBRVAsTUFBTTtBQUFBO0FBQUEsSUFFTixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGtCQUFrQixjQUFjO0FBQUEsRUFDNUM7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFNBQVM7QUFBQSxNQUNQLDhCQUE4QjtBQUFBLE1BQzlCLGdDQUFnQztBQUFBLElBQ2xDO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInJlcXVpcmUiXQp9Cg==
