import { auth, isApprovedAdmin } from "@/auth";
import { instagramSyncResponse } from "@/lib/instagramSync";

export const maxDuration = 120;

export async function POST() {
  const session = await auth();
  if (!isApprovedAdmin(session?.user?.email)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return instagramSyncResponse();
}
