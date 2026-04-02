import { failJob, claimJob, completeJob, type BridgeJob } from "./taskjunkyClient";
import { requestDraftPost, requestPostRevision } from "./contentWorkerClient";

const pollIntervalMs = Number(process.env.TASKJUNKY_POLL_INTERVAL_MS || "5000");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleJob(job: BridgeJob) {
  switch (job.type) {
    case "draftPost": {
      const payload = job.payload as {
        prompt?: string;
        supportingNotes?: string;
        categories?: string[];
      };

      if (!payload.prompt?.trim()) {
        throw new Error("draftPost job is missing a prompt.");
      }

      return requestDraftPost({
        prompt: payload.prompt,
        supportingNotes: payload.supportingNotes,
        categories: Array.isArray(payload.categories) ? payload.categories : [],
      });
    }

    case "revisePost": {
      const payload = job.payload as {
        instruction?: string;
        title?: string;
        excerpt?: string;
        content?: string;
        categories?: string[];
      };

      if (!payload.instruction?.trim()) {
        throw new Error("revisePost job is missing an instruction.");
      }

      return requestPostRevision({
        instruction: payload.instruction,
        title: payload.title || "",
        excerpt: payload.excerpt || "",
        content: payload.content || "",
        categories: Array.isArray(payload.categories) ? payload.categories : [],
      });
    }

    default:
      throw new Error(`Unsupported job type: ${String(job.type)}`);
  }
}

async function run() {
  console.log("TaskJunky bridge started.");

  while (true) {
    try {
      const { job } = await claimJob();

      if (!job) {
        await sleep(pollIntervalMs);
        continue;
      }

      console.log(`Claimed TaskJunky job ${job.id} (${job.type})`);

      try {
        const result = await handleJob(job);
        await completeJob(job.id, result);
        console.log(`Completed TaskJunky job ${job.id}`);
      } catch (jobError) {
        const message =
          jobError instanceof Error ? jobError.message : "Bridge job failed.";

        console.error(`Failed TaskJunky job ${job.id}:`, jobError);
        await failJob(job.id, message);
      }
    } catch (error) {
      console.error("TaskJunky bridge polling error:", error);
      await sleep(pollIntervalMs);
    }
  }
}

void run();
