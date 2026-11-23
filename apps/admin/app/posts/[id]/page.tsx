import Link from "next/link";
import { notFound } from "next/navigation";
import { postService } from "@dud/db";
import { postAssetStorageConfigured } from "@dud/content-engine/post-assets";
import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await postService.getPostById(id);

  if (!post) notFound();

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-cream px-5 py-3 text-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/posts" className="font-semibold text-canyon hover:underline">Stories</Link>
          <span aria-hidden="true">/</span> <span>Edit story</span>
        </div>
        {post.published && (
          <a href={`https://www.doingutahdaily.com/blog/${encodeURIComponent(post.slug)}`} className="text-canyon hover:underline">
            View live story
          </a>
        )}
      </header>
      <PostEditor post={post} canUploadImages={postAssetStorageConfigured()} />
    </div>
  );
}
