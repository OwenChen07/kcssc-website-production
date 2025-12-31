import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Palette, Heart, Music, BookOpen, Utensils, Dumbbell, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: Palette,
    title: "Arts & Crafts",
    description: "Express creativity through Chinese painting, calligraphy, and traditional crafts.",
    color: "bg-kcssc-red-light text-primary",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Stay active with Tai Chi, gentle exercise classes, and health workshops.",
    color: "bg-kcssc-gold-light text-accent-foreground",
  },
  {
    icon: Music,
    title: "Music & Dance",
    description: "Enjoy singing groups, traditional music, and cultural dance programs.",
    color: "bg-kcssc-red-light text-primary",
  },
  {
    icon: BookOpen,
    title: "Language & Learning",
    description: "Language exchange, computer skills, and lifelong learning opportunities.",
    color: "bg-kcssc-gold-light text-accent-foreground",
  },
  {
    icon: Utensils,
    title: "Social & Dining",
    description: "Connect with friends over shared meals and social gatherings.",
    color: "bg-kcssc-red-light text-primary",
  },
  {
    icon: Dumbbell,
    title: "Fitness Programs",
    description: "Gentle exercises designed for seniors to maintain mobility and strength.",
    color: "bg-kcssc-gold-light text-accent-foreground",
  },
];

export function ProgramsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-kcssc">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* <p className="text-accent font-semibold text-lg mb-3">Our Programs</p> */}
          <h2 className="text-foreground mb-6">Our Programs</h2>
          <p className="text-muted-foreground text-xl">
            From arts and culture to health and wellness, our diverse programs help seniors stay active, connected, and engaged.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-soft card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${program.color} mb-5`}>
                <program.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{program.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/programs">
              Explore All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
