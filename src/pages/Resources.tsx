import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ExternalLink, Heart, Phone, Home, Bus, FileText, Users } from "lucide-react";

const resourceCategories = [
  {
    title: "Health Services",
    icon: Heart,
    resources: [
      { name: "Ottawa Public Health", description: "Health information and services", url: "https://www.ottawapublichealth.ca" },
      { name: "Queensway Carleton Hospital", description: "Local hospital services", url: "https://www.qch.on.ca" },
      { name: "Telehealth Ontario", description: "24/7 health advice line: 1-866-797-0000", url: "tel:1-866-797-0000" },
      { name: "OHIP Information", description: "Ontario health coverage", url: "https://www.ontario.ca/page/ohip" },
    ],
  },
  {
    title: "Government Services",
    icon: FileText,
    resources: [
      { name: "Service Canada", description: "Federal benefits and services", url: "https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html" },
      { name: "ServiceOntario", description: "Provincial services and documents", url: "https://www.ontario.ca/page/serviceontario" },
      { name: "Old Age Security (OAS)", description: "Pension information", url: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html" },
      { name: "City of Ottawa 311", description: "City services and information", url: "tel:311" },
    ],
  },
  {
    title: "Housing & Home Support",
    icon: Home,
    resources: [
      { name: "Ottawa Community Housing", description: "Affordable housing options", url: "https://www.och-lco.ca" },
      { name: "Home Care Services", description: "In-home support services", url: "https://www.ontario.ca/page/find-home-and-community-care-services-your-area" },
      { name: "Meals on Wheels", description: "Meal delivery for seniors", url: "https://www.wocrc.ca" },
      { name: "Ottawa Renovates", description: "Home modification assistance", url: "https://ottawa.ca/en/living-ottawa/housing/programs-and-funding" },
    ],
  },
  {
    title: "Transportation",
    icon: Bus,
    resources: [
      { name: "OC Transpo", description: "Public transit services", url: "https://www.octranspo.com" },
      { name: "Para Transpo", description: "Accessible transit for seniors", url: "https://www.octranspo.com/en/para-transpo" },
      { name: "Community Transportation", description: "Volunteer driver programs", url: "https://www.wocrc.ca" },
      { name: "Senior Ride Programs", description: "Subsidized rides for appointments", url: "#" },
    ],
  },
  {
    title: "Crisis & Support Lines",
    icon: Phone,
    resources: [
      { name: "Distress Centre Ottawa", description: "24/7 crisis support: 613-238-3311", url: "tel:613-238-3311" },
      { name: "Elder Abuse Support", description: "Senior safety resources", url: "https://www.elderabuseontario.com" },
      { name: "211 Ontario", description: "Community services directory", url: "tel:211" },
      { name: "Mental Health Crisis Line", description: "613-722-6914", url: "tel:613-722-6914" },
    ],
  },
  {
    title: "Community Organizations",
    icon: Users,
    resources: [
      { name: "Western Ottawa Community Resource Centre", description: "Local community services", url: "https://www.wocrc.ca" },
      { name: "Council on Aging of Ottawa", description: "Senior advocacy and resources", url: "https://www.coaottawa.ca" },
      { name: "Good Companions Centre", description: "Senior programs and meals", url: "https://www.goodcompanions.ca" },
      { name: "Chinese Community Association", description: "Cultural community support", url: "#" },
    ],
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Resources"
          description="Helpful links and information for seniors in our community."
          breadcrumbs={[{ label: "Resources" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xl text-muted-foreground">
                We've compiled a list of useful resources to help you find the services and support you need. If you need help navigating these resources, please contact us.
              </p>
            </div>

            <div className="space-y-12">
              {resourceCategories.map((category) => (
                <div key={category.title}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kcssc-red-light">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.resources.map((resource) => (
                      <a
                        key={resource.name}
                        href={resource.url}
                        target={resource.url.startsWith("http") ? "_blank" : undefined}
                        rel={resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="bg-card rounded-xl p-5 shadow-soft border border-border/50 card-hover flex items-start justify-between gap-4 group"
                      >
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {resource.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Help Finding Resources */}
            <div className="mt-16 bg-kcssc-gold-light rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Need Help Finding Resources?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our staff and volunteers are here to help you navigate community resources. Don't hesitate to reach out.
              </p>
              <a href="tel:+16135551234" className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:underline">
                <Phone className="h-5 w-5" />
                Call us at (613) 555-1234
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
