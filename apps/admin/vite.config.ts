import { redact } from "@tanstack/redact/vinext";
import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig } from "vite";
import { storyWorkspace } from "./story-workspace/vitePlugin.ts";

export default defineConfig({
  plugins: [
    storyWorkspace(),
    vinext(),
    process.env.NITRO_PRESET === "vercel" && nitro({
      // Vinext copies responses as ResponseInit; keep the native status and headers.
      features: { fastResponse: false },
      vercel: {
        config: {
          version: 3,
          // Vercel combines project and Build Output cron definitions.
          crons: [
            { path: "/api/cron/publish-posts", schedule: "*/15 * * * *" },
            { path: "/api/cron/sync-instagram", schedule: "0 14 * * *" },
          ],
        },
        functionRules: {
          "/api/social/sync": { maxDuration: 120 },
          "/api/cron/sync-instagram": { maxDuration: 120 },
        },
      },
    }),
    redact(),
  ],
});
