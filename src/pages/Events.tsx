import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, MapPin, Clock, Search, Filter, ArrowRight, CalendarDays, List, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EventsCalendar } from "@/components/ui/events-calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getEventsForDate, parseDate, type Event } from "@/lib/data-service";
import { format } from "date-fns";
import { fetchEvents } from "@/lib/api-service";

const categories = ["All", "Holiday", "Health", "Arts", "Fitness", "Cooking", "Learning", "Social"];

export default function Events() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar"); // Default to calendar view
  // Default to January 2025 where most events are
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 0, 15));
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2025, 0, 1)); // January 2025
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Simulate database fetch on component mount
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call to database
        const events = await fetchEvents();
        setAllEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        console.error("Error loading events:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get events for calendar dates
  const getDateEvents = (date: Date) => {
    return getEventsForDate(filteredEvents, date);
  };

  // Handle date click on calendar
  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const eventsForDate = getDateEvents(date);
    if (eventsForDate.length > 0) {
      setSelectedEvent(eventsForDate[0]);
      setIsDialogOpen(true);
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Events"
          description="Join us for community gatherings, cultural celebrations, and enriching activities throughout the year."
          breadcrumbs={[{ label: "Events" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-card rounded-2xl p-12 shadow-soft border border-border/50 mb-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading events from database...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 mb-10 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}

            {/* Search & Filters */}
            {!isLoading && !error && (
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 mb-10">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                    <Button
                      variant={viewMode === "calendar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("calendar")}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Calendar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Results count */}
            {!isLoading && !error && (
              <p className="text-muted-foreground mb-6">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Calendar View */}
            {!isLoading && !error && viewMode === "calendar" && (
              <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 mb-10 w-full overflow-x-auto">
                <div className="min-w-full">
                  <EventsCalendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateClick}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    events={filteredEvents}
                    onEventClick={(event) => {
                      setSelectedEvent(event);
                      setIsDialogOpen(true);
                    }}
                    className="w-full"
                  />
                </div>
                {selectedDate && getDateEvents(selectedDate).length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">
                      All Events on {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    <div className="space-y-3">
                      {getDateEvents(selectedDate).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDialogOpen(true);
                          }}
                          className="w-full text-left bg-secondary hover:bg-kcssc-gold-light rounded-xl p-4 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{event.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{event.time}</p>
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.featured 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-kcssc-red-light text-primary'
                            }`}>
                              {event.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Events Grid */}
            {!isLoading && !error && viewMode === "list" && (
              <>
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground mb-4">No events found matching your search.</p>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
                      const eventImages: { [key: string]: string } = {
                        "Lunar New Year Celebration": "https://images.unsplash.com/photo-1606297255626-aaeba0c9e0b0?w=600&q=80",
                        "Senior Health & Wellness Workshop": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
                        "Traditional Chinese Painting Class": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
                        "Tai Chi in the Park": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
                        "Chinese New Year Dumpling Making": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
                        "Technology Help Desk": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
                        "Movie Afternoon: Classic Films": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
                        "Spring Festival Concert": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
                      };
                      return (
                        <Link
                          key={event.id}
                          to={`/events/${event.id}`}
                          className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover border border-border/50"
                        >
                          {/* Event Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={eventImages[event.title] || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80"} 
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                event.featured 
                                  ? 'bg-accent text-accent-foreground' 
                                  : 'bg-kcssc-red-light text-primary'
                              }`}>
                                {event.category}
                              </span>
                              {event.featured && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">Featured</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Event Card Header */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-foreground mb-4">
                              {event.title}
                            </h3>

                            <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <CalendarIcon className="h-5 w-5 text-primary shrink-0" />
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
                            <span className="inline-flex items-center text-primary font-medium group-hover:underline">
                              View details
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Event Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {selectedEvent && (
                  <>
                    <DialogHeader>
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedEvent.featured 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-kcssc-red-light text-primary'
                        }`}>
                          {selectedEvent.category}
                        </span>
                        {selectedEvent.featured && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                            Featured
                          </span>
                        )}
                      </div>
                      <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        {selectedEvent.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <CalendarIcon className="h-5 w-5 text-primary shrink-0" />
                        <span>{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-5 w-5 text-primary shrink-0" />
                        <span>{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-5 w-5 text-primary shrink-0" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button asChild className="flex-1">
                        <Link to={`/events/${selectedEvent.id}`}>
                          View Full Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
