import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, Loader2 } from "lucide-react";
import { fetchFavouritePhotos, type Photo } from "@/lib/api-service";
import { format } from "date-fns";

export function EventPhotosCarousel() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFavouritePhotos();
      // Limit to 6 most recent photos
      const sorted = data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);
      setPhotos(sorted);
    } catch (error) {
      console.error("Failed to load favourite photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-kcssc-gold-light">
        <div className="container-kcssc">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-kcssc-gold-light">
      <div className="container-kcssc">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-accent font-semibold text-xl mb-3">
            <Camera className="h-5 w-5" />
            <span>Recent Event Photos</span>
          </div>
          <h2 className="text-foreground mb-4">Capturing Our Community Moments</h2>
          <p className="text-muted-foreground text-lg">
            Take a look at some of our recent events and activities
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {photos.map((photo) => (
                <CarouselItem key={photo.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div 
                    className="group relative overflow-hidden rounded-2xl shadow-soft border border-border/50 bg-card cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={photo.photo}
                        alt={photo.description || photo.event}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-lg mb-1">{photo.event}</h3>
                      <p className="text-white/90 text-sm">{format(new Date(photo.date), "MMM yyyy")}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 md:-left-12" />
            <CarouselNext className="right-0 md:-right-12" />
          </Carousel>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none">
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.photo}
                alt={selectedPhoto.description || selectedPhoto.event}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-bold text-xl mb-1">{selectedPhoto.event}</h3>
                <p className="text-white/90">{format(new Date(selectedPhoto.date), "MMMM d, yyyy")}</p>
                {selectedPhoto.description && (
                  <p className="text-white/80 text-sm mt-1">{selectedPhoto.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

