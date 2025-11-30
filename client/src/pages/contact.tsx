import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Contact() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-cyan-400 to-yellow-300 opacity-95" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4"
            data-testid="text-contact-title"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
            data-testid="text-contact-subtitle"
          >
            We'd love to collaborate, support, and grow with you.
          </motion.p>
        </div>
      </section>

      {/* CONTACT FORM AND INFO */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-form-title">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" data-testid="input-contact-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+91 XXXXX XXXXX" data-testid="input-contact-phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="institution">Institution</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} data-testid="input-contact-message" />
                  </div>
                  <Button type="submit" className="w-full bg-yellow-300 text-black hover:bg-yellow-400 border-yellow-400" data-testid="button-submit-contact">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-address-title">
                  Address
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Kerala Economic Forum</p>
                      <p className="text-muted-foreground text-sm" data-testid="text-address">
                        Level 3, Venture Arcade, Mavoor Rd, above Croma, Thondayad, Kozhikode, Kerala 673016
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground text-sm" data-testid="text-email">
                        inquiry@keralaeconomicforum.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-muted-foreground text-sm" data-testid="text-phone">
                        +91 XXXXX XXXXX
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-social-title">
                  Social Media
                </h2>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-cyan-400 hover:opacity-80 flex items-center justify-center transition-opacity"
                      aria-label={social.label}
                      data-testid={`social-${social.label.toLowerCase()}`}
                    >
                      <social.icon className="w-6 h-6 text-white" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
