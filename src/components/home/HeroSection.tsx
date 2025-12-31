import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #830707, #F9FEBE)' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/StoneHouse.jpg" 
          alt="Community gathering" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
      </div>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="relative container-kcssc py-20 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Left side - Content */}
          <div className="max-w-3xl">
            {/* Main heading */}
            <h1 className="text-primary-foreground mb-6 animate-fade-in-up whitespace-nowrap text-3xl md:text-4xl lg:text-3sxl xl:text-6xl">
              Kanata Chinese Seniors Support Centre
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed animate-fade-in-delay-1">
              Enriching lives through community, culture, and care. Join us in building a supportive environment for Chinese seniors in Kanata.
            </p>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Heart className="h-4 w-4 text-accent" />
              <span>Serving our community since 2011</span>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
              <Button asChild variant="accent" size="xl">
                <Link to="/events">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Events
                </Link>
              </Button>
              <Button asChild variant="hero-outline" size="xl">
                <Link to="/support/membership">
                  <Users className="mr-2 h-5 w-5" />
                  Join Our Community
                </Link>
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20 animate-fade-in-delay-3">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">500+</p>
                <p className="text-primary-foreground/80 mt-1">Active Members</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">50+</p>
                <p className="text-primary-foreground/80 mt-1">Programs Yearly</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">100+</p>
                <p className="text-primary-foreground/80 mt-1">Volunteers</p>
              </div>
            </div> */}
          </div>

          {/* Right side - Hero Photo
          <div className="hidden lg:block animate-fade-in-delay-1 lg:ml-auto lg:mr-0 lg:mt-32 lg:max-w-2xl lg:translate-x-8">
            <img 
              src="/HeroPhoto.JPG" 
              alt="KCSSC Community" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}
