import { postService, socialService } from "@dud/db";
import { Home } from "@/components/screens/Home";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

export default async function Page() {
  const [posts, social] = await Promise.allSettled([
    postService.getPublishedPostSummaries(3),
    socialService.getSocialPosts({ platform: "instagram", limit: 4 }),
  ]);

  return (
    <Home
      posts={posts.status === "fulfilled" ? posts.value.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
      })) : []}
      instagram={social.status === "fulfilled" ? social.value : []}
    />
  );
}
