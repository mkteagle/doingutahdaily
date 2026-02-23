"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface SocialPost {
  id: string;
  platform: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  timestamp: string;
  cachedAt: string;
}

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/social" : `/api/social?platform=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/social/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        await fetchPosts();
        alert(`Synced ${data.synced} Instagram posts`);
      }
    } catch (error) {
      alert("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Feed</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} posts</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {syncing ? "Syncing..." : "Sync Instagram"}
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {["all", "instagram", "tiktok"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
              filter === f
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-sm">No posts yet. Click "Sync Instagram" to load posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption || "Social post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : post.thumbnailUrl ? (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.caption || "Social post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {post.platform}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(post.timestamp)}</span>
                </div>
                {post.caption && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{post.caption}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
