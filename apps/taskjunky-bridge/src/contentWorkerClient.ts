const DEFAULT_CONTENT_WORKER_URL = "http://127.0.0.1:4010";

function getWorkerUrl() {
  return (process.env.CONTENT_WORKER_URL || DEFAULT_CONTENT_WORKER_URL).replace(
    /\/$/,
    ""
  );
}

function getHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.CONTENT_WORKER_SECRET) {
    headers.Authorization = `Bearer ${process.env.CONTENT_WORKER_SECRET}`;
  }

  return headers;
}

async function callWorker<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getWorkerUrl()}${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Content worker request failed."
    );
  }

  return data as T;
}

export async function requestDraftPost(body: {
  prompt: string;
  supportingNotes?: string;
  categories?: string[];
}) {
  return callWorker<{
    draft: {
      title: string;
      excerpt: string;
      content: string;
      categories: string[];
    };
  }>("/draft-post", body);
}

export async function requestPostRevision(body: {
  instruction: string;
  title: string;
  excerpt: string;
  content: string;
  categories?: string[];
}) {
  return callWorker<{
    draft: {
      title: string;
      excerpt: string;
      content: string;
      categories: string[];
    };
  }>("/revise-post", body);
}
