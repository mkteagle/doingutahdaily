import { prisma } from "../client";

export async function getUpcomingEvents(limit?: number) {
  return prisma.event.findMany({
    where: { startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    take: limit,
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: { startTime: "desc" },
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
  return prisma.event.upsert({
    where: { id: data.id },
    update: {
      title: data.title,
      description: data.description ?? null,
      startTime: data.startTime,
      endTime: data.endTime ?? null,
      location: data.location ?? null,
      categories: data.categories ?? [],
    },
    create: {
      id: data.id,
      title: data.title,
      description: data.description ?? null,
      startTime: data.startTime,
      endTime: data.endTime ?? null,
      location: data.location ?? null,
      categories: data.categories ?? [],
      sourceId: data.sourceId ?? null,
    },
  });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({ where: { id } });
}
