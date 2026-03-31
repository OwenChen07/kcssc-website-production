import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Loader2, ArrowLeft } from "lucide-react";
import { fetchEventById } from "@/lib/api-service";
import type { Event } from "@/lib/data-service";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      if (!id) {
        setError("Event ID is missing.");
        setIsLoading(false);
        return;
      }

      const eventId = Number(id);
      if (!Number.isFinite(eventId) || eventId <= 0) {
        setError("Invalid event ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const eventData = await fetchEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title={event?.title || "Event Details"}
          description="Event details and schedule information"
          breadcrumbs={[
            { label: "Events", href: "/events" },
            { label: event?.title || "Details" },
          ]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc max-w-4xl">
            <div className="mb-8">
              <Button asChild variant="outline">
                <Link to="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </Button>
            </div>

            {isLoading && (
              <div className="bg-card rounded-2xl p-12 shadow-soft border border-border/50 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading event details...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button asChild>
                  <Link to="/events">Return to Events</Link>
                </Button>
              </div>
            )}

            {event && !isLoading && !error && (
              <article className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.featured
                        ? "bg-accent text-accent-foreground"
                        : "bg-kcssc-red-light text-primary"
                    }`}
                  >
                    {event.category}
                  </span>
                  {event.featured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="text-foreground mb-6">{event.title}</h2>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
