import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import type { Plugin } from "vite";

export function storyWorkspace(): Plugin {
  const moduleId = "virtual:story-workspace";
  const resolved = "\0" + moduleId;
  const client = fileURLToPath(new URL("./client.tsx", import.meta.url));
  const template = fileURLToPath(new URL("./template.html", import.meta.url));
  const editorStyles = fileURLToPath(new URL("../components/story-editor.css", import.meta.url));
  return {
    name: "doing-utah-daily-story-workspace",
    resolveId(id) {
      return id === moduleId ? resolved : undefined;
    },
    async load(id) {
      if (id !== resolved) return;
      this.addWatchFile(client);
      this.addWatchFile(template);
      this.addWatchFile(editorStyles);
      const [document, styles, bundle] = await Promise.all([
        readFile(template, "utf8"),
        readFile(editorStyles, "utf8"),
        build({ entryPoints: [client], bundle: true, minify: true, platform: "browser", format: "iife", write: false, define: { "process.env.NODE_ENV": '"production"' } }),
      ]);
      const script = bundle.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
      const html = document
        .replace("<!-- story-editor-styles -->", () => `<style>${styles}</style>`)
        .replace("<!-- story-workspace-script -->", () => `<script>${script}</script>`);
      return `export default ${JSON.stringify(html)}`;
    },
  };
}
