import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users, Clock, ArrowRight, Palette, Heart, Music, BookOpen, Utensils, Dumbbell, CalendarDays, List, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProgramsForDate, type Program } from "@/lib/data-service";
import { format } from "date-fns";
import { fetchPrograms } from "@/lib/api-service";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Palette,
  Heart,
  Music,
  BookOpen,
  Utensils,
  Dumbbell,
};

const categories = ["All", "Arts & Crafts", "Health & Wellness", "Music & Dance", "Language & Learning", "Social & Dining", "Fitness Programs"];
const ageGroups = ["All Ages", "55+", "65+"];

export default function Programs() {
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Ages");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch programs from database on component mount
  useEffect(() => {
    async function loadPrograms() {
      try {
        setIsLoading(true);
        setError(null);
        const programs = await fetchPrograms();
        setAllPrograms(programs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load programs");
        console.error("Error loading programs:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrograms();
  }, []);

  const filteredPrograms = allPrograms.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || program.category === selectedCategory;
    const matchesAgeGroup = selectedAgeGroup === "All Ages" || program.ageGroup === selectedAgeGroup || program.ageGroup === "All Ages";
    return matchesSearch && matchesCategory && matchesAgeGroup;
  });

  // Get programs for calendar dates
  const getDatePrograms = (date: Date) => {
    return getProgramsForDate(filteredPrograms, date);
  };

  // Handle date click on calendar
  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const programsForDate = getDatePrograms(date);
    if (programsForDate.length > 0) {
      setSelectedProgram(programsForDate[0]);
      setIsDialogOpen(true);
    }
  };

  // Mark dates with programs
  const dateModifiers = {
    hasPrograms: (date: Date) => getDatePrograms(date).length > 0,
  };

  const modifiersStyles = {
    hasPrograms: {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
      color: 'hsl(var(--primary))',
      fontWeight: '600',
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Programs"
          description="Discover our diverse range of programs designed to keep you active, engaged, and connected with the community."
          breadcrumbs={[{ label: "Programs" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-card rounded-2xl p-12 shadow-soft border border-border/50 mb-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading programs from database...</p>
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
                      placeholder="Search programs..."
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
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">Category:</span>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <Users className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground">Age Group:</span>
                  {ageGroups.map((age) => (
                    <Button
                      key={age}
                      variant={selectedAgeGroup === age ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSelectedAgeGroup(age)}
                    >
                      {age}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Results count */}
            {!isLoading && !error && (
              <p className="text-muted-foreground mb-6">
                Showing {filteredPrograms.length} program{filteredPrograms.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Calendar View */}
            {!isLoading && !error && viewMode === "calendar" && (
              <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 mb-10 w-full overflow-x-auto">
                <div className="min-w-full">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateClick}
                    modifiers={dateModifiers}
                    modifiersStyles={modifiersStyles}
                    className="w-full"
                  />
                </div>
                {selectedDate && getDatePrograms(selectedDate).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Programs on {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    <div className="space-y-3">
                      {getDatePrograms(selectedDate).map((program) => {
                        const IconComponent = iconMap[program.icon] || Palette;
                        return (
                          <button
                            key={program.id}
                            onClick={() => {
                              setSelectedProgram(program);
                              setIsDialogOpen(true);
                            }}
                            className="w-full text-left bg-secondary hover:bg-kcssc-gold-light rounded-xl p-4 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-grow">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-kcssc-red-light shrink-0">
                                  <IconComponent className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-semibold text-foreground">{program.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{program.schedule}</p>
                                  <p className="text-sm text-muted-foreground">{program.category}</p>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-kcssc-gold-light text-accent-foreground shrink-0">
                                {program.ageGroup}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Programs Grid */}
            {!isLoading && !error && viewMode === "list" && (
              <>
                {filteredPrograms.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground mb-4">No programs found matching your search.</p>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedAgeGroup("All Ages"); }}>
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => {
                const IconComponent = iconMap[program.icon] || Palette;
                const programImages: { [key: string]: string } = {
                  "Chinese Brush Painting": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
                  "Tai Chi for Beginners": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
                  "Chinese Folk Dance": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
                  "Mandarin Conversation Circle": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
                  "Cooking: Regional Cuisines": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
                  "Gentle Exercise Class": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
                  "Chinese Calligraphy": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
                  "Choir & Singing Group": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
                  "Computer Skills Workshop": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
                };
                return (
                  <Link
                    key={program.id}
                    to={`/programs/${program.id}`}
                    className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover border border-border/50"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={programImages[program.title] || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80"} 
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-kcssc-gold-light text-accent-foreground">
                          {program.ageGroup}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light">
                          <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary">{program.category}</span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3">{program.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{program.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm">{program.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">{program.spots}</span>
                        </div>
                      </div>

                      <span className="inline-flex items-center text-primary font-medium group-hover:underline">
                        Learn more
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

            {/* Program Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                {selectedProgram && (() => {
                  const IconComponent = iconMap[selectedProgram.icon] || Palette;
                  return (
                    <>
                      <DialogHeader>
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light shrink-0">
                            <IconComponent className="h-7 w-7 text-primary" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-primary">{selectedProgram.category}</span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-kcssc-gold-light text-accent-foreground">
                                {selectedProgram.ageGroup}
                              </span>
                            </div>
                            <DialogTitle className="text-2xl">{selectedProgram.title}</DialogTitle>
                          </div>
                        </div>
                        <DialogDescription className="text-base pt-2">
                          {selectedProgram.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Clock className="h-5 w-5 text-primary shrink-0" />
                          <span>{selectedProgram.schedule}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Users className="h-5 w-5 text-primary shrink-0" />
                          <span>{selectedProgram.spots}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <Button asChild className="flex-1">
                          <Link to={`/programs/${selectedProgram.id}`}>
                            View Full Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
