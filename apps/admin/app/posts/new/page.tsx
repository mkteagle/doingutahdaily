import Link from "next/link";
import { postAssetStorageConfigured } from "@dud/content-engine/post-assets";
import { PostEditor } from "@/components/PostEditor";

export default function NewPostPage() {
  return (
    <div>
      <header className="flex items-center gap-2 border-b border-ink/10 bg-cream px-5 py-3 text-sm sm:px-6">
        <Link href="/posts" className="font-semibold text-canyon hover:underline">Stories</Link>
        <span aria-hidden="true">/</span> <span>New story</span>
      </header>
      <PostEditor canUploadImages={postAssetStorageConfigured()} />
    </div>
  );
}
