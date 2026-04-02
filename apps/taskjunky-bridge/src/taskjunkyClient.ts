export interface BridgeJob {
  id: string;
  type: "draftPost" | "revisePost";
  payload: Record<string, unknown>;
}

interface ClaimResponse {
  job: BridgeJob | null;
}

interface CreateTaskResponse {
  task: {
    id: string;
    title: string;
  };
}

const DEFAULT_BASE_URL = "https://taskjunky.app";
const DEFAULT_CLAIM_PATH = "/api/worker-jobs/claim";
const DEFAULT_COMPLETE_PATH = "/api/worker-jobs/:jobId/complete";
const DEFAULT_FAIL_PATH = "/api/worker-jobs/:jobId/fail";
const DEFAULT_TASKS_PATH = "/api/tasks";

function getBaseUrl() {
  return (process.env.TASKJUNKY_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function getWorkerId() {
  return process.env.TASKJUNKY_WORKER_ID || "mac-mini-content-worker";
}

function getCapabilities() {
  return ["draftPost", "revisePost"];
}

function getHeaders() {
  const token = process.env.TASKJUNKY_API_TOKEN;

  if (!token) {
    throw new Error("TASKJUNKY_API_TOKEN is missing.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function fillPath(template: string, jobId: string) {
  return template.replace(":jobId", jobId).replace(":workerId", getWorkerId());
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : `TaskJunky request failed with status ${response.status}.`
    );
  }

  return data as T;
}

export async function claimJob() {
  return postJson<ClaimResponse>(
    process.env.TASKJUNKY_CLAIM_PATH || DEFAULT_CLAIM_PATH,
    {
      workerId: getWorkerId(),
      capabilities: getCapabilities(),
    }
  );
}

export async function completeJob(jobId: string, result: unknown) {
  await postJson(
    fillPath(process.env.TASKJUNKY_COMPLETE_PATH || DEFAULT_COMPLETE_PATH, jobId),
    {
      workerId: getWorkerId(),
      result,
    }
  );
}

export async function failJob(jobId: string, error: string) {
  await postJson(
    fillPath(process.env.TASKJUNKY_FAIL_PATH || DEFAULT_FAIL_PATH, jobId),
    {
      workerId: getWorkerId(),
      error,
    }
  );
}

export async function createTask(body: {
  title: string;
  description?: string;
  listName?: string;
  assignee?: string;
  source?: string;
  aiNotes?: string;
  tags?: string[];
}) {
  return postJson<CreateTaskResponse>(
    process.env.TASKJUNKY_TASKS_PATH || DEFAULT_TASKS_PATH,
    body
  );
}
