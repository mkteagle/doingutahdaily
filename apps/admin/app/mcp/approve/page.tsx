import { auth, getAdminSession } from "@/auth";
import { getMcpOAuthQuery } from "@/lib/mcpOAuthQuery";
import { headers } from "next/headers";
import { ConsentButtons } from "./ConsentButtons";

export default async function McpApprovalPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const requestHeaders = await headers();
  const [session, query] = await Promise.all([
    getAdminSession(requestHeaders),
    searchParams.then(getMcpOAuthQuery),
  ]);
  const clientId = query?.get("client_id");
  const callback = query?.get("redirect_uri");
  const client = session && clientId && callback
    ? await auth.api.getOAuthClientPublic({ headers: requestHeaders, query: { client_id: clientId } }).catch(() => null)
    : null;

  return (
    <div className="grid min-h-dvh place-items-center px-6 py-12">
      <section className="admin-panel w-full max-w-md space-y-4 p-6">
        <h1 className="admin-heading">Connect the story editor</h1>
        {session && query && callback && client ? (
          <>
            <p className="text-ink/75">
              Allow <strong>{client.client_name || "this app"}</strong> to find, create, and edit Doing Utah Daily drafts and upload photos?
            </p>
            <p className="text-sm text-ink/75">Signed in as {session.user.email}.</p>
            <p className="text-sm text-ink/75">You’ll return to {new URL(callback).host}.</p>
            <ConsentButtons query={query.toString()} />
          </>
        ) : <p className="text-ink/75">This connection request is unavailable. Open it again from your app.</p>}
      </section>
    </div>
  );
}
