import Link from "next/link";
import { postService } from "@dud/db";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await postService.getAllPosts();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Posts</h1>
          <p className="text-sm text-ink/40 mt-0.5">{posts.length} total</p>
        </div>
        <Link
          href="/posts/new"
          className="flex items-center gap-1.5 bg-canyon text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-canyon-deep transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-cream border border-sand rounded-xl p-12 text-center">
          <p className="text-ink/30 text-sm">No posts yet.</p>
          <Link href="/posts/new" className="mt-4 inline-block text-sm text-canyon hover:underline">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-cream border border-sand rounded-xl divide-y divide-sand">
          {posts.map((post: any) => (
            <div key={post.id} className="flex items-center justify-between px-5 py-4 hover:bg-sand/50 transition-colors">
              <div className="flex-1 min-w-0">
                <Link href={`/posts/${post.id}`} className="font-medium text-ink hover:text-canyon truncate block transition-colors">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.published
                      ? "bg-sage/15 text-sage"
                      : "bg-ink/5 text-ink/40"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-ink/30">{formatDate(post.updatedAt)}</span>
                  {post.categories.slice(0, 2).map((cat: any) => (
                    <span key={cat.id} className="text-xs text-ink/30">{cat.name}</span>
                  ))}
                </div>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="ml-4 text-sm text-ink/30 hover:text-canyon shrink-0 transition-colors"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
