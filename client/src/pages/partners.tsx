import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2, 
  Handshake,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const partnerTypes = [
  {
    icon: Building2,
    title: "Corporates",
    description: "Partner with us to support Kerala's startup ecosystem and discover innovative solutions.",
    color: "red"
  },
  {
    icon: GraduationCap,
    title: "Educational Institutions",
    description: "Collaborate on campus entrepreneurship programs, workshops, and innovation labs.",
    color: "cyan"
  },
  {
    icon: Briefcase,
    title: "Incubators & Accelerators",
    description: "Join our network to provide combined support for startups across Kerala.",
    color: "yellow"
  },
  {
    icon: Users,
    title: "Industry Leaders",
    description: "Share your expertise as mentors, speakers, and advisors to the community.",
    color: "red"
  }
];

export default function Partners() {
  return (
    <>
      {/* HERO - Glassmorphism */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 hero-gradient-animated" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rotate-45" />
          <div className="absolute bottom-20 left-10 w-16 h-16 border border-white/10 rotate-12" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Collaborate With Us
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4 hero-text-shadow"
            data-testid="text-partners-title"
          >
            Our Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto"
            data-testid="text-partners-subtitle"
          >
            We collaborate with organisations that believe in building Kerala's entrepreneurial future.
          </motion.p>
        </div>
      </section>

      {/* PARTNER TYPES */}
      <Section>
        <SectionHeader 
          title="Partner Categories" 
          description="Join our ecosystem and make a lasting impact on Kerala's entrepreneurial journey."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {partnerTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate overflow-visible">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rotate-45 flex items-center justify-center mb-4 ${
                    type.color === 'red' ? 'bg-red-500' :
                    type.color === 'yellow' ? 'bg-yellow-400' :
                    'bg-cyan-500'
                  }`}>
                    <type.icon className={`w-7 h-7 -rotate-45 ${type.color === 'yellow' ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PARTNER CTA */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-12">
                <div className="w-20 h-20 mx-auto rotate-45 bg-cyan-500 flex items-center justify-center mb-6">
                  <Handshake className="w-10 h-10 text-white -rotate-45" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-partners-cta-title">
                  Partner With Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto" data-testid="text-partners-cta-desc">
                  We collaborate with institutions, corporates, incubators, accelerators, and industry leaders to build Kerala's entrepreneurial ecosystem.
                </p>
                <Link href="/contact">
                  <Button size="lg" className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold" data-testid="button-become-partner">
                    Become a Partner
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
