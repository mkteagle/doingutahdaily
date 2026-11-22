import { instagramSyncResponse } from "@/lib/instagramSync";

export const maxDuration = 120;

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.INSTAGRAM_GRAPH_TOKEN?.trim()) {
    return new Response(null, { status: 204 });
  }

  return instagramSyncResponse();
}
