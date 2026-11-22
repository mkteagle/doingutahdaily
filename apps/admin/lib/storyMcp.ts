import { createHash } from "node:crypto";
import { postAssetsPublicUrl, storePostImage } from "@dud/content-engine/post-assets";
import { postService } from "@dud/db";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { adminOrigin } from "@/auth";
import { getKindredAlbum, kindredAlbumConfigured, readKindredPhoto } from "@/lib/kindredPhotos";
import { createUniquePostSlug } from "@/lib/postDrafts";
import workspaceHtml from "virtual:story-workspace";

const workspaceUri = "ui://doing-utah-daily/story-workspace.html";
const workspaceMeta = { ui: { resourceUri: workspaceUri }, "openai/outputTemplate": workspaceUri };
const chatDraftId = z.string().regex(/^mcp-[a-f0-9]{32}$/);
const photoId = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const revision = z.iso.datetime();
const draftFields = {
  title: z.string().trim().min(1).max(180),
  markdown: z.string().max(50_000),
  summary: z.string().trim().max(300),
};

const readOnly = { readOnlyHint: true, openWorldHint: false };
const draftWrite = { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const reopenMessage = "This draft has newer edits or is no longer editable here. Reopen it to see the latest version before saving.";

function fail(message: string): CallToolResult {
  return { isError: true, content: [{ type: "text", text: message }] };
}

function draftResponse(post: NonNullable<Awaited<ReturnType<typeof postService.getChatDraft>>>, message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message }],
    structuredContent: {
      kind: "draft",
      draft: {
        id: post.id,
        title: post.title,
        markdown: post.content,
        summary: post.excerpt ?? "",
        coverImage: post.coverImage,
        revision: post.updatedAt.toISOString(),
        editorUrl: new URL(`/posts/${post.id}`, adminOrigin).href,
      },
    },
  };
}

function assetOrigins() {
  const domains = ["https://www.doingutahdaily.com"];
  const configured = postAssetsPublicUrl();
  if (configured) {
    try {
      const origin = new URL(configured);
      if (origin.protocol === "https:") domains.push(origin.origin);
    } catch {
      // Drafts still work when photo storage is unconfigured.
    }
  }
  return domains;
}

export function registerStoryTools(server: McpServer) {
  server.registerResource("story-workspace", workspaceUri, { mimeType: "text/html;profile=mcp-app" }, () => ({
    contents: [{
      uri: workspaceUri,
      mimeType: "text/html;profile=mcp-app",
      text: workspaceHtml,
      _meta: {
        ui: { csp: { resourceDomains: assetOrigins(), connectDomains: [] } },
        "openai/widgetCSP": { resource_domains: assetOrigins(), connect_domains: [] },
      },
    }],
  }));

  server.registerTool("create_story_draft", {
    title: "Open a new Doing Utah Daily draft",
    description: "Use when the author asks to start a saved draft. An outline or working title is enough. Open the returned editor and keep co-writing in this chat.",
    inputSchema: { title: draftFields.title, markdown: draftFields.markdown.optional(), summary: draftFields.summary.optional() },
    annotations: draftWrite,
    _meta: workspaceMeta,
  }, async ({ title, markdown = "", summary = "" }) => {
    const id = `mcp-${createHash("sha256").update(JSON.stringify([title, markdown.trim(), summary])).digest("hex").slice(0, 32)}`;
    try {
      let post = await postService.getChatDraft(id);
      if (!post) {
        try {
          post = await postService.createPost({
            id, slug: await createUniquePostSlug(title), title, content: markdown, excerpt: summary, published: false,
          });
        } catch (error) {
          post = await postService.getChatDraft(id);
          if (!post) throw error;
        }
      }
      return post ? draftResponse(post, "Draft saved. Keep writing and revising here.") : fail("The draft could not be saved.");
    } catch {
      return fail("The draft could not be saved. Try again.");
    }
  });

  server.registerTool("list_story_drafts", {
    title: "Find a ChatGPT story draft",
    description: "Find a recent Doing Utah Daily draft created through this connection so an author can resume co-writing in a new chat.",
    annotations: readOnly,
  }, async () => {
    const drafts = (await postService.listChatDrafts()).map((post) => ({ ...post, updatedAt: post.updatedAt.toISOString() }));
    return {
      content: [{ type: "text", text: drafts.length ? drafts.map(({ id, title }) => `${title} (${id})`).join("\n") : "No saved ChatGPT drafts yet." }],
      structuredContent: { drafts },
    };
  });

  server.registerTool("open_story_draft", {
    title: "Open a Doing Utah Daily draft",
    description: "Read the latest Markdown, summary, and revision before co-writing or editing. Shows the in-chat editor.",
    inputSchema: { id: chatDraftId },
    annotations: readOnly,
    _meta: workspaceMeta,
  }, async ({ id }) => {
    const post = await postService.getChatDraft(id);
    return post ? draftResponse(post, "Draft opened.") : fail("This Story draft is unavailable.");
  });

  server.registerTool("update_story_draft", {
    title: "Save revisions to the current draft",
    description: "Save agreed edits in the same draft. Include only changed fields and use the revision returned by the latest open or save. Reopen and reconcile with the author's edits if it changed.",
    inputSchema: {
      id: chatDraftId,
      revision,
      title: draftFields.title.optional(),
      markdown: draftFields.markdown.optional(),
      summary: draftFields.summary.optional(),
    },
    annotations: draftWrite,
    _meta: { ...workspaceMeta, "openai/widgetAccessible": true },
  }, async ({ id, revision, title, markdown, summary }) => {
    if (title === undefined && markdown === undefined && summary === undefined) return fail("Provide a title, Markdown, or summary to save.");
    const post = await postService.updatePost(id, { title, content: markdown, excerpt: summary }, new Date(revision));
    return post ? draftResponse(post, "Revisions saved.") : fail(reopenMessage);
  });

  if (!kindredAlbumConfigured()) return;
  registerKindredTools(server);
}

function registerKindredTools(server: McpServer) {
  server.registerTool("browse_kindred_photos", {
    title: "Compare photos from the Kindred editorial album",
    description: "When the author asks to look at photos, show up to six images from the album for comparison. Optional query matches photo titles or dates. Describe what you see and suggest cover and inline roles. Ask the author before importing a selection.",
    inputSchema: { query: z.string().trim().max(120).optional(), offset: z.number().int().min(0).max(5000).optional() },
    annotations: { ...readOnly, openWorldHint: true },
    _meta: workspaceMeta,
  }, async ({ query = "", offset = 0 }) => {
    try {
      const album = await getKindredAlbum();
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const matches = album.photos.filter((photo) => words.every((word) =>
        `${photo.photo_title} ${photo.date_taken ?? ""}`.toLowerCase().includes(word),
      ));
      const batch = matches.slice(offset, offset + 6);
      const candidates = await Promise.allSettled(batch.map(async (photo) => ({
        id: photo.photo_id,
        title: photo.photo_title,
        image: (await readKindredPhoto(album.share, photo, "thumb")).toString("base64"),
      })));
      const photos = candidates.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
      if (batch.length && !photos.length) return fail("Kindred returned photos, but their previews could not be loaded. Try again.");
      return {
        content: photos.length ? photos.flatMap(({ id, title, image }) => [
          { type: "text" as const, text: `${title} (photo ID: ${id})` },
          { type: "image" as const, mimeType: "image/webp", data: image },
        ]) : [{ type: "text", text: "No photos match. Try a different title or date, or browse the full editorial album." }],
        structuredContent: {
          kind: "photos",
          album: album.title,
          photos: photos.map(({ id, title }) => ({ id, title })),
          nextOffset: offset + batch.length < matches.length ? offset + batch.length : null,
        },
      };
    } catch {
      return fail("Kindred couldn’t open the editorial album. Check the share link, password, and expiration.");
    }
  });

  server.registerTool("add_kindred_photo_to_draft", {
    title: "Add an approved Kindred photo to a story",
    description: "Only after the author selects a photo from the editorial album, copy a web-size version to Doing Utah Daily’s public image library and set it as the cover or append it to the draft. Use a factual alt description for inline images. The story remains private.",
    inputSchema: {
      id: chatDraftId, revision, photoId,
      placement: z.enum(["cover", "inline"]),
      alt: z.string().trim().min(1).max(160).optional(),
    },
    annotations: { ...draftWrite, openWorldHint: true },
    _meta: workspaceMeta,
  }, async ({ id, revision, photoId, placement, alt }) => {
    const draft = await postService.getChatDraft(id);
    if (!draft || draft.updatedAt.toISOString() !== revision) return fail(reopenMessage);
    if (placement === "inline" && !alt) return fail("Add a short alt description for the inline photo.");
    try {
      const album = await getKindredAlbum();
      const photo = album.photos.find((item) => item.photo_id === photoId);
      if (!photo) return fail("That photo is outside the editorial album or is no longer shared.");
      const body = await readKindredPhoto(album.share, photo, "preview");
      const imageKey = createHash("sha256").update(body).digest("hex");
      const url = await storePostImage({ body, contentType: "image/webp", slug: draft.slug, imageKey, signal: AbortSignal.timeout(15_000) });
      const markdown = alt?.replace(/[\\\[\]<>\r\n]/g, " ").trim() ?? "";
      const content = draft.content.includes(url) ? draft.content : `${draft.content.trimEnd()}\n\n![${markdown}](<${url}>)\n`.trimStart();
      const updated = await postService.updatePost(id, placement === "cover" ? { coverImage: url } : { content }, new Date(revision));
      return updated ? draftResponse(updated, "Photo added to the draft.") : {
        ...fail("The photo was imported, but the draft changed. Reopen it before adding the photo."),
        structuredContent: { importedPhotoUrl: url },
      };
    } catch {
      return fail("The selected photo couldn’t be copied. Check that the Kindred share and the site’s image storage are available.");
    }
  });
}
