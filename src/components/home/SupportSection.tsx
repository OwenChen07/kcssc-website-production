import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, HandHeart, ArrowRight } from "lucide-react";

const supportOptions = [
  {
    icon: Users,
    title: "Become a Member",
    description: "Join our community and enjoy access to all programs, events, and member-exclusive benefits.",
    cta: "Join Today",
    href: "/support/membership",
    variant: "default" as const,
  },
  {
    icon: HandHeart,
    title: "Volunteer With Us",
    description: "Share your time and talents to make a difference in the lives of seniors in our community.",
    cta: "Get Involved",
    href: "/support/membership",
    variant: "outline" as const,
  },
  {
    icon: Heart,
    title: "Support Our Work",
    description: "Your generous donations help us continue providing vital programs and services to seniors.",
    cta: "Donate Now",
    href: "/support/partners",
    variant: "accent" as const,
  },
];

export function SupportSection() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container-kcssc">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-semibold text-lg mb-3">Get Involved</p>
          <h2 className="text-foreground mb-6">Support Our Community</h2>
          <p className="text-muted-foreground text-xl">
            Whether you want to join as a member, volunteer your time, or support us financially, there are many ways to help our community thrive.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-8">
          {supportOptions.map((option, index) => (
            <div
              key={option.title}
              className="bg-card rounded-2xl p-8 shadow-soft card-hover border border-border/50 flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light mb-6">
                <option.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{option.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">{option.description}</p>
              <Button asChild variant={option.variant} size="lg" className="w-full">
                <Link to={option.href}>
                  {option.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
