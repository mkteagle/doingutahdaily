"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider, WysiwygEditor } from "crucible-ui/mdx";
import "crucible-ui/mdx/styles";
import "./story-editor.css";
import { VisualStoryEditor } from "./VisualStoryEditor";
import { storyHtml } from "@/lib/storyMarkdown";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Code2,
  Loader2,
  PenLine,
  Sparkles,
  Trash2,
} from "lucide-react";
import { POST_CATEGORIES } from "@/lib/postCategories";
import { toDatetimeLocalValue } from "@/lib/utils";

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    published: boolean;
    scheduledAt: Date | string | null;
    categories: { id: string; name: string }[];
  };
}

const QUICK_AI_ACTIONS = [
  "Make this punchier",
  "Make this more local to Utah",
  "Add clearer headings",
  "Tighten this by 30%",
] as const;

function serializePayload(payload: {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  scheduledAt: string;
  categories: string[];
}) {
  return JSON.stringify(payload);
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();

  const [postId, setPostId] = useState(post?.id ?? null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [scheduledAt, setScheduledAt] = useState(
    toDatetimeLocalValue(post?.scheduledAt)
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map((category) => category.name) ?? []
  );
  const legacyVisualEditor = !!post && !post.id.startsWith("mcp-") && /<[A-Z][A-Za-z0-9]*[\s\/>]/.test(post.content);
  const [editorMode, setEditorMode] = useState<"visual" | "source">("visual");
  const showPreview = editorMode === "source" || !legacyVisualEditor;
  const previewContent = useDeferredValue(content);
  const previewRef = useRef<HTMLDivElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autosaveState, setAutosaveState] = useState<
    "idle" | "dirty" | "saving" | "saved" | "error"
  >("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const editorConfig = useMemo(
    () => ({
      classNames: {
        editor: "min-h-[520px] focus:outline-none wysiwyg-editor",
        placeholder:
          "absolute top-3 left-4 m-0 text-base pointer-events-none text-ink/25",
      },
    }),
    []
  );

  const payload = useMemo(
    () => ({
      title,
      content,
      excerpt,
      coverImage,
      published,
      scheduledAt,
      categories: selectedCategories,
    }),
    [title, content, excerpt, coverImage, published, scheduledAt, selectedCategories]
  );

  const payloadKey = useMemo(() => serializePayload(payload), [payload]);
  const lastSavedPayloadRef = useRef(payloadKey);
  const lastAttemptedPayloadRef = useRef<string | null>(null);
  const saveInFlightRef = useRef(false);
  const savedPostIdRef = useRef(post?.id ?? null);
  const latestPayloadRef = useRef(payloadKey);

  useEffect(() => {
    latestPayloadRef.current = payloadKey;
  }, [payloadKey]);

  useEffect(() => {
    if (showPreview && previewRef.current) {
      previewRef.current.innerHTML = storyHtml(previewContent);
    }
  }, [previewContent, showPreview]);

  function toggleCategory(name: string) {
    setSelectedCategories((current) =>
      current.includes(name)
        ? current.filter((category) => category !== name)
        : [...current, name]
    );
  }

  async function savePost(options?: { publish?: boolean; autosave?: boolean }) {
    if (saveInFlightRef.current) return null;
    const autosave = options?.autosave ?? false;
    const shouldPublish = options?.publish ?? published;
    const normalizedPayload = {
      ...payload,
      title: title.trim() || "Untitled draft",
      published: shouldPublish,
      scheduledAt: shouldPublish ? "" : scheduledAt,
    };

    if ((shouldPublish || normalizedPayload.scheduledAt) && (!title.trim() || !content.trim())) {
      setError("Add a title and story content before publishing.");
      return null;
    }

    const schedule = normalizedPayload.scheduledAt ? new Date(normalizedPayload.scheduledAt) : null;
    if (schedule && Number.isNaN(schedule.getTime())) {
      setError("Enter a valid publishing date and time.");
      return null;
    }

    const currentId = savedPostIdRef.current;
    lastAttemptedPayloadRef.current = payloadKey;
    saveInFlightRef.current = true;
    setSaving(true);
    setError(null);
    setAutosaveState("saving");

    try {
      const response = await fetch(
        currentId ? `/api/posts/${currentId}` : "/api/posts",
        {
          method: currentId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...normalizedPayload,
            scheduledAt: schedule?.toISOString() ?? null,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Save failed");
      }

      const savedPostId = data.post.id as string;
      savedPostIdRef.current = savedPostId;
      setPostId(savedPostId);
      if (latestPayloadRef.current === payloadKey && !title.trim() && data.post.title) {
        setTitle(data.post.title);
      }
      if (options?.publish !== undefined) setPublished(shouldPublish);
      if (shouldPublish) setScheduledAt("");

      const savedPayloadKey = serializePayload({
        title: title.trim() || data.post.title || "Untitled draft",
        content,
        excerpt,
        coverImage,
        published: shouldPublish,
        scheduledAt: shouldPublish ? "" : scheduledAt,
        categories: selectedCategories,
      });
      lastSavedPayloadRef.current = savedPayloadKey;
      setLastSavedAt(new Date());
      setAutosaveState("saved");

      if (!post && latestPayloadRef.current === payloadKey) {
        router.replace(`/posts/${savedPostId}`);
      } else if (!autosave) {
        router.refresh();
      }

      return data.post;
    } catch (saveError) {
      setAutosaveState("error");
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save draft."
      );
      return null;
    } finally {
      saveInFlightRef.current = false;
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;

    const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" }).catch(() => null);
    if (!response?.ok) {
      setError("The story couldn’t be deleted. Try again.");
      return;
    }
    router.push("/posts");
  }

  async function handleAiRevision(instruction: string) {
    const trimmedInstruction = instruction.trim();
    if (!trimmedInstruction) {
      setError("Tell the AI what change you want first.");
      return;
    }

    if (!title.trim() && !content.trim() && !excerpt.trim()) {
      setError("Add a few words to the draft before asking AI to revise it.");
      return;
    }

    setAiLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/revise-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: trimmedInstruction,
          title,
          excerpt,
          content,
          categories: selectedCategories,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to revise draft.");
      }

      setTitle(data.draft.title);
      setExcerpt(data.draft.excerpt);
      setContent(data.draft.content);
      setSelectedCategories(data.draft.categories);
      setAiPrompt("");
      setAutosaveState("dirty");
    } catch (reviseError) {
      setError(
        reviseError instanceof Error
          ? reviseError.message
          : "Failed to revise draft."
      );
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    if (saving || payloadKey === lastSavedPayloadRef.current || payloadKey === lastAttemptedPayloadRef.current) return;
    if (!postId && !title.trim() && !content.trim() && !excerpt.trim() && !coverImage.trim() && !scheduledAt && !selectedCategories.length) return;

    setAutosaveState("dirty");
    // Changes to a live story require the explicit Update action.
    if (published) return;

    const saveTimer = setTimeout(() => void savePost({ autosave: true }), 1200);
    return () => clearTimeout(saveTimer);
  }, [payloadKey, saving, published, postId, title, content, excerpt, coverImage, scheduledAt, selectedCategories.length]);

  const saveLabel =
    autosaveState === "saving"
      ? "Saving..."
      : autosaveState === "saved" && lastSavedAt
        ? `Saved ${lastSavedAt.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}`
        : autosaveState === "error"
          ? "Save failed"
          : autosaveState === "dirty"
            ? "Unsaved changes"
            : published ? "Published" : "Autosave on";

  return (
    <div className="flex min-w-0 flex-col">
      <div className="border-b border-sand bg-cream/95 backdrop-blur">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <label className="sr-only" htmlFor="story-title">Story title</label>
              <input
                id="story-title"
                type="text"
                placeholder="Untitled draft"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border-none bg-transparent font-display text-4xl text-ink outline-none placeholder:text-ink/20 sm:text-4xl"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span role="status" className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-ink/75">
                  {saveLabel}
                </span>
              </div>
              <label className="mb-1 mt-3 block text-sm font-semibold" htmlFor="story-excerpt">Summary</label>
              <textarea
                id="story-excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={2}
                placeholder="A short summary for the blog list and shared links"
                className="w-full resize-none rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink/30 focus:border-canyon/30"
              />
            </div>

            <div className="flex shrink-0 flex-col gap-3 lg:w-[320px]">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!published || confirm("Move this live story back to drafts?")) void savePost({ publish: false });
                  }}
                  disabled={saving}
                  className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-sand disabled:opacity-50"
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Saving
                    </span>
                  ) : (
                    published ? "Unpublish" : "Save draft"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void savePost({ publish: true })}
                  disabled={saving || aiLoading}
                  className="rounded-lg bg-canyon px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-canyon-deep disabled:opacity-50"
                >
                  {published ? "Update" : "Publish Now"}
                </button>
                {postId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-lg px-3 py-2 text-sm text-ink/35 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trash2 size={14} />
                      Delete
                    </span>
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-canyon/10 bg-white/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                      Publishing
                    </p>
                    <p className="mt-1 text-sm text-ink/65">
                      {published
                        ? "This post is currently published."
                        : scheduledAt
                          ? "This draft is queued to publish automatically."
                          : "This draft stays saved while you write."}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      published
                        ? "bg-sage/15 text-sage"
                        : scheduledAt
                          ? "bg-canyon/10 text-canyon"
                          : "bg-ink/5 text-ink/45"
                    }`}
                  >
                    {published ? "Published" : scheduledAt ? "Scheduled" : "Draft"}
                  </span>
                </div>

                {!published && (
                  <div className="mt-4">
                    <label htmlFor="publish-time" className="text-xs font-semibold text-ink/75">Schedule publication</label>
                    <input
                      id="publish-time"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(event) => setScheduledAt(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-ink/15 bg-sand px-3 py-2.5 text-sm text-ink"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <details className="mb-4 rounded-2xl border border-ink/10 bg-cream p-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink">AI quick rewrites</summary>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_AI_ACTIONS.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => void handleAiRevision(action)}
                    disabled={aiLoading}
                    className="rounded-full border border-canyon/20 bg-canyon/5 px-3 py-1.5 text-xs font-medium text-canyon transition-colors hover:bg-canyon/10 disabled:opacity-50"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Bot
                    size={15}
                    className="pointer-events-none absolute left-3 top-3.5 text-ink/30"
                  />
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(event) => setAiPrompt(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleAiRevision(aiPrompt);
                      }
                    }}
                    placeholder="Example: turn this into a weekend guide for families with toddlers"
                    className="w-full rounded-2xl border border-ink/10 bg-[#FFFDF9] py-3 pl-10 pr-4 text-sm text-ink outline-none focus:border-canyon/40"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void handleAiRevision(aiPrompt)}
                  disabled={aiLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Revising
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Apply AI Edit
                    </>
                  )}
                </button>
              </div>
            </details>

            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs text-ink/55">
                <CircleCheck size={14} className="text-sage" />
                Drafts autosave while you write. Use publish only when it is ready.
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-white/70 px-3 py-2 text-xs font-medium text-ink/65 transition-colors hover:bg-white hover:text-ink xl:hidden"
              >
                Post Settings
                {settingsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            <section aria-labelledby="story-body-title" className="rounded-2xl border border-ink/15 bg-[#fffdf9]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand px-4 py-3">
                <h2 id="story-body-title" className="font-display text-lg font-semibold">Story body</h2>
                <div role="group" aria-label="Editor mode" className="flex gap-1 rounded-lg border border-ink/15 bg-sand p-1">
                  <button type="button" onClick={() => setEditorMode("visual")} aria-pressed={editorMode === "visual"}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-ink/75 hover:text-ink aria-pressed:bg-cream aria-pressed:text-ink aria-pressed:shadow-sm">
                    <PenLine size={14} aria-hidden /> Visual
                  </button>
                  <button type="button" onClick={() => setEditorMode("source")} aria-pressed={editorMode === "source"}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-ink/75 hover:text-ink aria-pressed:bg-cream aria-pressed:text-ink aria-pressed:shadow-sm">
                    <Code2 size={14} aria-hidden /> {legacyVisualEditor ? "MDX" : "Markdown"}
                  </button>
                </div>
              </div>

              <div className="story-editor-layout p-3 sm:p-4">
                <div className={showPreview ? "story-editor-columns" : undefined}>
                  <div className="story-editor-pane">
                    {editorMode === "source" ? (
                      <>
                        <label htmlFor="story-markdown" className="story-editor-label">{legacyVisualEditor ? "MDX source" : "Markdown source"}</label>
                        <textarea
                          id="story-markdown"
                          value={content}
                          onChange={(event) => setContent(event.target.value)}
                          placeholder="Write or paste your Markdown here…"
                          spellCheck={false}
                          className="story-editor-source"
                        />
                      </>
                    ) : (
                      <>
                        <p className="story-editor-label">Write</p>
                        {legacyVisualEditor ? (
                          <div className="story-editor-legacy">
                            <EditorProvider config={editorConfig}>
                              <WysiwygEditor value={content} onChange={setContent} placeholder="Start writing your story…" className="relative" />
                            </EditorProvider>
                          </div>
                        ) : <VisualStoryEditor value={content} onChange={setContent} />}
                      </>
                    )}
                  </div>
                  {showPreview && (
                    <section aria-labelledby="story-preview" className="story-editor-pane">
                      <h3 id="story-preview" className="story-editor-label">Preview</h3>
                      {legacyVisualEditor && <p className="text-xs text-ink/70">Custom embeds appear on the published story.</p>}
                      <div ref={previewRef} className="story-editor-preview story-prose" data-placeholder="Your story will appear here as you write." />
                    </section>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>

        <aside
          className={`${
            settingsOpen ? "flex" : "hidden"
          } w-full shrink-0 border-t border-ink/10 bg-cream/90 px-5 py-6 xl:flex xl:w-[300px] xl:border-l xl:border-t-0`}
        >
          <div className="w-full space-y-6 overflow-auto">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                  Post Settings
                </label>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-lg p-1 text-ink/35 transition-colors hover:bg-white hover:text-ink xl:hidden"
                >
                  <ChevronUp size={14} />
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-ink/45">
                Keep this panel for details that matter near publish time, not while
                you are trying to get the draft down fast.
              </p>
            </div>

            <div>
              <label htmlFor="cover-image-url" className="text-xs font-semibold text-ink/75">
                Cover image URL
              </label>
              <input
                id="cover-image-url"
                type="text"
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-ink/10 bg-sand p-2.5 text-sm text-ink outline-none placeholder:text-ink/25 focus:border-canyon/40"
              />
              {coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt="Cover"
                  className="mt-2 h-28 w-full rounded-lg object-cover"
                />
              )}
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                Categories
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {POST_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
                      selectedCategories.includes(category)
                        ? "border-canyon/30 bg-canyon/10 font-medium text-canyon"
                        : "border-ink/10 bg-sand text-ink/50 hover:border-ink/25"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
