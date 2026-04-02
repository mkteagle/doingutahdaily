import { createServer } from "node:http";
import { generateDraftPost, revisePostDraft } from "@dud/content-engine";

const port = Number(process.env.CONTENT_WORKER_PORT || "4010");
const secret = process.env.CONTENT_WORKER_SECRET || "";

function sendJson(response: import("node:http").ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function isAuthorized(authHeader: string | undefined) {
  if (!secret) {
    return true;
  }

  return authHeader === `Bearer ${secret}`;
}

async function readJsonBody<T>(request: import("node:http").IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const body = Buffer.concat(chunks).toString("utf8");
  return (body ? JSON.parse(body) : {}) as T;
}

const server = createServer(async (request, response) => {
  try {
    if (!isAuthorized(request.headers.authorization)) {
      sendJson(response, 401, { error: "Unauthorized" });
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      sendJson(response, 200, {
        ok: true,
        service: "content-worker",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (request.method === "POST" && request.url === "/draft-post") {
      const body = await readJsonBody<{
        prompt?: string;
        supportingNotes?: string;
        categories?: string[];
      }>(request);

      if (!body.prompt?.trim()) {
        sendJson(response, 400, { error: "A draft prompt is required." });
        return;
      }

      const draft = await generateDraftPost({
        prompt: body.prompt,
        supportingNotes: body.supportingNotes,
        categories: Array.isArray(body.categories) ? body.categories : [],
      });

      sendJson(response, 200, { draft });
      return;
    }

    if (request.method === "POST" && request.url === "/revise-post") {
      const body = await readJsonBody<{
        instruction?: string;
        title?: string;
        excerpt?: string;
        content?: string;
        categories?: string[];
      }>(request);

      if (!body.instruction?.trim()) {
        sendJson(response, 400, { error: "A revision instruction is required." });
        return;
      }

      const draft = await revisePostDraft({
        instruction: body.instruction,
        title: body.title || "",
        excerpt: body.excerpt || "",
        content: body.content || "",
        categories: Array.isArray(body.categories) ? body.categories : [],
      });

      sendJson(response, 200, { draft });
      return;
    }

    sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    console.error("Content worker error:", error);
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : "Worker request failed.",
    });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Content worker listening on http://0.0.0.0:${port}`);
});
