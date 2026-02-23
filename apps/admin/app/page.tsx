import Link from "next/link";

const cards = [
  { label: "Posts", href: "/posts", description: "Write and manage blog posts", icon: "✎" },
  { label: "Social Feed", href: "/social", description: "Sync Instagram & TikTok", icon: "◈" },
  { label: "Events", href: "/events", description: "Manage calendar events", icon: "◷" },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome to the Doing Utah Daily admin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-red-300 hover:shadow-sm transition-all cursor-pointer">
              <span className="text-2xl mb-3 block">{card.icon}</span>
              <h2 className="font-semibold text-gray-900">{card.label}</h2>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
