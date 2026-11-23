import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

export function isPostImageType(value: string): value is keyof typeof extensions {
  return Object.prototype.hasOwnProperty.call(extensions, value);
}

export function postAssetsPublicUrl() {
  return postAssetsWorker()?.url || postAssetsS3PublicUrl();
}

function postAssetsWorker() {
  const url = process.env.POST_ASSETS_R2_WORKER_URL;
  const token = process.env.POST_ASSETS_R2_WORKER_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

function postAssetsS3PublicUrl() {
  return process.env.POST_ASSETS_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL;
}

function postAssetStorage() {
  const accessKeyId = process.env.POST_ASSETS_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.POST_ASSETS_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.POST_ASSETS_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME;
  const endpoint = process.env.POST_ASSETS_R2_ENDPOINT || process.env.R2_ENDPOINT;
  const publicUrl = postAssetsS3PublicUrl();
  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint || !publicUrl) return null;
  return { accessKeyId, secretAccessKey, bucket, endpoint, publicUrl };
}

export function postAssetStorageConfigured() {
  return Boolean(postAssetsWorker() || postAssetStorage());
}

export async function storePostImage(input: {
  body: Uint8Array;
  contentType: keyof typeof extensions;
  slug: string;
  imageKey?: string;
  signal?: AbortSignal;
}) {
  const filename = input.imageKey ?? crypto.randomUUID();
  const key = `posts/${input.slug}/${filename}.${extensions[input.contentType]}`;
  const worker = postAssetsWorker();
  if (worker) {
    const url = `${worker.url}/${key}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${worker.token}`,
        "Content-Type": input.contentType,
      },
      body: new Uint8Array(input.body),
      redirect: "error",
      signal: input.signal,
    });
    if (!response.ok) throw new Error(`Story image storage returned HTTP ${response.status}.`);
    return url;
  }

  const config = postAssetStorage();
  if (!config) throw new Error("Post asset storage is not configured.");
  const { accessKeyId, secretAccessKey, bucket, endpoint, publicUrl } = config;

  const client = new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey } });
  try {
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: input.body, ContentType: input.contentType }), {
      abortSignal: input.signal,
    });
  } finally {
    client.destroy();
  }
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}
