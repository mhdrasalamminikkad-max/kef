import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Lightbulb, 
  Building2,
  HandshakeIcon,
  Award,
  ArrowRight,
  Calendar
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { IconCard } from "@/components/icon-card";
import { ProgramCard } from "@/components/program-card";
import { EventCard } from "@/components/event-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { PartnerLogo } from "@/components/partner-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const whatWeDo = [
  {
    icon: Rocket,
    title: "Startup Incubation",
    description: "Nurturing innovative ideas into successful ventures with mentorship and resources.",
    gradient: "purple" as const,
  },
  {
    icon: Users,
    title: "Networking Events",
    description: "Connecting entrepreneurs, investors, and industry leaders for collaborative growth.",
    gradient: "blue" as const,
  },
  {
    icon: GraduationCap,
    title: "Skill Development",
    description: "Comprehensive training programs to build entrepreneurial capabilities.",
    gradient: "teal" as const,
  },
  {
    icon: TrendingUp,
    title: "Market Access",
    description: "Facilitating market linkages and business opportunities for startups.",
    gradient: "orange" as const,
  },
];

const signaturePrograms = [
  {
    icon: Lightbulb,
    title: "Kerala Startup Mission Partnership",
    description: "Collaborative initiatives with KSUM to accelerate startup ecosystem development across the state.",
    features: ["Mentorship Programs", "Funding Access", "Infrastructure Support"],
    href: "/programs",
    gradient: "purple" as const,
  },
  {
    icon: Building2,
    title: "District Innovation Hubs",
    description: "Establishing innovation centers across all 14 districts to democratize entrepreneurship.",
    features: ["Local Incubation", "Community Building", "Resource Centers"],
    href: "/programs",
    gradient: "blue" as const,
  },
  {
    icon: GraduationCap,
    title: "Campus Ambassador Program",
    description: "Empowering students to become change agents and foster innovation in educational institutions.",
    features: ["Leadership Training", "Event Organization", "Network Building"],
    href: "/campus-initiatives",
    gradient: "teal" as const,
  },
];

const impactMetrics = [
  { end: 500, suffix: "+", label: "Startups Supported" },
  { end: 50, suffix: "+", label: "Events Annually" },
  { end: 10000, suffix: "+", label: "Community Members" },
  { end: 100, suffix: "+", label: "Industry Partners" },
];

const upcomingEvents = [
  {
    title: "Startup Kerala Summit 2024",
    date: "Dec 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Technopark, Thiruvananthapuram",
    description: "Annual flagship event bringing together the startup ecosystem for networking, learning, and collaboration.",
    category: "Summit",
  },
  {
    title: "Investor Connect Program",
    date: "Dec 20, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Kochi Startup Village",
    description: "Exclusive pitch session connecting promising startups with angel investors and venture capitalists.",
    category: "Networking",
  },
  {
    title: "Entrepreneurship Bootcamp",
    date: "Jan 5, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Virtual Event",
    description: "Intensive workshop covering business model development, market validation, and growth strategies.",
    category: "Workshop",
  },
];

const partners = [
  "Kerala Startup Mission",
  "KINFRA",
  "SIDBI",
  "IIM Kozhikode",
  "NASSCOM",
  "TiE Kerala",
  "CII Kerala",
  "KSIDC",
];

export default function Home() {
  return (
    <>
      <Hero
        subtitle="Welcome to Kerala Economic Forum"
        title="Empowering Entrepreneurs, Driving Economic Growth"
        description="Kerala Economic Forum (KEF) is a dynamic platform dedicated to fostering entrepreneurship, supporting startups, and driving sustainable economic growth across Kerala."
        primaryCta={{ label: "Join Our Community", href: "/membership" }}
        secondaryCta={{ label: "Watch Video", href: "/about" }}
      />

      <Section background="gradient">
        <SectionHeader
          subtitle="Who We Are"
          title="Building Kerala's Future Together"
          description="We are a community-driven organization committed to creating a vibrant entrepreneurial ecosystem that empowers innovators, nurtures talent, and accelerates economic development."
        />
        
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed mb-8">
            Founded with a vision to transform Kerala into a global hub for innovation and entrepreneurship, 
            KEF brings together entrepreneurs, investors, policymakers, and industry leaders to collaborate, 
            share knowledge, and create impactful solutions for society.
          </p>
          <Link href="/about">
            <Button size="lg" data-testid="button-learn-more-about">
              Learn More About Us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </Section>

      <Section>
        <SectionHeader
          subtitle="What We Do"
          title="Comprehensive Support for Your Journey"
          description="From ideation to scale-up, we provide end-to-end support to help entrepreneurs succeed at every stage of their journey."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeDo.map((item, index) => (
            <IconCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
              gradient={item.gradient}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="Signature Programs"
          title="Our Flagship Initiatives"
          description="Discover our key programs designed to accelerate startup growth and foster innovation across Kerala."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {signaturePrograms.map((program, index) => (
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
        
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Link href="/programs">
            <Button variant="outline" size="lg" data-testid="button-view-all-programs">
              View All Programs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </Section>

      <Section>
        <SectionHeader
          subtitle="Our Impact"
          title="Making a Difference"
          description="Numbers that reflect our commitment to building Kerala's entrepreneurial ecosystem."
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {impactMetrics.map((metric, index) => (
            <AnimatedCounter
              key={metric.label}
              end={metric.end}
              suffix={metric.suffix}
              label={metric.label}
            />
          ))}
        </div>
      </Section>

      <Section background="gradient">
        <SectionHeader
          subtitle="Upcoming Events"
          title="Join Our Events"
          description="Stay connected with the latest happenings in Kerala's entrepreneurial ecosystem."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {upcomingEvents.map((event, index) => (
            <EventCard
              key={event.title}
              {...event}
              index={index}
            />
          ))}
        </div>
        
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Link href="/events">
            <Button size="lg" data-testid="button-view-all-events">
              <Calendar className="mr-2 w-4 h-4" />
              View All Events
            </Button>
          </Link>
        </motion.div>
      </Section>

      <Section>
        <SectionHeader
          subtitle="Our Partners"
          title="Collaborating for Impact"
          description="We work with leading organizations to create opportunities and drive growth."
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {partners.map((partner, index) => (
            <PartnerLogo
              key={partner}
              name={partner}
              index={index}
            />
          ))}
        </div>
        
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Link href="/partners">
            <Button variant="outline" size="lg" data-testid="button-view-all-partners">
              <HandshakeIcon className="mr-2 w-4 h-4" />
              View All Partners
            </Button>
          </Link>
        </motion.div>
      </Section>

      <Section background="muted">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 lg:py-16 px-6 lg:px-12 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Start Your Entrepreneurial Journey?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join Kerala Economic Forum today and become part of a thriving community of innovators, 
                entrepreneurs, and change-makers shaping the future of Kerala.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/membership">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-cta-become-member">
                    <Award className="mr-2 w-4 h-4" />
                    Become a Member
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold" data-testid="button-cta-contact">
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
