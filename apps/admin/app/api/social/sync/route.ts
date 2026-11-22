import { getAdminSession } from "@/auth";
import { instagramSyncResponse } from "@/lib/instagramSync";

export const maxDuration = 120;

export async function POST() {
  if (!await getAdminSession()) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return instagramSyncResponse();
}
