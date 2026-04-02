import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function getR2Config() {
  const accessKeyId =
    process.env.POST_ASSETS_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.POST_ASSETS_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
  const bucket =
    process.env.POST_ASSETS_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME;
  const endpoint =
    process.env.POST_ASSETS_R2_ENDPOINT || process.env.R2_ENDPOINT;
  const publicUrl =
    process.env.POST_ASSETS_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;

  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint || !publicUrl) {
    throw new Error(
      "Post asset storage is not fully configured. Set POST_ASSETS_R2_ACCESS_KEY_ID, POST_ASSETS_R2_SECRET_ACCESS_KEY, POST_ASSETS_R2_BUCKET_NAME, POST_ASSETS_R2_ENDPOINT, and POST_ASSETS_R2_PUBLIC_URL."
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint,
    publicUrl: publicUrl.replace(/\/$/, ""),
  };
}

function getR2Client() {
  const config = getR2Config();
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function inferExtension(contentType: string, sourceUrl: string) {
  if (contentType === "image/jpeg") return ".jpg";
  if (contentType === "image/png") return ".png";
  if (contentType === "image/webp") return ".webp";
  if (contentType === "image/gif") return ".gif";

  try {
    const pathname = new URL(sourceUrl).pathname;
    const ext = pathname.includes(".") ? pathname.slice(pathname.lastIndexOf(".")) : "";
    return ext && ext.length <= 5 ? ext.toLowerCase() : "";
  } catch {
    return "";
  }
}

export async function uploadRemoteImageToPostStorage(input: {
  sourceUrl: string;
  slug: string;
}) {
  const source = await fetch(input.sourceUrl);
  if (!source.ok) {
    throw new Error(`Failed to fetch image: ${input.sourceUrl}`);
  }

  const contentType = source.headers.get("content-type")?.split(";")[0].trim() || "";
  if (!IMAGE_MIME_TYPES.has(contentType)) {
    throw new Error(`Unsupported image type: ${contentType || "unknown"}`);
  }

  const body = Buffer.from(await source.arrayBuffer());
  const config = getR2Config();
  const client = getR2Client();
  const extension = inferExtension(contentType, input.sourceUrl);
  const storageKey = `posts/${input.slug}/${crypto.randomUUID()}${extension}`;

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: storageKey,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${config.publicUrl}/${storageKey}`;
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
