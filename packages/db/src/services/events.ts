import { eq, desc, gte } from "drizzle-orm";
import { db } from "../client";
import { events } from "../schema";

export async function getUpcomingEvents(limit?: number) {
  return db.query.events.findMany({
    where: gte(events.startTime, new Date()),
    orderBy: events.startTime,
    limit,
  });
}

export async function getAllEvents() {
  return db.query.events.findMany({
    orderBy: desc(events.startTime),
  });
}

export async function upsertEvent(data: {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  location?: string;
  categories?: string[];
  sourceId?: string;
}) {
  const existing = await db.query.events.findFirst({
    where: eq(events.id, data.id),
  });

  if (existing) {
    const [updated] = await db
      .update(events)
      .set({
        title: data.title,
        description: data.description ?? null,
        startTime: data.startTime,
        endTime: data.endTime ?? null,
        location: data.location ?? null,
        categories: data.categories ?? [],
      })
      .where(eq(events.id, data.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(events)
    .values({
      id: data.id,
      title: data.title,
      description: data.description ?? null,
      startTime: data.startTime,
      endTime: data.endTime ?? null,
      location: data.location ?? null,
      categories: data.categories ?? [],
      sourceId: data.sourceId ?? null,
    })
    .returning();
  return created;
}

export async function deleteEvent(id: string) {
  return db.delete(events).where(eq(events.id, id));
}
