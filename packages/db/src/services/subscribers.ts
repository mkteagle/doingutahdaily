import { eq, desc } from "drizzle-orm";
import { db } from "../client";
import { subscribers } from "../schema";

export async function subscribe(data: {
  email: string;
  name?: string;
  regions?: string[];
  ageBands?: string[];
}) {
  // Check if already subscribed
  const existing = await db.query.subscribers.findFirst({
    where: eq(subscribers.email, data.email.toLowerCase()),
  });

  if (existing) {
    // Reactivate if previously unsubscribed
    if (!existing.active) {
      const [updated] = await db
        .update(subscribers)
        .set({
          active: true,
          unsubscribedAt: null,
          name: data.name ?? existing.name,
          regions: data.regions ?? existing.regions,
          ageBands: data.ageBands ?? existing.ageBands,
        })
        .where(eq(subscribers.id, existing.id))
        .returning();
      return { subscriber: updated, reactivated: true };
    }
    return { subscriber: existing, alreadySubscribed: true };
  }

  const [subscriber] = await db
    .insert(subscribers)
    .values({
      email: data.email.toLowerCase(),
      name: data.name,
      regions: data.regions ?? [],
      ageBands: data.ageBands ?? [],
    })
    .returning();

  return { subscriber, new: true };
}

export async function unsubscribe(email: string) {
  const [updated] = await db
    .update(subscribers)
    .set({
      active: false,
      unsubscribedAt: new Date(),
    })
    .where(eq(subscribers.email, email.toLowerCase()))
    .returning();
  return updated;
}

export async function getActiveSubscribers(options?: {
  region?: string;
  limit?: number;
}) {
  return db.query.subscribers.findMany({
    where: eq(subscribers.active, true),
    orderBy: desc(subscribers.subscribedAt),
    limit: options?.limit,
  });
}

export async function getSubscriberCount() {
  const result = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.active, true));
  return result.length;
}
