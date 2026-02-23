import { PostEditor } from "@/components/PostEditor";

export default function NewPostPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-5 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold text-gray-900">New Post</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <PostEditor />
      </div>
    </div>
  );
}
