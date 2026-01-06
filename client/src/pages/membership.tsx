import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, 
  GraduationCap, 
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  Briefcase,
  Sparkles,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Floating3DShapes } from "@/components/animations";

const membershipBenefits = [
  "Access to all events",
  "Mentorship & advisory",
  "Funding support",
  "Networking circles",
  "Startup resources",
  "Campus opportunities",
  "Recognition badges"
];

const membershipTypes = [
  {
    icon: Briefcase,
    title: "Entrepreneur Membership",
    description: "For startup founders, business owners, and aspiring entrepreneurs looking to connect, learn, and grow within Kerala's entrepreneurial ecosystem.",
    gradient: "red"
  },
  {
    icon: GraduationCap,
    title: "Student Membership",
    description: "For students passionate about entrepreneurship, looking for mentorship, networking, and opportunities to start their entrepreneurial journey.",
    gradient: "cyan"
  },
  {
    icon: Building2,
    title: "Business Membership",
    description: "For established businesses wanting to connect with startups, support the ecosystem, and find collaboration opportunities.",
    gradient: "yellow"
  },
  {
    icon: TrendingUp,
    title: "Investor Membership",
    description: "For angel investors, VCs, and investment professionals looking to discover and support promising startups in Kerala.",
    gradient: "red"
  },
  {
    icon: Award,
    title: "Institutional Membership",
    description: "For colleges, universities, incubators, and organizations wanting to partner with KEF for campus programs and ecosystem building.",
    gradient: "cyan"
  }
];

export default function Membership() {
  return (
    <>
      {/* HERO - Glassmorphism */}
      <section className="relative overflow-hidden min-h-[450px] lg:min-h-[500px] flex items-center">
        <div className="absolute inset-0 hero-gradient-animated" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <Floating3DShapes />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Join the Movement
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-6 hero-text-shadow"
          >
            Become a Member of Kerala Economic Forum
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/90 max-w-2xl mx-auto mb-8"
          >
            Join the movement and become part of Kerala's most vibrant entrepreneurial network. Get exclusive access to mentorship, funding, and networking opportunities.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/membership/apply">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 h-12 text-lg group">
                <UserPlus className="mr-2 w-5 h-5" />
                Apply for Membership
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MEMBERSHIP BENEFITS */}
      <Section>
        <SectionHeader title="Membership Benefits" subtitle="Exclusive Perks" />
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {membershipBenefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate overflow-visible bg-card/50 backdrop-blur-sm border-primary/5">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rotate-45 bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 -rotate-45" />
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* MEMBERSHIP TYPES */}
      <Section background="muted">
        <SectionHeader title="Membership Types" subtitle="Choose Your Path" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipTypes.map((type, index) => (
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
                    type.gradient === 'red' ? 'bg-red-500' :
                    type.gradient === 'yellow' ? 'bg-yellow-400' :
                    'bg-cyan-500'
                  }`}>
                    <type.icon className={`w-7 h-7 -rotate-45 ${type.gradient === 'yellow' ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA SECTION */}
      <Section className="text-center">
        <div className="max-w-2xl mx-auto py-12 px-6 bg-primary/5 rounded-3xl border border-primary/10">
          <SectionHeader 
            title="Ready to take the next step?" 
            description="Join our community of innovators and start building the future of Kerala today."
            align="center"
            className="mb-8"
          />
          <Link href="/membership/apply">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold px-10 h-14 text-xl shadow-xl shadow-red-500/20">
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
