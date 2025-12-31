import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Lunar New Year Celebration",
    date: "January 25, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "Community Hall",
    category: "Holiday",
    featured: true,
  },
  {
    id: 2,
    title: "Senior Health & Wellness Workshop",
    date: "January 15, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Room 102",
    category: "Health",
    featured: false,
  },
  {
    id: 3,
    title: "Traditional Chinese Painting Class",
    date: "January 18, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Art Room",
    category: "Arts",
    featured: false,
  },
];

export function EventsSection() {
  return (
    <section className="section-padding bg-kcssc-gold-light">
      <div className="container-kcssc">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            {/* <p className="text-primary font-semibold text-lg mb-3">What's Happening</p> */}
            <h2 className="text-[#800000]">Upcoming Events</h2>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link to="/events">
              View All Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Event Card Header */}
              <div className={`p-6 ${event.featured ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.featured 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-kcssc-red-light text-primary'
                  }`}>
                    {event.category}
                  </span>
                  {event.featured && (
                    <span className="text-sm font-medium text-accent">Featured</span>
                  )}
                </div>
                <h3 className={`text-xl font-bold ${event.featured ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {event.title}
                </h3>
              </div>

              {/* Event Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="px-6 pb-6">
                <span className="inline-flex items-center text-primary font-medium group-hover:underline">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
