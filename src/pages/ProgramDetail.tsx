import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Clock,
  Users,
  Palette,
  Heart,
  Music,
  BookOpen,
  Utensils,
  Dumbbell,
  Calendar,
  Laptop,
  GraduationCap,
  Camera,
} from "lucide-react";
import { fetchProgramById } from "@/lib/api-service";
import type { Program } from "@/lib/data-service";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Palette,
  Heart,
  Music,
  BookOpen,
  Utensils,
  Dumbbell,
  Calendar,
  Laptop,
  GraduationCap,
  Camera,
  Users,
};

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgram() {
      if (!id) {
        setError("Program ID is missing.");
        setIsLoading(false);
        return;
      }

      const programId = Number(id);
      if (!Number.isFinite(programId) || programId <= 0) {
        setError("Invalid program ID.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const programData = await fetchProgramById(programId);
        setProgram(programData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load program");
        setProgram(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProgram();
  }, [id]);

  const IconComponent = program ? iconMap[program.icon] || Users : Users;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title={program?.title || "Program Details"}
          description="Program details and schedule information"
          breadcrumbs={[
            { label: "Programs", href: "/programs" },
            { label: program?.title || "Details" },
          ]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc max-w-4xl">
            <div className="mb-8">
              <Button asChild variant="outline">
                <Link to="/programs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Programs
                </Link>
              </Button>
            </div>

            {isLoading && (
              <div className="bg-card rounded-2xl p-12 shadow-soft border border-border/50 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading program details...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button asChild>
                  <Link to="/programs">Return to Programs</Link>
                </Button>
              </div>
            )}

            {program && !isLoading && !error && (
              <article className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-kcssc-gold-light text-accent-foreground">
                    {program.ageGroup}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-kcssc-red-light text-primary">
                    {program.category}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light shrink-0">
                    <IconComponent className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-foreground">{program.title}</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{program.schedule}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{program.spots}</span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{program.description}</p>
                </div>
              </article>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
