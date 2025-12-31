import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { EventsSection } from "@/components/home/EventsSection";
import { EventPhotosCarousel } from "@/components/home/EventPhotosCarousel";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { SupportSection } from "@/components/home/SupportSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <EventsSection />
        <ProgramsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
