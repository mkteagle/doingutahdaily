import sharp from "sharp";
import { z } from "zod";

const photoId = z.string().regex(/^[a-zA-Z0-9_-]{1,128}$/);
const albumSchema = z.object({
  subject_type: z.literal("album"),
  locked: z.literal(false),
  title: z.string(),
  items: z.array(z.object({
    photo_id: photoId,
    photo_title: z.string(),
    media_kind: z.enum(["photo", "video"]),
    date_taken: z.string().nullable().optional(),
    thumb_url: z.url(),
    preview_url: z.url(),
  })),
});

export type KindredPhoto = z.infer<typeof albumSchema>["items"][number];
type Share = { endpoint: URL };

export function kindredAlbumConfigured() {
  return Boolean(process.env.KINDRED_EDITORIAL_ALBUM_URL?.trim());
}

export async function getKindredAlbum() {
  const configured = process.env.KINDRED_EDITORIAL_ALBUM_URL?.trim();
  if (!configured) throw new Error("Kindred is not connected. Configure the editorial album share in admin.");
  const url = new URL(configured);
  const match = /^\/s\/([A-Za-z0-9_-]{12,180})\/?$/.exec(url.pathname);
  if (url.protocol !== "https:" || url.username || url.password || !match) {
    throw new Error("Kindred needs the HTTPS share link for an editorial album.");
  }

  const endpoint = new URL(`/api/backend/public/shares/${match[1]}`, url.origin);
  const password = process.env.KINDRED_EDITORIAL_ALBUM_PASSWORD;
  const response = await fetch(password ? `${endpoint}/unlock` : endpoint, {
    ...(password && {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("The Kindred album is unavailable. Check its share link, password, and expiration.");
  const data = albumSchema.safeParse(await response.json());
  if (!data.success) throw new Error("Kindred needs an unlocked album share. Check the share and its password.");
  const photos = data.data.items.filter((item) => item.media_kind === "photo");
  return { share: { endpoint }, title: data.data.title, photos };
}

export async function readKindredPhoto(share: Share, photo: KindredPhoto, variant: "thumb" | "preview") {
  const descriptor = new URL(variant === "thumb" ? photo.thumb_url : photo.preview_url);
  const endpoint = new URL(`${share.endpoint}/media/${photo.photo_id}`);
  if (endpoint.pathname !== `/api/backend${descriptor.pathname}` && endpoint.pathname !== descriptor.pathname) {
    throw new Error("Kindred returned an invalid image path.");
  }

  endpoint.searchParams.set("variant", variant);
  for (const key of ["exp", "sig"]) {
    const value = descriptor.searchParams.get(key);
    if (value) endpoint.searchParams.set(key, value);
  }

  const response = await fetch(endpoint, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000) });
  const maxBytes = 12 * 1024 * 1024;
  if (!response.ok || !response.body || !(response.headers.get("content-type") ?? "").startsWith("image/")) {
    throw new Error("Kindred could not deliver that photo.");
  }
  if (Number(response.headers.get("content-length")) > maxBytes) throw new Error("The photo exceeds the upload size limit.");

  let size = 0;
  const chunks = [];
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("The photo exceeds the upload size limit.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const image = sharp(Buffer.concat(chunks), { limitInputPixels: 45_000_000 });
  const { format } = await image.metadata();
  if (!format || !["jpeg", "png", "webp", "gif", "heif", "avif"].includes(format)) {
    throw new Error("Kindred returned an unsupported photo format.");
  }
  return image.rotate()
    .resize({ width: variant === "thumb" ? 420 : 1800, height: variant === "thumb" ? 420 : 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: variant === "thumb" ? 72 : 85 })
    .toBuffer();
}
