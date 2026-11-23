import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import type { BlogMeta } from "@/types/blog";
import { InstagramPostCard } from "@/components/Home/InstagramPostCard";
import { INSTAGRAM_URL } from "@/lib/social";

const starts = [
  {
    label: "Easy hikes",
    href: "/activities?category=Outdoor+Adventures",
    description: "Kid-friendly trails with big Utah views.",
    image: "/images/field-guide-hikes.webp",
    alt: "A young hiker on a rocky mountain trail",
  },
  {
    label: "Free outings",
    href: "/activities?cost=free",
    description: "Low- or no-cost ways to explore and play around Utah.",
    image: "/images/field-guide-free.webp",
    alt: "A family walking toward the Utah State Capitol",
  },
  {
    label: "Rainy-day plans",
    href: "/blog?categories=Indoor+Activities",
    description: "Indoor ideas for museum days, creative play, and more.",
    image: "/assets/blog/utah-tumbling-academy/cover.jpg",
    alt: "A child smiling at Utah Tumbling Academy",
  },
];

interface SocialPreview {
  id: string;
  mediaType: string | null;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  permalink: string;
}

export function Home({
  posts,
  instagram,
}: {
  posts: Pick<BlogMeta, "slug" | "title" | "excerpt">[];
  instagram: SocialPreview[];
}) {
  return (
    <>
      <section className="field-hero">
        <div className="field-hero-photo">
          <Image
            src="/images/field-guide-hero.webp"
            alt="A mother and child hiking through golden aspens"
            fill
            preload
            sizes="(min-width: 768px) 70vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="field-hero-ridge" aria-hidden="true" />
        <div className="field-hero-content field-container">
          <h1>Things to do<br className="hidden md:block" />{" "}in Utah with kids</h1>
          <p>Places we love taking our kids, with tips for planning your own outing.</p>
          <Link href="/activities" className="field-button">
            Browse activities <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      </section>

      <section className="field-container field-section" aria-labelledby="start-here">
        <div className="field-section-heading">
          <h2 id="start-here">Find an outing</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {starts.map((start) => (
            <Link href={start.href} key={start.label} className="group block">
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={start.image}
                  alt={start.alt}
                  fill
                  sizes="(min-width: 1280px) 390px, (min-width: 640px) 32vw, 100vw"
                  className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                />
              </div>
              <h3 className="field-topic mt-3">{start.label}</h3>
              <p className="mt-2 max-w-[28ch] text-base leading-snug sm:text-lg">{start.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="field-container field-section" aria-labelledby="instagram-heading">
        <div className="field-section-heading">
          <h2 id="instagram-heading">From Instagram</h2>
          <Link href="/instagram">All Instagram posts <ArrowRight size={16} aria-hidden /></Link>
        </div>
        {instagram.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {instagram.map((post) => <li key={post.id}><InstagramPostCard post={post} /></li>)}
          </ul>
        ) : (
          <a href={INSTAGRAM_URL} className="flex items-center gap-3 rounded-xl border border-border px-5 py-5 hover:bg-card">
            <Instagram size={22} aria-hidden />
            <span>Find our latest outings and reels on Instagram.</span>
          </a>
        )}
      </section>

      {posts.length > 0 && (
        <section className="field-container field-section" aria-labelledby="stories-heading">
          <div className="field-section-heading">
            <h2 id="stories-heading">Stories &amp; guides</h2>
            <Link href="/blog">Browse all stories <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-border pt-4">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h3 className="font-display text-3xl group-hover:text-canyon">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
