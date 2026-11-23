import { createHash } from "node:crypto";
import { postAssetStorageConfigured, storePostImage } from "@dud/content-engine/post-assets";
import sharp from "sharp";
import { STORY_IMAGE_BYTES } from "./storyImageLimits";

export async function uploadStoryImage(bytes: Uint8Array) {
  if (!postAssetStorageConfigured()) {
    return { error: "R2 image storage isn’t connected for this site. The file is still selected.", status: 503 } as const;
  }
  if (!bytes.byteLength || bytes.byteLength > STORY_IMAGE_BYTES) {
    return { error: "Choose an image up to 3 MB.", status: 413 } as const;
  }

  let body: Buffer;
  try {
    const image = sharp(bytes, { limitInputPixels: 45_000_000 });
    const { format, compression } = await image.metadata();
    if (!format || !(["jpeg", "png", "webp"].includes(format) || (format === "heif" && compression === "av1"))) {
      return { error: "Choose a JPEG, PNG, WebP, or AVIF image.", status: 415 } as const;
    }
    body = await image.rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return { error: "This image couldn’t be read. Try another file.", status: 400 } as const;
  }

  try {
    const imageKey = createHash("sha256").update(body).digest("hex");
    const url = await storePostImage({
      slug: "inline", body, contentType: "image/webp", imageKey, signal: AbortSignal.timeout(15_000),
    });
    return { url };
  } catch {
    return { error: "Image storage is unavailable. Try again later.", status: 502 } as const;
  }
}
