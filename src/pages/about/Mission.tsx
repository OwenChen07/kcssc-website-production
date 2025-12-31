import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Target, Eye, Heart, Users, Sparkles, Shield } from "lucide-react";

const values = [
  { icon: Heart, title: "Compassion", description: "We treat every senior with kindness, empathy, and understanding." },
  { icon: Users, title: "Community", description: "We foster connections and belonging among Chinese seniors." },
  { icon: Sparkles, title: "Cultural Pride", description: "We celebrate and preserve Chinese heritage and traditions." },
  { icon: Shield, title: "Respect", description: "We honor the wisdom and dignity of our elders." },
];

export default function Mission() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Mission & Vision"
          description="Bridging generations, connecting cultures, and thriving together."
          breadcrumbs={[{ label: "About", href: "/about/mission" }, { label: "Mission & Vision" }]}
        />

        {/* Who We Are Section */}
        <section className="py-8 md:py-12 bg-secondary">
          <div className="container-kcssc">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-foreground mb-6">Who We Are</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    The Kanata Chinese Seniors Support Centre (KCSSC) is a non-profit hub dedicated to helping the local Chinese community thrive and integrate into mainstream Canadian society. While our primary focus remains on seniors, we empower individuals of all ages to overcome barriers, share their heritage, and achieve success as active members of the Canadian community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container-kcssc">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-foreground mb-6">Our Mission</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    KCSSC empowers the local Chinese community to thrive and belong. While focusing on the well-being of seniors, we provide members of all ages with health programs, language training, and developmental seminars to foster successful integration into Canadian society.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-8 md:py-12 bg-secondary">
          <div className="container-kcssc">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-foreground mb-6">Our Vision</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We envision a vibrant, inclusive community where Chinese seniors and individuals of all ages are empowered with the resources to thrive, achieve well-being, and belong fully within Canadian society. By building bridges between generations and cultures, we ensure that no one is left behind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container-kcssc">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-foreground mb-6">Our Core Values</h2>
              <p className="text-xl text-muted-foreground">
                These principles guide everything we do at KCSSC.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
