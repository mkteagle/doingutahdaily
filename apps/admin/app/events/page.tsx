import { eventService } from "@dud/db";
import { Calendar, MapPin, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await eventService.getUpcomingEvents(50);
  } catch {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Events</h1>
          <p className="text-sm text-ink/40 mt-0.5">
            {events.length} upcoming
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-cream border border-sand rounded-xl p-12 text-center">
          <Calendar size={32} className="text-ink/20 mx-auto mb-3" />
          <p className="text-ink/30 text-sm">No upcoming events.</p>
          <p className="text-ink/20 text-xs mt-1">
            Events sync from Google Calendar via the web app API
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event: any) => (
            <div
              key={event.id}
              className="bg-cream border border-sand rounded-xl p-5 hover:border-canyon/20 transition-colors"
            >
              <h3 className="font-semibold text-ink mb-1">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-ink/50 line-clamp-2 mb-2">
                  {event.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-ink/40">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(event.startTime)}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {event.location}
                  </span>
                )}
                {event.categories?.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 rounded-full bg-sky/10 text-sky font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
