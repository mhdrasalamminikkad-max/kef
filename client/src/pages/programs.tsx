import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Lightbulb,
  Building2,
  Award,
  Target,
  Briefcase,
  Globe,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { ProgramCard } from "@/components/program-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const flagshipPrograms = [
  {
    icon: Rocket,
    title: "Startup Accelerator Program",
    description: "A 12-week intensive program designed to accelerate early-stage startups from idea validation to market entry.",
    features: [
      "Weekly mentorship sessions with industry experts",
      "Access to seed funding opportunities",
      "Workspace and infrastructure support",
      "Demo day with investors",
    ],
    href: "/programs/accelerator",
    gradient: "purple" as const,
  },
  {
    icon: Building2,
    title: "District Innovation Hubs",
    description: "Decentralized innovation centers in all 14 districts providing local entrepreneurs with resources and support.",
    features: [
      "Co-working spaces and meeting rooms",
      "Local mentor network",
      "Access to state-level programs",
      "Community building activities",
    ],
    href: "/programs/innovation-hubs",
    gradient: "blue" as const,
  },
  {
    icon: Users,
    title: "Women Entrepreneurship Program",
    description: "Dedicated initiative to support and empower women entrepreneurs across Kerala.",
    features: [
      "Specialized mentorship for women founders",
      "Access to women-focused funding",
      "Networking with successful women entrepreneurs",
      "Work-life balance workshops",
    ],
    href: "/programs/women-entrepreneurship",
    gradient: "teal" as const,
  },
  {
    icon: Globe,
    title: "Global Connect Program",
    description: "Facilitating international exposure and market access for Kerala startups ready to scale globally.",
    features: [
      "International market immersion trips",
      "Global investor connections",
      "Cross-border partnership facilitation",
      "Export readiness training",
    ],
    href: "/programs/global-connect",
    gradient: "orange" as const,
  },
];

const skillPrograms = [
  {
    title: "Entrepreneurship Fundamentals",
    duration: "4 weeks",
    mode: "Hybrid",
    description: "Foundation course covering business model development, market research, and startup basics.",
  },
  {
    title: "Financial Management for Startups",
    duration: "3 weeks",
    mode: "Online",
    description: "Learn financial planning, fundraising strategies, and investor relations.",
  },
  {
    title: "Digital Marketing Masterclass",
    duration: "6 weeks",
    mode: "Online",
    description: "Comprehensive digital marketing training for startup growth and customer acquisition.",
  },
  {
    title: "Leadership & Team Building",
    duration: "2 weeks",
    mode: "In-person",
    description: "Develop leadership skills essential for building and managing high-performing teams.",
  },
];

const programBenefits = [
  "Expert mentorship from industry leaders",
  "Access to funding and investment opportunities",
  "State-of-the-art infrastructure and resources",
  "Networking with Kerala's startup ecosystem",
  "Hands-on workshops and training sessions",
  "Connection to government schemes and support",
];

export default function Programs() {
  return (
    <>
      <Hero
        title="Our Programs"
        description="Comprehensive programs designed to support entrepreneurs at every stage of their journey, from ideation to scaling."
        size="small"
        gradient="purple"
      />

      <Section>
        <SectionHeader
          subtitle="Flagship Programs"
          title="Transformative Initiatives for Entrepreneurs"
          description="Our flagship programs provide intensive support to help startups accelerate their growth and achieve success."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {flagshipPrograms.map((program, index) => (
            <ProgramCard
              key={program.title}
              icon={program.icon}
              title={program.title}
              description={program.description}
              features={program.features}
              href={program.href}
              gradient={program.gradient}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="Skill Development"
          title="Training Programs"
          description="Structured courses to build essential skills for entrepreneurial success."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillPrograms.map((program, index) => (
            <motion.div key={program.title} variants={itemVariants}>
              <Card className="h-full hover-elevate">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg text-foreground">{program.title}</h3>
                    <Badge variant="secondary" className="shrink-0">{program.mode}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{program.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration: {program.duration}</span>
                    <Button variant="ghost" className="p-0 h-auto font-medium text-primary">
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
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
              Why Join Our Programs?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our programs are designed with a holistic approach, providing not just knowledge 
              but also the resources, connections, and support system needed to build successful ventures.
            </p>
            <ul className="space-y-3">
              {programBenefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg">
                      <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <span className="text-sm font-medium">Goal-Oriented</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg">
                      <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <span className="text-sm font-medium">Industry-Ready</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg">
                      <Users className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                      <span className="text-sm font-medium">Community-Driven</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 shadow-lg">
                      <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <span className="text-sm font-medium">Excellence-Focused</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                Ready to Join a Program?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Take the first step towards your entrepreneurial success. Apply now or contact us to learn more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/membership">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-programs-apply">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold" data-testid="button-programs-contact">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
