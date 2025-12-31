import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Save, X, Trash2, Plus, Loader2, Edit, LogOut } from "lucide-react";
import { fetchEvents, createEvent, updateEvent, deleteEvent, type Event } from "@/lib/api-service";

const categories = ["Holiday", "Health", "Arts", "Fitness", "Cooking", "Learning", "Social"];

export default function AdminEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"), // Use string format for date input
    time: "",
    endTime: "",
    location: "",
    category: "",
    description: "",
    featured: false,
    imageUrl: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const eventData = {
        title: formData.title,
        date: formData.date, // Already in YYYY-MM-DD format
        time: formData.time,
        endTime: formData.endTime || undefined,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        featured: formData.featured,
        imageUrl: formData.imageUrl || undefined,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        await createEvent(eventData);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }

      // Reset form
      setFormData({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "",
        endTime: "",
        location: "",
        category: "",
        description: "",
        featured: false,
        imageUrl: "",
      });
      setEditingEvent(null);
      setShowForm(false);
      loadEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (event: Event) => {
    // Parse date from "January 25, 2025" format to YYYY-MM-DD
    const dateMatch = event.date.match(/(\w+)\s+(\d+),\s+(\d+)/);
    let dateStr = format(new Date(), "yyyy-MM-dd");
    if (dateMatch) {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const month = months.indexOf(dateMatch[1]);
      const day = parseInt(dateMatch[2]);
      const year = parseInt(dateMatch[3]);
      const date = new Date(year, month, day);
      dateStr = format(date, "yyyy-MM-dd");
    }

    // Parse time (handle "10:00 AM - 12:00 PM" format)
    const timeParts = event.time.split(" - ");
    const time = timeParts[0] || "";
    const endTime = timeParts[1] || "";

    setFormData({
      title: event.title,
      date: dateStr,
      time,
      endTime,
      location: event.location,
      category: event.category,
      description: event.description,
      featured: event.featured,
      imageUrl: event.imageUrl || "",
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      loadEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      endTime: "",
      location: "",
      category: "",
      description: "",
      featured: false,
      imageUrl: "",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Manage Events"
          description="Create, edit, and delete community events"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Events" }]}
        >
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </PageHeader>

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            {/* Add/Edit Form */}
            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{editingEvent ? "Edit Event" : "Add New Event"}</CardTitle>
                  <CardDescription>
                    {editingEvent ? "Update event details" : "Create a new community event"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Start Time *</Label>
                        <Input
                          id="time"
                          placeholder="10:00 AM"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          placeholder="12:00 PM"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input
                          id="imageUrl"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2 md:col-span-2">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                        <Label htmlFor="featured">Featured Event</Label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {editingEvent ? "Update Event" : "Create Event"}
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Events List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Events</h2>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Event
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No events found</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            {event.featured && (
                              <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded">
                                Featured
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs font-medium bg-kcssc-red-light text-primary rounded">
                              {event.category}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>📅 {event.date}</span>
                            <span>🕐 {event.time}</span>
                            <span>📍 {event.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

