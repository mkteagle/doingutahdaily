import { BlogPost } from "@/components/screens/BlogPost";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = (await params).slug;
  return <BlogPost slug={slug} />;
}
