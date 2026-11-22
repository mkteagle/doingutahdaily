import { socialService } from "@dud/db";

const GRAPH = "https://graph.instagram.com/v27.0";
const ACCOUNT = "doingutahdaily";
const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}";

type Profile = { user_id?: string | number; username?: string };
type Media = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: { data?: Media[] };
};

type MediaPage = {
  data?: Media[];
  paging?: { next?: string; cursors?: { after?: string } };
};

class InstagramSyncError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function graphRequest<T>(path: string, params: Record<string, string>, token: string, deadline: number): Promise<T> {
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new InstagramSyncError("Instagram took too long to return the archive. Try again.", 504);

  const url = new URL(GRAPH + path);
  url.search = new URLSearchParams({ ...params, access_token: token }).toString();
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(Math.min(remaining, 12_000)),
    });
  } catch {
    // Fetch errors can include the request URL and token.
    throw new InstagramSyncError("Instagram could not be reached. Try again.", 502);
  }

  const payload = await response.json().catch(() => null) as (T & { error?: { code?: number } }) | null;
  if (!response.ok || !payload || payload.error) {
    if (payload?.error?.code === 190 || response.status === 401) {
      throw new InstagramSyncError("Meta rejected the access token. Replace it with a valid Instagram Login token.", 502);
    }
    if (response.status === 429 || payload?.error?.code === 4 || payload?.error?.code === 17) {
      throw new InstagramSyncError("Instagram is limiting requests. Try again later.", 502);
    }
    throw new InstagramSyncError("Meta could not return Instagram posts. Check the account and instagram_business_basic permission.", 502);
  }
  return payload;
}

function httpsUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function normalizePost(media: Media): socialService.InstagramPost | null {
  const permalink = httpsUrl(media.permalink);
  if (!media.id || !media.timestamp || !Number.isFinite(Date.parse(media.timestamp)) || !permalink) return null;
  const { hostname } = new URL(permalink);
  if (hostname !== "www.instagram.com" && hostname !== "instagram.com") return null;

  const mediaType = media.media_type === "CAROUSEL_ALBUM" ? "CAROUSEL" : media.media_type;
  if (mediaType !== "IMAGE" && mediaType !== "VIDEO" && mediaType !== "CAROUSEL") return null;

  const carouselCover = media.children?.data?.map((item) =>
    httpsUrl(item.thumbnail_url) ?? (item.media_type === "IMAGE" ? httpsUrl(item.media_url) : undefined),
  ).find(Boolean);

  return {
    id: media.id,
    caption: typeof media.caption === "string" ? media.caption : undefined,
    mediaType,
    permalink,
    timestamp: media.timestamp,
    mediaUrl: httpsUrl(media.media_url) ?? carouselCover,
    thumbnailUrl: httpsUrl(media.thumbnail_url) ?? carouselCover,
  };
}

async function syncInstagram() {
  const token = process.env.INSTAGRAM_GRAPH_TOKEN?.trim();
  if (!token) throw new InstagramSyncError("Instagram is not connected. Set INSTAGRAM_GRAPH_TOKEN on the admin server first.", 503);

  const deadline = Date.now() + 100_000;
  const user = await graphRequest<Profile & { data?: Profile[] }>(
    "/me",
    { fields: "user_id,username" },
    token,
    deadline,
  );
  const profile = user.data?.[0] ?? user;
  if (profile.username?.toLowerCase() !== ACCOUNT) {
    throw new InstagramSyncError("This token belongs to a different account. Generate one for @doingutahdaily.", 502);
  }
  const userId = typeof profile.user_id === "string" || Number.isSafeInteger(profile.user_id)
    ? String(profile.user_id)
    : "";
  if (!/^\d+$/.test(userId)) throw new InstagramSyncError("Meta did not return the Instagram account ID.", 502);

  const posts = new Map<string, socialService.InstagramPost>();
  const seenCursors = new Set<string>();
  let after: string | undefined;

  do {
    const params: Record<string, string> = { fields: MEDIA_FIELDS, limit: "50" };
    if (after) params.after = after;

    const page = await graphRequest<MediaPage>(`/${userId}/media`, params, token, deadline);
    if (!Array.isArray(page.data)) throw new InstagramSyncError("Meta returned an incomplete page of Instagram posts.", 502);
    for (const item of page.data) {
      const post = normalizePost(item);
      if (post) posts.set(post.id, post);
    }

    if (!page.paging?.next) break;
    // Send only the cursor back to the same account endpoint.
    after = page.paging.cursors?.after;
    if (!after || seenCursors.has(after)) throw new InstagramSyncError("Instagram pagination paused unexpectedly. Try again.", 502);
    seenCursors.add(after);
  } while (after);

  await socialService.upsertInstagramPosts([...posts.values()]);
  return posts.size;
}

export async function instagramSyncResponse() {
  try {
    const synced = await syncInstagram();
    return Response.json({ synced });
  } catch (error) {
    if (error instanceof InstagramSyncError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("Could not save the Instagram archive to Railway.");
    return Response.json({ error: "Could not save Instagram posts. Check the admin database connection." }, { status: 500 });
  }
}
