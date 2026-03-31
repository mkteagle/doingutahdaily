import { eq, desc } from "drizzle-orm";
import { db } from "../client";
import { submissions } from "../schema";
import type { submissionStatusEnum } from "../schema";

type SubmissionStatus = (typeof submissionStatusEnum.enumValues)[number];

export async function createSubmission(data: {
  submitterName: string;
  submitterEmail: string;
  submitterRole?: string;
  businessName?: string;
  title: string;
  description?: string;
  address?: string;
  city?: string;
  website?: string;
  phone?: string;
  categories?: string[];
  ageBands?: string[];
  costTier?: string;
  isFree?: boolean;
  duration?: string;
  parking?: string;
  restrooms?: boolean;
  strollerFriendly?: boolean;
  wheelchairAccessible?: boolean;
}) {
  const [submission] = await db.insert(submissions).values(data).returning();
  return submission;
}

export async function getSubmissions(options?: {
  status?: SubmissionStatus;
  limit?: number;
}) {
  return db.query.submissions.findMany({
    where: options?.status
      ? eq(submissions.status, options.status)
      : undefined,
    orderBy: desc(submissions.createdAt),
    limit: options?.limit ?? 50,
  });
}

export async function getSubmissionById(id: string) {
  return db.query.submissions.findFirst({
    where: eq(submissions.id, id),
  });
}

export async function updateSubmissionStatus(
  id: string,
  data: {
    status: SubmissionStatus;
    reviewNotes?: string;
    reviewedBy?: string;
    activityId?: string;
  }
) {
  const [updated] = await db
    .update(submissions)
    .set({
      ...data,
      reviewedAt: new Date(),
    })
    .where(eq(submissions.id, id))
    .returning();
  return updated;
}
