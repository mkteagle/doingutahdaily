import { App, applyDocumentTheme } from "@modelcontextprotocol/ext-apps";
import { createRoot } from "react-dom/client";
import { VisualStoryEditor } from "../components/VisualStoryEditor";
import { storyHtml } from "../lib/storyMarkdown";

type Draft = {
  id: string;
  title: string;
  summary: string;
  markdown: string;
  revision: string;
  coverImage: string | null;
  canUploadImages: boolean;
};

type WorkspaceResult = {
  kind: "draft" | "photos";
  draft?: Draft;
  album?: string;
  photos?: { id: string; title: string }[];
};

const app = new App({ name: "Doing Utah Daily", version: "2.0.0" });
const editor = document.querySelector<HTMLFormElement>("#draft")!;
const title = document.querySelector<HTMLInputElement>("#title")!;
const summary = document.querySelector<HTMLTextAreaElement>("#summary")!;
const markdown = document.querySelector<HTMLTextAreaElement>("#markdown")!;
const visualPanel = document.querySelector<HTMLElement>("#visual-panel")!;
const sourceWorkspace = document.querySelector<HTMLElement>("#source-workspace")!;
const mode = document.querySelector<HTMLButtonElement>("#mode")!;
const visualEditor = createRoot(document.querySelector("#visual")!);
const preview = document.querySelector<HTMLElement>("#preview")!;
const cover = document.querySelector<HTMLImageElement>("#cover")!;
const save = document.querySelector<HTMLButtonElement>("#save")!;
const revise = document.querySelector<HTMLButtonElement>("#revise")!;
const status = document.querySelector<HTMLElement>("#status")!;
const gallery = document.querySelector<HTMLElement>("#gallery")!;
const photoGrid = document.querySelector<HTMLElement>("#photos")!;
let draft: Draft | undefined;

app.addEventListener("hostcontextchanged", ({ theme }) => {
  if (theme) applyDocumentTheme(theme);
});

function renderPreview() {
  preview.innerHTML = storyHtml(markdown.value);
}

async function uploadInlineImage(image: Blob) {
  if (!draft) throw new Error("Open a draft to upload an image.");
  const id = draft.id;
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("The image couldn’t be read."));
    reader.readAsDataURL(image);
  });
  const result = await app.callServerTool({ name: "upload_story_image", arguments: { id, image: base64 } });
  const data = result.structuredContent;
  if (!result.isError && data && typeof data === "object" && "url" in data && typeof data.url === "string") return data.url;
  const error = result.content.find((item) => item.type === "text");
  throw new Error(error?.text || "The image couldn’t be uploaded. Try again.");
}

function renderVisual() {
  visualEditor.render(<VisualStoryEditor key={draft?.id} value={markdown.value}
    uploadImage={draft?.canUploadImages ? uploadInlineImage : undefined} onChange={(value) => {
    markdown.value = value;
    renderVisual();
  }} />);
}

function showVisual() {
  sourceWorkspace.hidden = true;
  visualPanel.hidden = false;
  mode.textContent = "Edit Markdown";
  renderVisual();
}

function showDraft(next: Draft) {
  draft = next;
  gallery.hidden = true;
  editor.hidden = false;
  title.value = next.title;
  summary.value = next.summary;
  markdown.value = next.markdown;
  showVisual();
  cover.hidden = !next.coverImage;
  if (next.coverImage) cover.src = next.coverImage;
  else cover.removeAttribute("src");
}

function askChat(text: string) {
  void app.sendMessage({ role: "user", content: [{ type: "text", text }] }).then((result) => {
    status.textContent = result.isError ? "Send your request in the chat below." : "";
  }).catch(() => {
    status.textContent = "Send your request in the chat below.";
  });
}

markdown.addEventListener("input", renderPreview);
mode.addEventListener("click", () => {
  if (visualPanel.hidden) showVisual();
  else {
    visualPanel.hidden = true;
    sourceWorkspace.hidden = false;
    mode.textContent = "Visual editor";
    renderPreview();
    markdown.focus();
  }
});
editor.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!draft) return;
  const changes = { title: title.value, summary: summary.value, markdown: markdown.value };
  save.disabled = true;
  status.textContent = "Saving…";
  try {
    const result = await app.callServerTool({
      name: "update_story_draft",
      arguments: { id: draft.id, revision: draft.revision, ...changes },
    });
    const next = (result.structuredContent as WorkspaceResult | undefined)?.draft;
    if (result.isError || !next) {
      status.textContent = result.content.find((item) => item.type === "text")?.text ?? "Couldn’t save. Ask ChatGPT to reopen the draft.";
      return;
    }
    // A save can finish while the author is still typing.
    draft = next;
    const stillEditing = title.value !== changes.title || summary.value !== changes.summary || markdown.value !== changes.markdown;
    if (!stillEditing) {
      title.value = next.title;
      summary.value = next.summary;
    }
    status.textContent = stillEditing ? "Saved. You have additional unsaved changes." : "Draft saved.";
  } catch {
    status.textContent = "Couldn’t save. Try again.";
  } finally {
    save.disabled = false;
  }
});

revise.addEventListener("click", () => {
  if (!draft) return;
  const currentSelection = window.getSelection();
  const selection = visualPanel.hidden
    ? markdown.value.slice(markdown.selectionStart, markdown.selectionEnd).trim()
    : visualPanel.contains(currentSelection?.anchorNode ?? null) ? currentSelection?.toString().trim() : "";
  askChat(selection
    ? `Help me revise this selected passage from my Doing Utah Daily draft (${draft.id}). Keep my voice and show me a suggested rewrite before saving.\n\n${selection}`
    : `Work through this Doing Utah Daily draft with me (${draft.id}). Open the latest saved version and ask what section I want to work on.`);
});

app.ontoolresult = (result) => {
  const data = result.structuredContent as WorkspaceResult | undefined;
  if (data?.draft) {
    showDraft(data.draft);
    return;
  }
  if (data?.kind !== "photos") return;
  editor.hidden = true;
  gallery.hidden = false;
  document.querySelector("#album")!.textContent = data.album || "Kindred photos";
  const images = result.content?.filter((item) => item.type === "image") ?? [];
  photoGrid.replaceChildren(...(data.photos ?? []).map((photo, index) => {
    const card = document.createElement("article");
    const image = images[index];
    if (image?.mimeType === "image/webp") {
      const img = document.createElement("img");
      img.alt = photo.title;
      img.src = `data:image/webp;base64,${image.data}`;
      card.append(img);
    }
    const label = document.createElement("p");
    label.textContent = photo.title;
    card.append(label);
    for (const [placement, text] of [["cover", "Use as cover"], ["inline", "Add to story"]]) {
      const button = document.createElement("button");
      button.textContent = text;
      button.addEventListener("click", () => askChat(`I selected Kindred photo ${photo.id} for the ${placement === "cover" ? "cover" : "story body"} of my current Doing Utah Daily draft. Copy it to the site’s image library and add it to the draft.`));
      card.append(button);
    }
    return card;
  }));
  if (!photoGrid.childElementCount) {
    status.textContent = "No photos matched. Ask ChatGPT to try another search.";
  }
};

void app.connect()
  .then(() => {
    const theme = app.getHostContext()?.theme;
    if (theme) applyDocumentTheme(theme);
  })
  .catch(() => {
    status.textContent = "This view couldn’t connect. You can keep writing in the chat.";
  });
