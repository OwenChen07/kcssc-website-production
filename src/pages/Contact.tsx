import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I become a member?",
    answer: "You can become a member by filling out our membership form online or visiting our office. Annual membership is $25 and runs from January to December.",
  },
  {
    question: "What programs are available for non-members?",
    answer: "While members get priority access to all programs, some events and workshops are open to the public. Check our Events page for upcoming public events.",
  },
  {
    question: "How can I volunteer with KCSSC?",
    answer: "We welcome volunteers! Visit our Memberships & Volunteers page to learn about volunteer opportunities and submit an application.",
  },
  {
    question: "Is there parking available?",
    answer: "Yes, we have free parking available in the lot behind our building. Accessible parking spots are located near the entrance.",
  },
  {
    question: "Do I need to speak Chinese to participate?",
    answer: "While many of our programs are conducted in Mandarin or Cantonese, we welcome everyone! Some programs are bilingual, and our staff can assist with translation.",
  },
  {
    question: "How do I register for programs?",
    answer: "Members can register for programs in person at our office, by phone, or online. Some popular programs fill up quickly, so early registration is recommended.",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll respond within 1-2 business days.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHeader
          title="Contact Us"
          description="We'd love to hear from you. Reach out with questions, feedback, or just to say hello."
          breadcrumbs={[{ label: "Contact Us" }]}
        />

        <section className="section-padding bg-background">
          <div className="container-kcssc">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-foreground mb-8">Get in Touch</h2>

                <div className="space-y-6 mb-10">
                  <a href="tel:+16135551234" className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-kcssc-gold-light transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                      <Phone className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-lg font-semibold text-foreground">(613) 555-1234</p>
                    </div>
                  </a>

                  <a href="mailto:info@kcssc.ca" className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-kcssc-gold-light transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-lg font-semibold text-foreground">info@kcssc.ca</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-lg font-semibold text-foreground">
                        123 Community Centre Drive<br />
                        Kanata, ON K2K 1X1
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                      <Clock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Office Hours</p>
                      <p className="text-lg font-semibold text-foreground">
                        Monday - Friday<br />
                        9:00 AM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-kcssc-gold-light rounded-2xl h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" 
                    alt="Community center location" 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-foreground font-medium bg-background/80 px-4 py-2 rounded-lg">Map coming soon</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-foreground mb-8">Send Us a Message</h2>

                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft border border-border/50">
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-base">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 text-lg mt-2"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-base">Email</Label>
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
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-base">Phone (optional)</Label>
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
                        <Label htmlFor="subject" className="text-base">Subject</Label>
                        <Input
                          id="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="h-12 text-lg mt-2"
                          placeholder="What is this about?"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-base">Message</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-[150px] text-lg mt-2"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-secondary">
          <div className="container-kcssc">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-foreground text-center mb-8">Frequently Asked Questions</h2>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl border border-border/50 px-6">
                    <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
