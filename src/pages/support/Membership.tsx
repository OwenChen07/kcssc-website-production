import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Users, Heart, Calendar, Gift, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const memberBenefits = [
  "Access to all programs and activities",
  "Priority registration for popular events",
  "Quarterly newsletter delivered to your home",
  "Voting rights at annual general meetings",
  "Discounts on special events and workshops",
  "Connection to a supportive community",
];

const volunteerRoles = [
  { icon: Users, title: "Program Assistant", description: "Help run classes and activities" },
  { icon: Heart, title: "Friendly Visitor", description: "Visit seniors at home or hospital" },
  { icon: Calendar, title: "Event Helper", description: "Assist with event setup and logistics" },
  { icon: Gift, title: "Office Support", description: "Help with administrative tasks" },
];

export default function Membership() {
  const { toast } = useToast();
  const [formType, setFormType] = useState<"member" | "volunteer">("member");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: formType === "member" ? "Membership Request Submitted!" : "Volunteer Application Submitted!",
      description: "Thank you for your interest! We'll be in touch within 2-3 business days.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Memberships & Volunteers"
          description="Join our community as a member or volunteer and make a difference."
          breadcrumbs={[{ label: "Support Us", href: "/support/membership" }, { label: "Memberships & Volunteers" }]}
        />

        {/* Membership Section */}
        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 bg-kcssc-gold-light text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Star className="h-4 w-4" />
                  Membership
                </div>
                <h2 className="text-foreground mb-6">Become a Member</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join over 500 members who enjoy the benefits of being part of the KCSSC community. Annual membership is only $25.
                </p>

                <div className="space-y-4 mb-8">
                  {memberBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-kcssc-gold-light rounded-2xl p-6">
                  <p className="text-lg font-bold text-foreground mb-2">Annual Membership: $25</p>
                  <p className="text-muted-foreground">Membership runs from January to December each year.</p>
                </div>
              </div>

              {/* Volunteer Section */}
              <div>
                <div className="inline-flex items-center gap-2 bg-kcssc-red-light text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Heart className="h-4 w-4" />
                  Volunteering
                </div>
                <h2 className="text-foreground mb-6">Volunteer With Us</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Share your time and talents to make a meaningful difference. We have flexible volunteer opportunities for all schedules.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {volunteerRoles.map((role) => (
                    <div key={role.title} className="bg-card rounded-xl p-5 border border-border/50">
                      <role.icon className="h-8 w-8 text-primary mb-3" />
                      <h4 className="font-bold text-foreground mb-1">{role.title}</h4>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sign Up Form */}
        <section className="section-padding bg-secondary">
          <div className="container-kcssc">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-foreground text-center mb-4">Get Started</h2>
              <p className="text-muted-foreground text-center mb-8">
                Fill out the form below and we'll be in touch to help you join our community.
              </p>

              {/* Form Type Toggle */}
              <div className="flex gap-4 mb-8 justify-center">
                <Button
                  variant={formType === "member" ? "default" : "outline"}
                  onClick={() => setFormType("member")}
                >
                  I want to become a member
                </Button>
                <Button
                  variant={formType === "volunteer" ? "default" : "outline"}
                  onClick={() => setFormType("volunteer")}
                >
                  I want to volunteer
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 text-lg mt-2"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 text-lg mt-2"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 text-lg mt-2"
                      placeholder="(613) 555-1234"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-base">
                      {formType === "member" ? "Tell us about yourself" : "What interests you about volunteering?"}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[120px] text-lg mt-2"
                      placeholder={formType === "member" ? "Share a bit about yourself and what programs interest you..." : "Tell us about your skills, availability, and what volunteer roles interest you..."}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Submit {formType === "member" ? "Membership Request" : "Volunteer Application"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
