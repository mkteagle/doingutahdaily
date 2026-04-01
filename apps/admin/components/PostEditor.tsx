"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdxEditor } from "@mkteagle/mdx-wysiwyg";
import "@mkteagle/mdx-wysiwyg/styles";
import { Loader2, Trash2 } from "lucide-react";
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-sand bg-cream">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="text-sm px-3 py-1.5 border border-ink/15 rounded-lg text-ink/70 hover:bg-sand disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Save Draft"}
          </button>
          <button
            onClick={() => {
              setScheduledAt("");
              void handleSave(true);
            }}
            disabled={saving}
            className="text-sm px-3 py-1.5 bg-canyon text-white rounded-lg hover:bg-canyon-deep disabled:opacity-50 transition-colors"
          >
            {published ? "Update" : "Publish"}
          </button>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="text-sm text-ink/30 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Editor area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-ink placeholder-ink/20 border-none outline-none bg-transparent mb-6"
          />
          <MdxEditor value={content} onChange={setContent} />
        </div>

        {/* Sidebar */}
        <aside className="w-64 border-l border-sand bg-cream overflow-auto px-5 py-6 space-y-6 shrink-0">
          {/* Status */}
          <div>
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em]">
              Status
            </label>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => setPublished(!published)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  published ? "bg-sage" : "bg-ink/20"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    published ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-ink/60">
                {published ? "Published" : "Draft"}
              </span>
            </div>
            {!published && (
              <p className="mt-2 text-xs leading-5 text-ink/45">
                Save as a draft, or pick a future date below to have it publish
                automatically.
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em]">
              Schedule Publish
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => {
                setPublished(false);
                setScheduledAt(e.target.value);
              }}
              className="mt-2 w-full text-sm border border-ink/10 rounded-lg p-2.5 outline-none focus:border-canyon/40 text-ink bg-sand"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => void handleSave(false)}
                disabled={saving}
                className="text-xs px-2.5 py-1.5 border border-ink/10 rounded-lg text-ink/65 hover:bg-white transition-colors disabled:opacity-50"
              >
                Save Schedule
              </button>
              {scheduledAt && (
                <button
                  type="button"
                  onClick={() => setScheduledAt("")}
                  className="text-xs px-2.5 py-1.5 text-ink/45 hover:text-canyon transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em]">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Brief description..."
              className="mt-2 w-full text-sm border border-ink/10 rounded-lg p-2.5 outline-none focus:border-canyon/40 resize-none text-ink placeholder-ink/25 bg-sand"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em]">
              Cover Image URL
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full text-sm border border-ink/10 rounded-lg p-2.5 outline-none focus:border-canyon/40 text-ink placeholder-ink/25 bg-sand"
            />
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Cover"
                className="mt-2 w-full h-24 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em]">
              Categories
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {POST_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                    selectedCategories.includes(cat)
                      ? "bg-canyon/10 border-canyon/30 text-canyon font-medium"
                      : "bg-sand border-ink/10 text-ink/50 hover:border-ink/25"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
