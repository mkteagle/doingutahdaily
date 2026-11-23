import { createHash, timingSafeEqual } from "node:crypto";
import { requireMcpAuth } from "@better-auth/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { adminOrigin, auth, isApprovedAdmin, mcpDraftScope, mcpResource, mcpScopes } from "@/auth";
import { registerStoryTools } from "@/lib/storyMcp";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function hasLegacyToken(request: Request) {
  const secret = process.env.DUD_MCP_DRAFT_TOKEN?.trim();
  const authorization = request.headers.get("authorization");
  return !!secret && secret.length >= 32 && !!authorization &&
    timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`));
}

async function runMcp(request: Request) {
  const server = new McpServer({ name: "doing-utah-daily", version: "2.0.0" }, {
    instructions: "Co-write Utah family outing stories in this chat. Start from the author's own experience, ask a focused question when needed, and work through one section at a time. Suggest changes in plain language and save the revisions the author agrees to. Reopen the latest draft before editing and preserve their changes. Share photo comparisons from Kindred only when requested, and copy a photo only after the author chooses it for the story. Keep the story a draft.",
  });
  registerStoryTools(server);

  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true });
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    await server.close();
  }
}

const runWithOAuth = requireMcpAuth(auth, async (request, claims) => {
  const { internalAdapter } = await auth.$context;
  const user = claims.sub ? await internalAdapter.findUserById(claims.sub) : null;
  if (!isApprovedAdmin(user)) return new Response(null, { status: 403 });
  return runMcp(request);
}, { resource: mcpResource, requiredScopes: [mcpDraftScope], challengeScopes: mcpScopes });

async function handleMcp(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== adminOrigin) return new Response(null, { status: 403 });
  return hasLegacyToken(request) ? runMcp(request) : runWithOAuth(request);
}

export { handleMcp as GET, handleMcp as POST, handleMcp as DELETE };
