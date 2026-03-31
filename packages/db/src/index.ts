// Drizzle client
export { db } from "./client";

// Schema (tables + types)
export * from "./schema";

// Service layer
export * as postService from "./services/posts";
export * as socialService from "./services/social";
export * as eventService from "./services/events";
export * as activityService from "./services/activities";
export * as submissionService from "./services/submissions";
export * as verificationService from "./services/verification";
export * as subscriberService from "./services/subscribers";
