import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import { fetchPhotosByYear, type Photo } from "@/lib/api-service";
import { format } from "date-fns";

export default function GalleryYear() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allPhotosInView, setAllPhotosInView] = useState<Photo[]>([]);

  useEffect(() => {
    if (year) {
      loadPhotos(parseInt(year));
    }
  }, [year]);

  const loadPhotos = async (yearNum: number) => {
    try {
      setIsLoading(true);
      const data = await fetchPhotosByYear(yearNum);
      setPhotos(data);
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openLightbox = (photo: Photo, allPhotos: Photo[]) => {
    setSelectedPhoto(photo);
    setAllPhotosInView(allPhotos);
    const index = allPhotos.findIndex((p) => p.id === photo.id);
    setCurrentImageIndex(index >= 0 ? index : 0);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setCurrentImageIndex(0);
    setAllPhotosInView([]);
  };

  const nextImage = () => {
    if (allPhotosInView.length > 0) {
      const newIndex = (currentImageIndex + 1) % allPhotosInView.length;
      setCurrentImageIndex(newIndex);
      setSelectedPhoto(allPhotosInView[newIndex]);
    }
  };

  const prevImage = () => {
    if (allPhotosInView.length > 0) {
      const newIndex = (currentImageIndex - 1 + allPhotosInView.length) % allPhotosInView.length;
      setCurrentImageIndex(newIndex);
      setSelectedPhoto(allPhotosInView[newIndex]);
    }
  };

  // Group photos by event
  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.event]) {
      acc[photo.event] = [];
    }
    acc[photo.event].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  // Sort photos within each event by date (newest first)
  Object.keys(groupedPhotos).forEach((event) => {
    groupedPhotos[event].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  });

  const events = Object.entries(groupedPhotos).sort(([a], [b]) => {
    // Sort events by the date of their most recent photo
    const aPhotos = groupedPhotos[a];
    const bPhotos = groupedPhotos[b];
    const aLatest = aPhotos[0] ? new Date(aPhotos[0].date).getTime() : 0;
    const bLatest = bPhotos[0] ? new Date(bPhotos[0].date).getTime() : 0;
    return bLatest - aLatest;
  });

  if (!year) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title={`${year} Photo Gallery`}
          description={`Browse photos from ${year} events, programs, and community celebrations.`}
          breadcrumbs={[
            { label: "Archives", href: "/archives/gallery" },
            { label: "Gallery", href: "/archives/gallery" },
            { label: year },
          ]}
        >
          <Button asChild variant="outline" size="sm">
            <Link to="/archives/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </PageHeader>

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No photos available for {year}.</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/archives/gallery">Back to Gallery</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-12">
                {events.map(([event, eventPhotos]) => (
                  <div key={event}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{event}</h3>
                        <p className="text-muted-foreground">
                          {eventPhotos.length} {eventPhotos.length === 1 ? "photo" : "photos"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {eventPhotos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => openLightbox(photo, eventPhotos)}
                          className="aspect-square rounded-xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <img
                            src={photo.photo}
                            alt={photo.description || photo.event}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-background hover:text-accent transition-colors p-2 z-10"
              aria-label="Close gallery"
            >
              <X className="h-8 w-8" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 text-background hover:text-accent transition-colors p-2 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            <div className="max-w-4xl max-h-[80vh] mx-16 rounded-2xl overflow-hidden relative">
              <img
                src={selectedPhoto.photo}
                alt={selectedPhoto.description || selectedPhoto.event}
                className="w-full h-full object-contain max-h-[80vh]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/80 text-background px-6 py-3 rounded-full">
                <p className="text-sm font-medium">
                  {selectedPhoto.description || selectedPhoto.event}
                </p>
                <p className="text-xs opacity-90">
                  {currentImageIndex + 1} of {allPhotosInView.length} • {selectedPhoto.event} •{" "}
                  {format(new Date(selectedPhoto.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <button
              onClick={nextImage}
              className="absolute right-4 text-background hover:text-accent transition-colors p-2 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


