import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, Loader2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchFavouritePhotos, type Photo } from "@/lib/api-service";

const features = [
  {
    icon: Users,
    title: "Who We Are",
    description: "The Kanata Chinese Seniors Support Centre (KCSSC) is a non-profit hub dedicated to helping the local Chinese community thrive and integrate into mainstream Canadian society. While our primary focus remains on seniors, we empower individuals of all ages to overcome barriers, share their heritage, and achieve success as active members of the Canadian community.",
  },
];

export function AboutSection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const loadFavouritePhotos = async () => {
      try {
        setIsLoadingPhotos(true);
        const data = await fetchFavouritePhotos();
        const favouritePhotos = data
          .filter((photo) => photo.favourite === true)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPhotos(favouritePhotos);
      } catch (error) {
        console.error("Failed to load favourite photos for About section:", error);
      } finally {
        setIsLoadingPhotos(false);
      }
    };

    loadFavouritePhotos();
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container-kcssc">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* <p className="text-accent font-semibold text-2xl mb-3">About Us</p> */}
          <h2 className="text-foreground mb-6 text-[#850221]">Building Community, Celebrating Culture!</h2>
          <p className="text-muted-foreground text-xl">
            For nearly two decades, KCSSC has been a cornerstone of support for Chinese seniors in Kanata, providing programs, services, and a welcoming space to connect.
          </p>
        </div>

        {/* Who We Are Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Who We Are Card - One Third */}
          <div 
            className="w-full md:w-1/3 bg-card rounded-2xl p-8 shadow-soft card-hover border border-border/50"
          >
            <div className="flex gap-4 items-center mb-3">
              <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{features[0].title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{features[0].description}</p>
          </div>

          {/* Image Carousel - Two Thirds */}
          <div className="w-full md:w-2/3 bg-card rounded-2xl p-4 shadow-soft border border-border/50 overflow-hidden relative">
            {isLoadingPhotos ? (
              <div className="aspect-[16/9] flex items-center justify-center rounded-xl bg-muted/30">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photos.length === 0 ? (
              <div className="aspect-[16/9] flex items-center justify-center rounded-xl bg-muted/30 px-6 text-center text-muted-foreground">
                No favourite photos available yet.
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {photos.map((photo) => (
                    <CarouselItem key={photo.id}>
                      <div
                        className="relative overflow-hidden rounded-xl aspect-[16/9] cursor-pointer group"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={photo.photo}
                          alt={photo.description || photo.event}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-[#850221] hover:bg-[#850221]/90 text-white border-[#850221]" />
                <CarouselNext className="right-2 bg-[#850221] hover:bg-[#850221]/90 text-white border-[#850221]" />
              </Carousel>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/about/mission">
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
                {selectedPhoto.description && (
                  <p className="text-white/90 text-sm mt-1">{selectedPhoto.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
