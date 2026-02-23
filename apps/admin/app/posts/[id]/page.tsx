import { notFound } from "next/navigation";
import { prisma } from "@dud/db";
import { PostEditor } from "@/components/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { categories: true },
  });

  if (!post) notFound();

  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-5 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold text-gray-900">Edit Post</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">/blog/{post.slug}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <PostEditor post={post} />
      </div>
    </div>
  );
}
