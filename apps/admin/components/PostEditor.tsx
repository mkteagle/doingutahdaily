"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorProvider, WysiwygEditor } from "@mkteagle/mdx-wysiwyg";
import "@mkteagle/mdx-wysiwyg/styles";
import { ChevronDown, ChevronUp, Code2, Eye, Loader2, Sparkles, Trash2 } from "lucide-react";
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

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [scheduledAt, setScheduledAt] = useState(
    toDatetimeLocalValue(post?.scheduledAt)
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map((c) => c.name) ?? []
  );
  const [editorMode, setEditorMode] = useState<"visual" | "source">("visual");
  const [settingsOpen, setSettingsOpen] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorConfig = useMemo(
    () => ({
      classNames: {
        editor: "min-h-[520px] focus:outline-none wysiwyg-editor",
        placeholder: "absolute top-3 left-4 m-0 text-base pointer-events-none text-ink/25",
      },
    }),
    []
  );

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  async function handleSave(publish?: boolean) {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);

    const shouldPublish = publish !== undefined ? publish : published;
    const payload = {
      title,
      content,
      excerpt,
      coverImage,
      published: shouldPublish,
      scheduledAt: shouldPublish ? null : scheduledAt || null,
      categories: selectedCategories,
    };

    try {
      const res = await fetch(
        isNew ? "/api/posts" : `/api/posts/${post.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (isNew) {
        router.push(`/posts/${data.post.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    router.push("/posts");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-sand bg-cream/95 backdrop-blur">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-canyon/80">
                <Sparkles size={13} />
                {isNew ? "New Post" : "Editing Draft"}
              </div>
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-3 w-full border-none bg-transparent text-3xl font-bold text-ink outline-none placeholder:text-ink/20 sm:text-4xl"
              />
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Give yourself a short deck or excerpt so the post already feels shaped before you publish."
                className="mt-3 w-full resize-none rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink/30 focus:border-canyon/30"
              />
            </div>

            <div className="flex shrink-0 flex-col gap-3 lg:w-[320px]">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => void handleSave(false)}
                  disabled={saving}
                  className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-sand disabled:opacity-50"
                >
                  {saving ? (
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
                    void handleSave(true);
                  }}
                  disabled={saving}
                  className="rounded-lg bg-canyon px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-canyon-deep disabled:opacity-50"
                >
                  {published ? "Update" : "Publish Now"}
                </button>
                {!isNew && (
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
                          : "This post is currently a draft."}
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
                    onChange={(e) => {
                      setPublished(false);
                      setScheduledAt(e.target.value);
                    }}
                    className="mt-2 w-full rounded-lg border border-ink/10 bg-sand px-3 py-2.5 text-sm text-ink outline-none focus:border-canyon/40"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleSave(false)}
                      disabled={saving}
                      className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs text-ink/65 transition-colors hover:bg-white disabled:opacity-50"
                    >
                      Save Schedule
                    </button>
                    {scheduledAt && (
                      <button
                        type="button"
                        onClick={() => setScheduledAt("")}
                        className="rounded-lg px-2.5 py-1.5 text-xs text-ink/45 transition-colors hover:text-canyon"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center rounded-lg border border-ink/10 bg-white/75 p-1">
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
                    onChange={(e) => setContent(e.target.value)}
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
                Keep this panel for details that matter near publishing time, not while you are trying to get words down.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
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
                {POST_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
                      selectedCategories.includes(cat)
                        ? "border-canyon/30 bg-canyon/10 font-medium text-canyon"
                        : "border-ink/10 bg-sand text-ink/50 hover:border-ink/25"
                    }`}
                  >
                    {cat}
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
