"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdxEditor } from "@mkteagle/mdx-wysiwyg";
import "@mkteagle/mdx-wysiwyg/styles";

const CATEGORIES = [
  "Family Activities", "Outdoor Adventures", "Indoor Activities",
  "Seasonal Events", "Free Events", "Holiday Events",
  "Food & Dining", "Arts & Culture",
  "Spring", "Summer", "Fall", "Winter",
];

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage: string | null;
    published: boolean;
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
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="text-sm px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {published ? "Update" : "Publish"}
          </button>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
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
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent mb-6"
          />
          <MdxEditor value={content} onChange={setContent} />
        </div>

        {/* Sidebar */}
        <aside className="w-64 border-l border-gray-200 bg-white overflow-auto px-5 py-6 space-y-6 shrink-0">
          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={() => setPublished(!published)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  published ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                  published ? "translate-x-4.5" : "translate-x-0.5"
                }`} />
              </button>
              <span className="text-sm text-gray-600">{published ? "Published" : "Draft"}</span>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Brief description..."
              className="mt-2 w-full text-sm border border-gray-200 rounded-md p-2.5 outline-none focus:border-red-400 resize-none text-gray-700 placeholder-gray-300"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full text-sm border border-gray-200 rounded-md p-2.5 outline-none focus:border-red-400 text-gray-700 placeholder-gray-300"
            />
            {coverImage && (
              <img src={coverImage} alt="Cover" className="mt-2 w-full h-24 object-cover rounded-md" />
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    selectedCategories.includes(cat)
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
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
