import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Doing Utah Daily Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/posts">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-primary cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Posts</h2>
            <p className="text-gray-600">Manage blog posts</p>
          </div>
        </Link>

        <Link href="/social">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-primary cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Social Feed</h2>
            <p className="text-gray-600">Manage Instagram & TikTok</p>
          </div>
        </Link>

        <Link href="/events">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-primary cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <p className="text-gray-600">Manage calendar events</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
