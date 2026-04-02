import { postService } from "@dud/db";
import { createUniquePostSlug } from "./postDrafts";
import { createTask } from "./taskjunkyClient";
import { uploadRemoteImagesToPostStorage } from "./postAssets";

interface DraftPayload {
  prompt?: string;
  supportingNotes?: string;
  categories?: string[];
  imageUrls?: string[];
}

interface DraftResult {
  draft: {
    title: string;
    excerpt: string;
    content: string;
    categories: string[];
  };
}

function sanitizeImageUrls(imageUrls: unknown) {
  if (!Array.isArray(imageUrls)) {
    return [];
  }

  return imageUrls
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function appendImagesToContent(content: string, imageUrls: string[]) {
  if (imageUrls.length === 0) {
    return content;
  }

  const gallery = imageUrls.map((url) => `![](${url})`).join("\n\n");
  return `${content.trim()}\n\n## Photos\n\n${gallery}`.trim();
}

export async function publishDraftArtifacts(input: {
  payload: DraftPayload;
  result: DraftResult;
  jobId: string;
}) {
  const imageUrls = sanitizeImageUrls(input.payload.imageUrls);
  const slug = await createUniquePostSlug(input.result.draft.title);
  const uploadedImages =
    imageUrls.length > 0
      ? await uploadRemoteImagesToPostStorage({
          imageUrls,
          slug,
        })
      : [];

  const coverImage = uploadedImages[0] || null;
  const content =
    uploadedImages.length > 0
      ? appendImagesToContent(input.result.draft.content, uploadedImages)
      : input.result.draft.content;

  const post = await postService.createPost({
    slug,
    title: input.result.draft.title,
    excerpt: input.result.draft.excerpt,
    content,
    coverImage: coverImage || undefined,
    published: false,
    categories: input.result.draft.categories,
  });

  const taskDescription = [
    `Doing Utah Daily draft created for "${input.result.draft.title}".`,
    "",
    `Post ID: ${post?.id ?? "unknown"}`,
    `Slug: ${slug}`,
    coverImage ? `Cover image: ${coverImage}` : null,
    "",
    "Original prompt:",
    input.payload.prompt?.trim() || "None provided.",
    "",
    input.payload.supportingNotes?.trim()
      ? `Notes:\n${input.payload.supportingNotes.trim()}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const task = await createTask({
    title: `Draft blog post: ${input.result.draft.title}`,
    description: taskDescription,
    listName: "Content Pipeline",
    assignee: "agent",
    source: "api",
    tags: ["content", "blog", "doing-utah-daily"],
    aiNotes: `Worker job ${input.jobId} created a draft post and stored the result in Doing Utah Daily.`,
  });

  return {
    draft: input.result.draft,
    uploadedImages,
    post: post
      ? {
          id: post.id,
          slug: post.slug,
          title: post.title,
          coverImage: post.coverImage,
        }
      : null,
    task: task?.task
      ? {
          id: task.task.id,
          title: task.task.title,
        }
      : null,
  };
}
