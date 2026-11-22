import { Images, Instagram, Play } from "lucide-react";

type InstagramCardPost = {
  mediaType: string | null;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
  permalink: string;
};

export function InstagramPostCard({ post, showCaption = false }: { post: InstagramCardPost; showCaption?: boolean }) {
  const image = post.thumbnailUrl ?? (post.mediaType === "VIDEO" ? null : post.mediaUrl);
  const Mark = post.mediaType === "VIDEO" ? Play : post.mediaType === "CAROUSEL" ? Images : null;
  const kind = post.mediaType === "VIDEO" ? "Video" : post.mediaType === "CAROUSEL" ? "Carousel" : "Post";
  const caption = post.caption?.trim();
  const label = caption ? `${kind}: ${caption.slice(0, 120)}` : `${kind} on Instagram`;

  return (
    <a href={post.permalink} aria-label={label} className="group block rounded-xl">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-muted">
        {image ? (
          // Instagram uses temporary URLs on multiple CDN hosts.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
        ) : (
          <div className="grid justify-items-center gap-2 px-2 text-center text-sm font-medium text-muted-foreground">
            <Instagram size={24} aria-hidden /> View on Instagram
          </div>
        )}
        {Mark && <Mark size={24} className="absolute right-3 top-3 rounded-md bg-black/75 p-1 text-white" aria-hidden />}
      </div>
      {showCaption && caption && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground group-hover:text-primary">{caption}</p>
      )}
    </a>
  );
}
