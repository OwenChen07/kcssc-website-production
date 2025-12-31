import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Building2, Heart, Users, Award, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const funders = [
  { name: "City of Ottawa", type: "Government" },
  { name: "Ontario Trillium Foundation", type: "Government" },
  { name: "United Way Eastern Ontario", type: "Nonprofit" },
  { name: "New Horizons for Seniors Program", type: "Government" },
];

const sponsors = [
  { name: "Kanata Business Association", level: "Gold" },
  { name: "TD Bank", level: "Gold" },
  { name: "Costco Kanata", level: "Silver" },
  { name: "Loblaws Kanata", level: "Silver" },
  { name: "Tim Hortons Kanata", level: "Bronze" },
  { name: "Shoppers Drug Mart", level: "Bronze" },
];

const partners = [
  { name: "Queensway Carleton Hospital", description: "Health screening and wellness programs" },
  { name: "Ottawa Public Library", description: "Educational programs and resources" },
  { name: "Kanata Community Centre", description: "Shared facilities and programs" },
  { name: "Western Ottawa Community Resource Centre", description: "Referrals and support services" },
];

export default function Partners() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Funders, Sponsors & Partners"
          description="We're grateful for the organizations that support our mission and make our work possible."
          breadcrumbs={[{ label: "Support Us", href: "/support/membership" }, { label: "Partners" }]}
        />

        {/* Funders Section */}
        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="text-center mb-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light mx-auto mb-6">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-foreground mb-4">Our Funders</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're proud to receive support from government and nonprofit organizations that share our commitment to senior wellbeing.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {funders.map((funder) => (
                <div key={funder.name} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 text-center">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <div className="h-14 w-14 rounded-full bg-kcssc-gold-light flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-accent-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{funder.name}</h3>
                  <p className="text-sm text-muted-foreground">{funder.type}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="section-padding bg-secondary">
          <div className="container-kcssc">
            <div className="text-center mb-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-foreground mb-4">Our Sponsors</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Local businesses that invest in our community through event sponsorships and in-kind donations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sponsor.level === "Gold" 
                        ? "bg-accent text-accent-foreground"
                        : sponsor.level === "Silver"
                        ? "bg-muted text-muted-foreground"
                        : "bg-kcssc-red-light text-primary"
                    }`}>
                      {sponsor.level} Sponsor
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{sponsor.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="text-center mb-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-foreground mb-4">Community Partners</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Organizations we collaborate with to better serve our community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {partners.map((partner) => (
                <div key={partner.name} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kcssc-gold-light shrink-0">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{partner.name}</h3>
                    <p className="text-muted-foreground">{partner.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Become a Supporter CTA */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-kcssc text-center">
            <Heart className="h-12 w-12 mx-auto mb-6 text-accent" />
            <h2 className="text-primary-foreground mb-4">Become a Supporter</h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Interested in sponsoring our events, partnering with us, or making a donation? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <a href="mailto:partnerships@kcssc.ca">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us About Partnerships
                </a>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/contact">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
