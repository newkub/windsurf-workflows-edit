// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";
import { fileURLToPath } from "node:url";
import checker from "vite-plugin-checker";

const appDir = fileURLToPath(new URL(".", import.meta.url));
const appName = path.basename(appDir);

export default defineNuxtConfig({
  compatibilityDate: "2025-12-30",
  devtools: { enabled: true },
  modules: [
    "@vue-macros/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-mcp-dev",
    "@nuxt/icon",
    "@scalar/nuxt",
    "nuxt-vitest",
  ],

  dir: {
    plugins: "app/plugins",
  },

  alias: {
    "~/shared": fileURLToPath(new URL("./shared", import.meta.url)),
    "@app": fileURLToPath(new URL("./app", import.meta.url)),
    "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
    "@server": fileURLToPath(new URL("./server", import.meta.url)),
  },

  scalar: {
    url: "https://registry.scalar.com/@scalar/apis/galaxy?format=yaml",
  },

  icon: {
    serverBundle: {
      collections: ["mdi"],
    },
  },

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        routes: [
          {
            pattern: `${appName}.wrikka.com`,
            custom_domain: true,
          },
        ],
      },
    },
  },

  vite: {
    plugins: [
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        vueTsc: true,
      }),
    ],
  },
} as any);
