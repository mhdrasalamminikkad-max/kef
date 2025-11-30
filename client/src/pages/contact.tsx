import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Loader2
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@keralaeconomicforum.org", "support@keralaeconomicforum.org"],
    action: "mailto:info@keralaeconomicforum.org",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 471 123 4567", "+91 484 987 6543"],
    action: "tel:+914711234567",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Kerala Economic Forum", "Technopark Phase 1", "Thiruvananthapuram, Kerala 695581"],
    action: null,
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Monday - Friday", "9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 2:00 PM"],
    action: null,
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const faqItems = [
  {
    question: "How can I become a member of KEF?",
    answer: "You can join KEF by filling out the membership application form on our Membership page. We offer different membership tiers for individuals, students, corporates, and institutions.",
  },
  {
    question: "Is there a fee to join KEF?",
    answer: "Individual and Student memberships are free. Corporate and Institutional memberships have custom pricing based on the level of engagement and benefits required.",
  },
  {
    question: "How can my startup get support from KEF?",
    answer: "Visit our Startup Support page to learn about our various support programs. You can apply through our application form and our team will review your submission.",
  },
  {
    question: "Can I partner with KEF for events?",
    answer: "Absolutely! We welcome partnerships for events, programs, and initiatives. Contact us through this form or email us at partnerships@keralaeconomicforum.org.",
  },
];

export default function Contact() {
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out! We'll get back to you within 24-48 hours.",
      });
      const form = document.getElementById('contact-form-element') as HTMLFormElement;
      form?.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Send",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: InsertContact = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };
    
    contactMutation.mutate(data);
  };

  return (
    <>
      <Hero
        title="Contact Us"
        description="Have questions or want to collaborate? We'd love to hear from you."
        size="small"
        gradient="teal"
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              We're Here to Help
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you have a question about our programs, want to explore partnership 
              opportunities, or just want to say hello, we're always happy to hear from you.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <div key={info.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                    aria-label={social.label}
                    data-testid={`contact-social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-foreground">Send Us a Message</h3>
                <p className="text-muted-foreground">Fill out the form below and we'll get back to you soon</p>
              </CardHeader>
              <CardContent>
                <form id="contact-form-element" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" name="name" placeholder="Full name" required data-testid="contact-input-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" required data-testid="contact-input-email" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" placeholder="+91 XXXXX XXXXX" data-testid="contact-input-phone" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" name="subject" placeholder="How can we help?" required data-testid="contact-input-subject" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea 
                      id="message"
                      name="message" 
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px]"
                      required
                      data-testid="contact-input-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    disabled={contactMutation.isPending}
                    data-testid="contact-button-submit"
                  >
                    {contactMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="FAQ"
          title="Frequently Asked Questions"
          description="Quick answers to common questions about Kerala Economic Forum."
        />
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((faq, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-lg text-white/90">
                    Join Kerala Economic Forum today and become part of a thriving community 
                    of innovators and entrepreneurs.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" asChild data-testid="contact-button-join">
                    <a href="/membership">Join KEF</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold" asChild data-testid="contact-button-events">
                    <a href="/events">View Events</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
