import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Mail } from "lucide-react";

const boardMembers = [
  {
    name: "Dr. Wei Chen",
    role: "President",
    bio: "Retired physician with 30 years of experience in community health. Dr. Chen has been with KCSSC since 2010 and leads our strategic initiatives.",
  },
  {
    name: "Linda Zhang",
    role: "Vice President",
    bio: "Former social worker and community advocate. Linda oversees our volunteer programs and member services.",
  },
  {
    name: "Robert Liu",
    role: "Treasurer",
    bio: "Retired accountant with expertise in nonprofit financial management. Robert ensures our resources are used effectively.",
  },
  {
    name: "Margaret Wong",
    role: "Secretary",
    bio: "Educator and longtime community volunteer. Margaret manages our communications and record-keeping.",
  },
  {
    name: "David Huang",
    role: "Director of Programs",
    bio: "Cultural arts specialist who coordinates our diverse programming. David has introduced many beloved programs to KCSSC.",
  },
  {
    name: "Susan Lee",
    role: "Director of Outreach",
    bio: "Marketing professional dedicated to expanding our community reach. Susan builds partnerships with local organizations.",
  },
];

export default function Board() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Board of Directors"
          description="Meet the dedicated volunteers who guide our organization and serve our community."
          breadcrumbs={[{ label: "About", href: "/about/mission" }, { label: "Board of Directors" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our Board of Directors consists of dedicated community members who volunteer their time and expertise to ensure KCSSC fulfills its mission. Their collective experience spans healthcare, education, finance, and social services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.map((member) => (
                <div key={member.name} className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 card-hover">
                  {/* Avatar placeholder */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kcssc-red-light text-primary text-2xl font-bold mb-6">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>

            {/* Contact section */}
            <div className="mt-16 bg-secondary rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Contact the Board</h3>
              <p className="text-muted-foreground mb-6">
                Have questions or suggestions for our leadership team? We'd love to hear from you.
              </p>
              <a
                href="mailto:board@kcssc.ca"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Mail className="h-5 w-5" />
                board@kcssc.ca
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
