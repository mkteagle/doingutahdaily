"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

interface SocialPost {
  id: string;
  platform: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  permalink: string;
  timestamp: string;
}

export function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(getApiUrl("/social?limit=12"));
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching social posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <div className="py-12 text-center text-gray-400">Loading...</div>;
  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Follow Us</h2>
          <p className="text-gray-600 mt-2">See what's happening on Instagram & TikTok</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="group aspect-square bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative w-full h-full">
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.caption || "Social post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : post.thumbnailUrl ? (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.caption || "Social post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-bold bg-white text-gray-900 px-2 py-1 rounded uppercase">
                    {post.platform}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/doingutahdaily"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            View more on Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
