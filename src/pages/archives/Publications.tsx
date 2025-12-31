import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const publications = [
  {
    id: 1,
    title: "KCSSC Newsletter - Winter 2024",
    type: "Newsletter",
    date: "December 2024",
    description: "Highlights from our holiday events, upcoming programs, and member spotlights.",
  },
  {
    id: 2,
    title: "KCSSC Newsletter - Fall 2024",
    type: "Newsletter",
    date: "September 2024",
    description: "Mid-Autumn Festival coverage, new program announcements, and volunteer recognition.",
  },
  {
    id: 3,
    title: "Annual Report 2023",
    type: "Report",
    date: "March 2024",
    description: "Our comprehensive annual report including financial statements, program outcomes, and future goals.",
  },
  {
    id: 4,
    title: "KCSSC Newsletter - Summer 2024",
    type: "Newsletter",
    date: "June 2024",
    description: "Summer program schedule, picnic recap, and health tips for seniors.",
  },
  {
    id: 5,
    title: "KCSSC Newsletter - Spring 2024",
    type: "Newsletter",
    date: "March 2024",
    description: "Lunar New Year celebration coverage, spring program preview, and community updates.",
  },
  {
    id: 6,
    title: "Member Handbook 2024",
    type: "Guide",
    date: "January 2024",
    description: "Everything new members need to know about KCSSC programs, services, and benefits.",
  },
  {
    id: 7,
    title: "Volunteer Guide",
    type: "Guide",
    date: "January 2024",
    description: "Information for volunteers including roles, responsibilities, and training resources.",
  },
  {
    id: 8,
    title: "Annual Report 2022",
    type: "Report",
    date: "March 2023",
    description: "Review of our achievements, challenges, and growth during 2022.",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Newsletter":
      return "bg-kcssc-gold-light text-accent-foreground";
    case "Report":
      return "bg-kcssc-red-light text-primary";
    case "Guide":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Publications() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Publications"
          description="Access our newsletters, annual reports, and other publications."
          breadcrumbs={[{ label: "Archives", href: "/archives/gallery" }, { label: "Publications" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="grid md:grid-cols-2 gap-6">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 card-hover flex gap-6"
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light shrink-0">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(pub.type)}`}>
                        {pub.type}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {pub.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{pub.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{pub.description}</p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscribe CTA */}
            <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Want to receive our newsletters and updates? Become a member to get all our publications delivered to you.
              </p>
              <Button variant="accent" size="lg" asChild>
                <a href="/support/membership">Join KCSSC</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
