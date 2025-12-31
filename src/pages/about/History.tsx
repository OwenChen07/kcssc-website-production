import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";

const timeline = [
  {
    year: "2005",
    title: "KCSSC Founded",
    description: "A small group of dedicated volunteers came together to address the needs of Chinese seniors in Kanata, forming the foundation of what would become KCSSC.",
  },
  {
    year: "2008",
    title: "First Community Centre",
    description: "We opened our first dedicated space, providing a home for programs, gatherings, and support services for the growing community.",
  },
  {
    year: "2012",
    title: "Expanded Programs",
    description: "Launched health and wellness programs, arts classes, and language exchange programs to serve diverse interests and needs.",
  },
  {
    year: "2015",
    title: "10th Anniversary",
    description: "Celebrated a decade of service with over 300 active members and recognition from the City of Ottawa for community contributions.",
  },
  {
    year: "2018",
    title: "New Partnerships",
    description: "Established partnerships with local healthcare providers and community organizations to expand our reach and services.",
  },
  {
    year: "2020",
    title: "Virtual Programs",
    description: "Adapted to serve our community during challenging times by launching virtual programs, keeping seniors connected and engaged.",
  },
  {
    year: "2023",
    title: "Modernized Facilities",
    description: "Completed renovations to our community space, adding accessibility features and modern amenities for all members.",
  },
  {
    year: "Today",
    title: "Growing Strong",
    description: "With over 500 members and 100+ volunteers, KCSSC continues to expand its programs and impact in the Kanata community.",
  },
];

export default function History() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Our History"
          description="From humble beginnings to a thriving community organization, learn about our journey."
          breadcrumbs={[{ label: "About", href: "/about/mission" }, { label: "History" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="max-w-4xl mx-auto">
              {/* Intro */}
              <div className="text-center mb-16">
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80" 
                    alt="Community history" 
                    className="w-full h-64 object-cover"
                  />
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  For nearly two decades, KCSSC has been dedicated to enriching the lives of Chinese seniors in Kanata. Our story is one of community, perseverance, and the power of coming together.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />

                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Year bubble */}
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm z-10">
                      {item.year.slice(-2)}
                    </div>

                    {/* Content */}
                    <div className={`md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-kcssc-gold-light text-accent-foreground mb-3">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
