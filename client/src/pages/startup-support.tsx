import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Rocket, 
  Building, 
  DollarSign, 
  Users, 
  Lightbulb,
  FileCheck,
  Scale,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { IconCard } from "@/components/icon-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const supportServices = [
  {
    icon: Lightbulb,
    title: "Ideation Support",
    description: "Transform your ideas into viable business concepts with our structured ideation workshops and validation frameworks.",
    gradient: "purple" as const,
  },
  {
    icon: Building,
    title: "Incubation Services",
    description: "Access workspace, infrastructure, and a supportive environment to build your startup from the ground up.",
    gradient: "blue" as const,
  },
  {
    icon: Users,
    title: "Mentorship Network",
    description: "Connect with experienced entrepreneurs, industry experts, and advisors who guide your journey.",
    gradient: "teal" as const,
  },
  {
    icon: DollarSign,
    title: "Funding Access",
    description: "Navigate the funding landscape with introductions to angel investors, VCs, and government grants.",
    gradient: "orange" as const,
  },
  {
    icon: FileCheck,
    title: "Legal & Compliance",
    description: "Get assistance with company registration, IP protection, and regulatory compliance.",
    gradient: "purple" as const,
  },
  {
    icon: Scale,
    title: "Market Access",
    description: "Connect with potential customers, partners, and distribution channels to scale your business.",
    gradient: "blue" as const,
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    description: "Build your brand and reach your target audience with our marketing and PR assistance.",
    gradient: "teal" as const,
  },
  {
    icon: Briefcase,
    title: "B2B Connections",
    description: "Facilitate business partnerships and corporate pilot opportunities for startups.",
    gradient: "orange" as const,
  },
];

const successSteps = [
  {
    step: "01",
    title: "Application",
    description: "Submit your startup idea or business plan through our online portal for initial screening.",
  },
  {
    step: "02",
    title: "Assessment",
    description: "Our expert panel evaluates your application based on innovation, scalability, and team capability.",
  },
  {
    step: "03",
    title: "Onboarding",
    description: "Selected startups undergo orientation and are matched with appropriate mentors and resources.",
  },
  {
    step: "04",
    title: "Acceleration",
    description: "Participate in intensive programs, workshops, and get access to our full support ecosystem.",
  },
  {
    step: "05",
    title: "Demo Day",
    description: "Showcase your progress to investors, media, and industry leaders for funding and partnership opportunities.",
  },
];

const eligibilityCriteria = [
  "Early-stage startups (idea to growth stage)",
  "Innovative solutions addressing real problems",
  "Scalable business models",
  "Committed founding team",
  "Kerala-based or willing to establish presence",
  "Open to mentorship and community collaboration",
];

export default function StartupSupport() {
  return (
    <>
      <Hero
        title="Startup Support"
        description="Comprehensive support ecosystem to help you build, launch, and scale your startup in Kerala."
        size="small"
        gradient="teal"
      />

      <Section>
        <SectionHeader
          subtitle="Our Services"
          title="End-to-End Startup Support"
          description="From ideation to scaling, we provide all the resources and support you need to succeed."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportServices.map((service, index) => (
            <IconCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              gradient={service.gradient}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="How It Works"
          title="Your Journey with KEF"
          description="A clear, structured path from application to success."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {successSteps.map((step, index) => (
            <motion.div key={step.step} variants={itemVariants}>
              <Card className="h-full text-center relative overflow-visible">
                {index < successSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border z-10" />
                )}
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Who Can Apply?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Eligibility Criteria
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We welcome entrepreneurs at various stages of their journey. Whether you have 
              a groundbreaking idea or an early-stage startup looking to scale, our support 
              programs are designed to help you succeed.
            </p>
            <ul className="space-y-3 mb-8">
              {eligibilityCriteria.map((criterion, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{criterion}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/membership">
              <Button size="lg" data-testid="button-startup-apply">
                Apply for Support
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Rocket className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold text-foreground">Ready to Launch?</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">1</span>
                    </div>
                    <span className="font-medium">Fill the application form</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <span className="font-medium">Attend screening session</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <span className="text-teal-600 font-bold">3</span>
                    </div>
                    <span className="font-medium">Get matched with resources</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section background="gradient">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Have Questions About Our Support Programs?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Our team is here to help you understand how we can support your startup journey.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-startup-contact">
                  Get in Touch
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
