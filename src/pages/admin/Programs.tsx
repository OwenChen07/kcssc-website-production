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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X, Trash2, Plus, Loader2, Edit, LogOut } from "lucide-react";
import { fetchPrograms, createProgram, updateProgram, deleteProgram, type Program } from "@/lib/api-service";

const categories = ["Arts & Crafts", "Health & Wellness", "Music & Dance", "Language & Learning", "Social & Dining", "Fitness Programs"];
const ageGroups = ["All Ages", "55+", "65+"];
const icons = ["Palette", "Heart", "Music", "BookOpen", "Utensils", "Dumbbell"];

export default function AdminPrograms() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    icon: "",
    schedule: "",
    ageGroup: "",
    description: "",
    spots: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPrograms();
      setPrograms(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load programs",
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
      const programData = {
        title: formData.title,
        category: formData.category,
        icon: formData.icon,
        schedule: formData.schedule,
        ageGroup: formData.ageGroup,
        description: formData.description,
        spots: formData.spots || undefined,
        imageUrl: formData.imageUrl || undefined,
      };

      if (editingProgram) {
        await updateProgram(editingProgram.id, programData);
        toast({
          title: "Success",
          description: "Program updated successfully",
        });
      } else {
        await createProgram(programData);
        toast({
          title: "Success",
          description: "Program created successfully",
        });
      }

      // Reset form
      setFormData({
        title: "",
        category: "",
        icon: "",
        schedule: "",
        ageGroup: "",
        description: "",
        spots: "",
        imageUrl: "",
      });
      setEditingProgram(null);
      setShowForm(false);
      loadPrograms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save program",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (program: Program) => {
    setFormData({
      title: program.title,
      category: program.category,
      icon: program.icon,
      schedule: program.schedule,
      ageGroup: program.ageGroup,
      description: program.description,
      spots: program.spots || "",
      imageUrl: program.imageUrl || "",
    });
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      await deleteProgram(id);
      toast({
        title: "Success",
        description: "Program deleted successfully",
      });
      loadPrograms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete program",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      icon: "",
      schedule: "",
      ageGroup: "",
      description: "",
      spots: "",
      imageUrl: "",
    });
    setEditingProgram(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Manage Programs"
          description="Create, edit, and delete community programs"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Programs" }]}
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
                  <CardTitle>{editingProgram ? "Edit Program" : "Add New Program"}</CardTitle>
                  <CardDescription>
                    {editingProgram ? "Update program details" : "Create a new community program"}
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
                        <Label htmlFor="icon">Icon *</Label>
                        <Select
                          value={formData.icon}
                          onValueChange={(value) => setFormData({ ...formData, icon: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {icons.map((icon) => (
                              <SelectItem key={icon} value={icon}>
                                {icon}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ageGroup">Age Group *</Label>
                        <Select
                          value={formData.ageGroup}
                          onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                          <SelectContent>
                            {ageGroups.map((age) => (
                              <SelectItem key={age} value={age}>
                                {age}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="schedule">Schedule *</Label>
                        <Input
                          id="schedule"
                          placeholder="Tuesdays, 10:00 AM - 12:00 PM"
                          value={formData.schedule}
                          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="spots">Available Spots</Label>
                        <Input
                          id="spots"
                          placeholder="12 spots available"
                          value={formData.spots}
                          onChange={(e) => setFormData({ ...formData, spots: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
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
                            {editingProgram ? "Update Program" : "Create Program"}
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

            {/* Programs List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Programs</h2>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Program
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading programs...</p>
              </div>
            ) : programs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No programs found</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Program
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {programs.map((program) => (
                  <Card key={program.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{program.title}</h3>
                            <span className="px-2 py-1 text-xs font-medium bg-kcssc-red-light text-primary rounded">
                              {program.category}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-kcssc-gold-light text-accent-foreground rounded">
                              {program.ageGroup}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{program.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>🕐 {program.schedule}</span>
                            <span>👥 {program.spots}</span>
                            <span>🎨 Icon: {program.icon}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(program)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(program.id)}
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

