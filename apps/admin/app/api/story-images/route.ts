import { adminOrigin, getAdminSession } from "@/auth";
import { STORY_IMAGE_BYTES } from "@/lib/storyImageLimits";
import { uploadStoryImage } from "@/lib/storyImages";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== adminOrigin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!await getAdminSession(request.headers)) return Response.json({ error: "Sign in to upload images." }, { status: 401 });
  if (Number(request.headers.get("content-length")) > STORY_IMAGE_BYTES) {
    return Response.json({ error: "Choose an image up to 3 MB." }, { status: 413 });
  }
  if (!request.body) return Response.json({ error: "Choose an image." }, { status: 400 });

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > STORY_IMAGE_BYTES) {
        await reader.cancel();
        return Response.json({ error: "Choose an image up to 3 MB." }, { status: 413 });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const result = await uploadStoryImage(Buffer.concat(chunks));
  return result.error
    ? Response.json({ error: result.error }, { status: result.status })
    : Response.json({ url: result.url }, { status: 201 });
}
