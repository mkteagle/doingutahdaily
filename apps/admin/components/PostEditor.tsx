"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider, WysiwygEditor } from "@mkteagle/mdx-wysiwyg";
import "@mkteagle/mdx-wysiwyg/styles";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Code2,
  Eye,
  Loader2,
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
  const [editorMode, setEditorMode] = useState<"visual" | "source">("visual");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [manualSaving, setManualSaving] = useState(false);
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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggleCategory(name: string) {
    setSelectedCategories((current) =>
      current.includes(name)
        ? current.filter((category) => category !== name)
        : [...current, name]
    );
  }

  async function savePost(options?: { publish?: boolean; autosave?: boolean }) {
    const autosave = options?.autosave ?? false;
    const shouldPublish = options?.publish ?? published;
    const normalizedPayload = {
      ...payload,
      title: title.trim() || "Untitled draft",
      published: shouldPublish,
      scheduledAt: shouldPublish ? "" : scheduledAt,
    };

    if (!normalizedPayload.title.trim()) {
      setError("Title is required.");
      return null;
    }

    if (!autosave) {
      setManualSaving(true);
    }
    setError(null);
    setAutosaveState("saving");

    try {
      const response = await fetch(
        postId ? `/api/posts/${postId}` : "/api/posts",
        {
          method: postId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...normalizedPayload,
            scheduledAt: normalizedPayload.scheduledAt || null,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Save failed");
      }

      const savedPostId = data.post.id as string;
      setPostId(savedPostId);
      if (!title.trim() && data.post.title) {
        setTitle(data.post.title);
      }
      if (options?.publish !== undefined) {
        setPublished(shouldPublish);
      }

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

      if (!postId) {
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
      setManualSaving(false);
    }
  }

  async function handleDelete() {
    if (!postId) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;

    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
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
    const hasDraftContent = Boolean(
      title.trim() ||
        content.trim() ||
        excerpt.trim() ||
        coverImage.trim() ||
        scheduledAt ||
        selectedCategories.length
    );

    if (!hasDraftContent) {
      setAutosaveState("idle");
      return;
    }

    if (payloadKey === lastSavedPayloadRef.current) {
      return;
    }

    setAutosaveState("dirty");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      void savePost({ autosave: true });
    }, 1200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    payloadKey,
    title,
    content,
    excerpt,
    coverImage,
    scheduledAt,
    selectedCategories.length,
  ]);

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
            : "Autosave on";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-sand bg-cream/95 backdrop-blur">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                placeholder="Untitled draft"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border-none bg-transparent text-3xl font-bold text-ink outline-none placeholder:text-ink/20 sm:text-4xl"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/55">
                  {saveLabel}
                </span>
              </div>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={2}
                placeholder="Optional deck or excerpt. Leave it rough and keep moving."
                className="mt-3 w-full resize-none rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink/30 focus:border-canyon/30"
              />
            </div>

            <div className="flex shrink-0 flex-col gap-3 lg:w-[320px]">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => void savePost({ publish: false })}
                  disabled={manualSaving}
                  className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-sand disabled:opacity-50"
                >
                  {manualSaving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Saving
                    </span>
                  ) : (
                    "Save Draft"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScheduledAt("");
                    void savePost({ publish: true });
                  }}
                  disabled={manualSaving || aiLoading}
                  className="rounded-lg bg-canyon px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-canyon-deep disabled:opacity-50"
                >
                  {published ? "Update" : "Publish Now"}
                </button>
                {postId && (
                  <button
                    type="button"
                    onClick={handleDelete}
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

                <div className="mt-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                    Schedule Publish
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => {
                      setPublished(false);
                      setScheduledAt(event.target.value);
                    }}
                    className="mt-2 w-full rounded-lg border border-ink/10 bg-sand px-3 py-2.5 text-sm text-ink outline-none focus:border-canyon/40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 rounded-[26px] border border-white/80 bg-white/85 p-4 shadow-[0_18px_50px_rgba(83,54,24,0.07)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-canyon/80">
                    AI Quick Rewrites
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    Keep momentum. Tap a quick rewrite or type an instruction and
                    the draft updates in place.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-lg border border-ink/10 bg-white/75 p-1">
                  <button
                    type="button"
                    onClick={() => setEditorMode("visual")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      editorMode === "visual"
                        ? "bg-cream text-ink shadow-sm"
                        : "text-ink/50 hover:text-ink"
                    }`}
                  >
                    <Eye size={14} />
                    Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("source")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      editorMode === "source"
                        ? "bg-cream text-ink shadow-sm"
                        : "text-ink/50 hover:text-ink"
                    }`}
                  >
                    <Code2 size={14} />
                    Source
                  </button>
                </div>
              </div>

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
            </div>

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

            <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_18px_50px_rgba(83,54,24,0.07)]">
              <div className="border-b border-sand px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/35">
                  Body
                </p>
              </div>

              <div className="p-5">
                {editorMode === "visual" ? (
                  <EditorProvider config={editorConfig}>
                    <WysiwygEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Start writing your post..."
                      className="relative"
                    />
                  </EditorProvider>
                ) : (
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Write raw MDX here..."
                    spellCheck={false}
                    className="min-h-[520px] w-full resize-y rounded-2xl border border-ink/10 bg-[#171717] p-4 font-mono text-sm leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <aside
          className={`${
            settingsOpen ? "flex" : "hidden"
          } w-[320px] shrink-0 border-l border-sand bg-cream/90 px-5 py-6 xl:flex`}
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
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                Cover Image URL
              </label>
              <input
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
