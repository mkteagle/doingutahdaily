import { postService } from "@dud/db";
import { slugify } from "@/lib/utils";

export async function createUniquePostSlug(title: string) {
  const baseSlug = slugify(title) || `draft-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (await postService.getPostBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
