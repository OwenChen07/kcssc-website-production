import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loader2 } from "lucide-react";
import { fetchPhotos, type Photo } from "@/lib/api-service";

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group photos by year and get first photo of each year
  const yearData = photos.reduce((acc, photo) => {
    const year = new Date(photo.date).getFullYear();
    if (!acc[year]) {
      acc[year] = {
        firstPhoto: photo,
        count: 0,
      };
    }
    acc[year].count++;
    return acc;
  }, {} as Record<number, { firstPhoto: Photo; count: number }>);

  const years = Object.keys(yearData)
    .map(Number)
    .sort((a, b) => b - a); // Sort years descending

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Photo Gallery"
          description="Browse photos from our events, programs, and community celebrations organized by year."
          breadcrumbs={[{ label: "Archives", href: "/archives/gallery" }, { label: "Gallery" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No photos available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {years.map((year) => {
                  const yearInfo = yearData[year];
                  return (
                    <Link
                      key={year}
                      to={`/archives/gallery/${year}`}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      {/* Background Image */}
                      <img
                        src={yearInfo.firstPhoto.photo}
                        alt={`${year} gallery`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />
                      {/* Year Label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <h2 className="text-5xl md:text-6xl font-bold text-white mb-2">
                            {year}
                          </h2>
                          <p className="text-white/90 text-lg">
                            {yearInfo.count} {yearInfo.count === 1 ? "photo" : "photos"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
