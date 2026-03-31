import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Heart, Check, DollarSign, Target, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Donate() {
  const donationTiers = [
    {
      amount: 25,
      title: "Friend",
      description: "Support one event or program session",
      benefits: ["Recognition in monthly newsletter", "Event discount code"],
    },
    {
      amount: 50,
      title: "Supporter",
      description: "Support weekly programming for seniors",
      benefits: ["All Friend benefits", "Quarterly impact report", "Social media recognition"],
      highlighted: true,
    },
    {
      amount: 100,
      title: "Patron",
      description: "Support a full month of programs",
      benefits: ["All Supporter benefits", "Annual recognition dinner invite", "Dedicated thank you card from members"],
    },
    {
      amount: 250,
      title: "Benefactor",
      description: "Major support for our mission",
      benefits: ["All Patron benefits", "Named sponsorship opportunity", "Annual impact report with your name"],
    },
  ];

  const impactMetrics = [
    {
      value: "$500",
      description: "Provides one full program session for 25+ seniors",
      icon: Target,
    },
    {
      value: "$1,000",
      description: "Funds a month of wellness workshops",
      icon: Heart,
    },
    {
      value: "$2,500",
      description: "Supports cultural events and celebrations",
      icon: Users,
    },
    {
      value: "$5,000",
      description: "Funds specialized programming for a full quarter",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Donate to KCSSC"
          description="Your support makes a meaningful difference in the lives of seniors in our community. Every donation helps us continue our mission of providing enriching programs, events, and services."
          breadcrumbs={[
            { label: "Support", href: "#" },
            { label: "Donate" },
          ]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            {/* Why Donate Section */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Why Your Support Matters</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light mb-6">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Community Impact</h3>
                  <p className="text-muted-foreground">
                    Your donation directly supports programs and services for hundreds of seniors in the Kanata community who rely on us for connection, wellness, and enrichment.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light mb-6">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Mission-Driven</h3>
                  <p className="text-muted-foreground">
                    We're a non-profit organization dedicated to supporting and enriching the lives of Chinese seniors. Every dollar goes directly toward our programs.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-kcssc-red-light mb-6">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Measurable Results</h3>
                  <p className="text-muted-foreground">
                    We track and share how donations are used. You'll receive regular updates on the programs and activities your support has made possible.
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Tiers */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Choose Your Donation Level</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {donationTiers.map((tier) => (
                  <div
                    key={tier.amount}
                    className={`rounded-2xl p-8 shadow-soft border flex flex-col h-full transition-all ${
                      tier.highlighted
                        ? "bg-accent border-accent scale-105 md:scale-110"
                        : "bg-card border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="mb-4">
                      <p className={`text-4xl font-bold mb-2 ${tier.highlighted ? "text-accent-foreground" : "text-primary"}`}>
                        ${tier.amount}
                      </p>
                      <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? "text-accent-foreground" : "text-foreground"}`}>
                        {tier.title}
                      </h3>
                      <p className={`text-sm ${tier.highlighted ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
                        {tier.description}
                      </p>
                    </div>

                    <div className="flex-grow mb-6">
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className={`h-5 w-5 shrink-0 mt-0.5 ${tier.highlighted ? "text-accent-foreground" : "text-primary"}`} />
                            <span className={tier.highlighted ? "text-accent-foreground" : "text-muted-foreground"}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      <DollarSign className="mr-2 h-5 w-5" />
                      Donate ${tier.amount}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-8">
                All donations are tax-deductible. We are a registered charitable organization.
              </p>
            </div>

            {/* Impact Metrics */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Your Impact</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {impactMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.value} className="text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-kcssc-red-light mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                      <p className="text-muted-foreground">{metric.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Ways to Support */}
            <div className="bg-secondary rounded-2xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Other Ways to Support Us</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Become a Member</h3>
                  <p className="text-muted-foreground mb-6">
                    Join our community and support us through membership fees while enjoying access to all our programs and events.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/support/membership">Learn More</Link>
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Volunteer</h3>
                  <p className="text-muted-foreground mb-6">
                    Share your time and talents. Volunteers are essential to our mission of serving the community.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/support/membership">Get Involved</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-2">Are donations tax-deductible?</h3>
                  <p className="text-muted-foreground">
                    Yes! KCSSC is a registered charitable organization. All donations are tax-deductible. You will receive a tax receipt for your donation.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-2">How is my donation used?</h3>
                  <p className="text-muted-foreground">
                    Your donation supports our programs, services, and operations. We maintain a lean operational structure to maximize the impact of every dollar. Financial reports are available upon request.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-2">Can I set up a recurring donation?</h3>
                  <p className="text-muted-foreground">
                    Absolutely! Monthly giving is a wonderful way to provide steady support. Contact us to set up a recurring donation or visit our donation portal.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-2">How can I donate in honor of someone?</h3>
                  <p className="text-muted-foreground">
                    We can create a tribute donation in honor or in memory of someone special. Please contact us for more details on how to do this.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-accent rounded-2xl p-12 text-center">
              <h3 className="text-2xl font-bold text-accent-foreground mb-4">Have Questions?</h3>
              <p className="text-accent-foreground/90 mb-6 text-lg">
                Contact us for more information about donating or supporting KCSSC.
              </p>
              <Button asChild variant="default" className="bg-background text-foreground hover:bg-background/90">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
