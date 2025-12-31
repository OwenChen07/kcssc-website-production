import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export function ContactCTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary to-kcssc-red relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container-kcssc relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="text-primary-foreground mb-6">Have Questions? We're Here to Help</h2>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Whether you want to learn more about our programs, become a member, or just say hello, we'd love to hear from you.
            </p>
            <Button asChild variant="accent" size="xl">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Right - Contact cards */}
          <div className="grid gap-4">
            <a 
              href="tel:+16135551234" 
              className="flex items-center gap-4 p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                <Phone className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/70 mb-1">Call us</p>
                <p className="text-xl font-semibold text-primary-foreground">(613) 555-1234</p>
              </div>
            </a>

            <a 
              href="mailto:info@kcssc.ca" 
              className="flex items-center gap-4 p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                <Mail className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/70 mb-1">Email us</p>
                <p className="text-xl font-semibold text-primary-foreground">info@kcssc.ca</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                <MapPin className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-primary-foreground/70 mb-1">Visit us</p>
                <p className="text-xl font-semibold text-primary-foreground">123 Community Centre Drive, Kanata</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
