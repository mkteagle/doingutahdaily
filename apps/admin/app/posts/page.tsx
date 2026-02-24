import Link from "next/link";
import { prisma } from "@dud/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { categories: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} total</p>
        </div>
        <Link
          href="/posts/new"
          className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-sm">No posts yet.</p>
          <Link href="/posts/new" className="mt-4 inline-block text-sm text-red-600 hover:underline">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {posts.map((post: any) => (
            <div key={post.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <Link href={`/posts/${post.id}`} className="font-medium text-gray-900 hover:text-red-700 truncate block">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(post.updatedAt)}</span>
                  {post.categories.slice(0, 2).map((cat: any) => (
                    <span key={cat.id} className="text-xs text-gray-400">{cat.name}</span>
                  ))}
                </div>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="ml-4 text-sm text-gray-400 hover:text-gray-700 shrink-0"
              >
                Edit →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
