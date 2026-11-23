const imagePath = /^\/posts\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:[a-f0-9]{64}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})\.(jpg|png|webp|gif)$/;
const contentTypes = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" } as const;
const maxImageBytes = 4 * 1024 * 1024;
const encoder = new TextEncoder();

function canWrite(request: Request, token: string | undefined) {
  if (!token) return false;
  const supplied = encoder.encode(request.headers.get("Authorization") ?? "");
  const expected = encoder.encode(`Bearer ${token}`);
  return supplied.length === expected.length && crypto.subtle.timingSafeEqual(supplied, expected);
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const match = imagePath.exec(pathname);
    if (!match || pathname.length > 300) return new Response(null, { status: 404 });
    const key = pathname.slice(1);
    const contentType = contentTypes[match[1] as keyof typeof contentTypes];

    if (request.method === "PUT") {
      if (!canWrite(request, env.STORY_IMAGES_WRITE_TOKEN)) return new Response(null, { status: 401 });
      if (request.headers.get("Content-Type") !== contentType) return new Response(null, { status: 415 });
      const size = Number(request.headers.get("Content-Length"));
      if (!request.body || !Number.isInteger(size) || size < 1 || size > maxImageBytes) {
        return new Response(null, { status: 413 });
      }

      await env.STORY_IMAGES.put(key, request.body, {
        httpMetadata: { contentType },
        onlyIf: new Headers({ "If-None-Match": "*" }),
      });
      return new Response(null, { status: 204 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, { status: 405, headers: { Allow: "GET, HEAD, PUT" } });
    }

    const imageWithBody = request.method === "GET" ? await env.STORY_IMAGES.get(key) : null;
    const image = request.method === "HEAD" ? await env.STORY_IMAGES.head(key) : imageWithBody;
    if (!image) return new Response(null, { status: 404 });

    return new Response(imageWithBody?.body ?? null, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(image.size),
        "Cache-Control": "public, max-age=86400, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
} satisfies ExportedHandler<Env>;
