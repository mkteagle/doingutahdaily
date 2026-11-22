import { redact } from "@tanstack/redact/vinext";
import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig } from "vite";
import nextConfig from "./next.config.mjs";

const vercelBuild = process.env.NITRO_PRESET === "vercel";

export default defineConfig({
  plugins: [
    vinext(),
    vercelBuild && nitro({
      // Vinext copies responses as ResponseInit; keep the native status and headers.
      features: { fastResponse: false },
      vercel: {
        config: {
          version: 3,
          routes: [{ src: "^/_next/image/?$", dest: "/_vercel/image" }],
          images: {
            sizes: [...nextConfig.images.deviceSizes, ...nextConfig.images.imageSizes].sort((a, b) => a - b),
            domains: [],
            minimumCacheTTL: nextConfig.images.minimumCacheTTL,
            formats: ["image/webp"],
          },
        },
      },
    }),
    redact(),
  ],
});
