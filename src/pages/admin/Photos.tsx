import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Save, X, Trash2, Plus, Loader2, Edit, LogOut, Image as ImageIcon, Upload } from "lucide-react";
import { fetchPhotos, createPhoto, updatePhoto, deletePhoto, uploadPhoto, type Photo } from "@/lib/api-service";

export default function AdminPhotos() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin/login");
  };

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    photo: "",
    description: "",
    event: "",
    date: format(new Date(), "yyyy-MM-dd"),
    favourite: false,
  });

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear URL input when file is selected
      setFormData({ ...formData, photo: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let photoPath = formData.photo;

      // Upload file if one is selected
      if (selectedFile) {
        setIsUploading(true);
        try {
          photoPath = await uploadPhoto(selectedFile);
          toast({
            title: "Success",
            description: "Photo uploaded successfully",
          });
        } catch (uploadError: any) {
          toast({
            title: "Upload Error",
            description: uploadError.message || "Failed to upload photo",
            variant: "destructive",
          });
          setIsUploading(false);
          setIsSaving(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      if (!photoPath && !selectedFile) {
        toast({
          title: "Error",
          description: "Please either upload a file or provide a photo URL",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const photoData = {
        photo: photoPath,
        description: formData.description || undefined,
        event: formData.event,
        date: formData.date,
        favourite: formData.favourite,
      };

      if (editingPhoto) {
        await updatePhoto(editingPhoto.id, photoData);
        toast({
          title: "Success",
          description: "Photo updated successfully",
        });
      } else {
        await createPhoto(photoData);
        toast({
          title: "Success",
          description: "Photo created successfully",
        });
      }

      // Reset form
      setFormData({
        photo: "",
        description: "",
        event: "",
        date: format(new Date(), "yyyy-MM-dd"),
        favourite: false,
      });
      setSelectedFile(null);
      setPhotoPreview(null);
      setEditingPhoto(null);
      setShowForm(false);
      await loadPhotos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save photo",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setFormData({
      photo: photo.photo,
      description: photo.description || "",
      event: photo.event,
      date: photo.date,
      favourite: photo.favourite,
    });
    setSelectedFile(null);
    setPhotoPreview(photo.photo); // Show current photo as preview
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await deletePhoto(id);
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
      await loadPhotos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      photo: "",
      description: "",
      event: "",
      date: format(new Date(), "yyyy-MM-dd"),
      favourite: false,
    });
    setSelectedFile(null);
    setPhotoPreview(null);
    setEditingPhoto(null);
    setShowForm(false);
  };

  // Group photos by year, then by event
  const groupedPhotos = photos.reduce((acc, photo) => {
    try {
      const year = new Date(photo.date).getFullYear();
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][photo.event]) {
        acc[year][photo.event] = [];
      }
      acc[year][photo.event].push(photo);
    } catch (error) {
      console.error('Error processing photo:', photo, error);
    }
    return acc;
  }, {} as Record<number, Record<string, Photo[]>>);

  const years = Object.keys(groupedPhotos)
    .map(Number)
    .sort((a, b) => b - a); // Sort years descending

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Manage Photos"
          description="Add, edit, and delete photos. Mark photos as favourites to display them in the carousel."
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Photos" }]}
        >
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </PageHeader>

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Photos</h2>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Photo
              </Button>
            </div>

            {/* Form */}
            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{editingPhoto ? "Edit Photo" : "Add New Photo"}</CardTitle>
                  <CardDescription>
                    {editingPhoto
                      ? "Update the photo information below"
                      : "Fill in the details to add a new photo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="file-upload">Upload Photo *</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="file-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                          />
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload an image file (JPEG, PNG, GIF, or WebP, max 10MB)
                        </p>
                        {photoPreview && (
                          <div className="mt-2">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photo">Or Photo URL</Label>
                        <Input
                          id="photo"
                          value={formData.photo}
                          onChange={(e) => {
                            setFormData({ ...formData, photo: e.target.value });
                            // Clear file selection when URL is entered
                            if (e.target.value) {
                              setSelectedFile(null);
                              setPhotoPreview(null);
                            }
                          }}
                          placeholder="/path/to/photo.jpg"
                          disabled={!!selectedFile}
                        />
                        <p className="text-xs text-muted-foreground">
                          Alternatively, enter a URL or path to an existing photo
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event">Event Name *</Label>
                        <Input
                          id="event"
                          value={formData.event}
                          onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                          placeholder="Lunar New Year 2024"
                          required
                        />
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
                        <Label htmlFor="favourite">Favourite (Show in Carousel)</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="favourite"
                            checked={formData.favourite}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, favourite: checked })
                            }
                          />
                          <Label htmlFor="favourite" className="cursor-pointer">
                            {formData.favourite ? "Yes" : "No"}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Favourite photos will appear in the homepage carousel
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description of the photo..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving || isUploading}>
                        {isSaving || isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isUploading ? "Uploading..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {editingPhoto ? "Update Photo" : "Create Photo"}
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

            {/* Photos List - Organized by Year and Event */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No photos yet. Add your first photo above.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-12">
                {years.map((year) => (
                  <div key={year}>
                    <h3 className="text-2xl font-bold mb-6 text-foreground">{year}</h3>
                    <div className="space-y-8">
                      {Object.entries(groupedPhotos[year])
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([event, eventPhotos]) => (
                          <div key={event}>
                            <h4 className="text-xl font-semibold mb-4 text-foreground">{event}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {eventPhotos.map((photo) => (
                                <Card key={photo.id} className="overflow-hidden">
                                  <div className="aspect-square relative">
                                    <img
                                      src={photo.photo}
                                      alt={photo.description || photo.event}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                      }}
                                    />
                                    {photo.favourite && (
                                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                                        ★ Favourite
                                      </div>
                                    )}
                                  </div>
                                  <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground mb-2 truncate">
                                      {photo.description || "No description"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                      {photo.date ? format(new Date(photo.date), "MMM d, yyyy") : "No date"}
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(photo)}
                                        className="flex-1"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(photo.id)}
                                        className="flex-1"
                                      >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
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

