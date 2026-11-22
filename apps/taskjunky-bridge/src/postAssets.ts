import { isPostImageType, storePostImage } from "@dud/content-engine/post-assets";

export async function uploadRemoteImageToPostStorage(input: {
  sourceUrl: string;
  slug: string;
}) {
  const source = await fetch(input.sourceUrl);
  if (!source.ok) {
    throw new Error(`Failed to fetch image: ${input.sourceUrl}`);
  }

  const contentType = source.headers.get("content-type")?.split(";")[0].trim() || "";
  if (!isPostImageType(contentType)) {
    throw new Error(`Unsupported image type: ${contentType || "unknown"}`);
  }

  return storePostImage({
    body: new Uint8Array(await source.arrayBuffer()),
    contentType,
    slug: input.slug,
  });
}

export async function uploadRemoteImagesToPostStorage(input: {
  imageUrls: string[];
  slug: string;
}) {
  const uploaded: string[] = [];

  for (const imageUrl of input.imageUrls) {
    uploaded.push(
      await uploadRemoteImageToPostStorage({
        sourceUrl: imageUrl,
        slug: input.slug,
      })
    );
  }

  return uploaded;
}
