import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Lightbulb, 
  Building2,
  HandshakeIcon,
  Briefcase,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  UserPlus,
  Star,
  ChevronRight,
  Zap,
  Target,
  Award,
  type LucideIcon
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Program } from "@shared/schema";
import { 
  FloatingParticles, 
  GlowingOrbs, 
  FadeInUp, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem,
  GradientText,
  MagneticButton,
  CountUp,
  RevealOnScroll,
  HoverScale
} from "@/components/animations";

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
};

const fallbackPrograms = [
  {
    title: "Startup Boot Camp",
    shortDesc: "3-day entrepreneurship experience",
    icon: "Rocket",
  },
  {
    title: "Business Conclaves",
    shortDesc: "Connect with industry leaders",
    icon: "Building2",
  },
  {
    title: "Founder Circle",
    shortDesc: "Exclusive networking meets",
    icon: "Users",
  },
  {
    title: "Advisory Clinics",
    shortDesc: "Expert mentoring sessions",
    icon: "Briefcase",
  },
  {
    title: "Campus Labs",
    shortDesc: "Student innovation hubs",
    icon: "GraduationCap",
  },
];

const whatWeDo = [
  {
    icon: Rocket,
    title: "Startup Support",
    description: "Mentoring & guidance",
    gradient: "red" as const,
  },
  {
    icon: TrendingUp,
    title: "Funding Connect",
    description: "Investor network",
    gradient: "yellow" as const,
  },
  {
    icon: GraduationCap,
    title: "Campus Programs",
    description: "Student innovation",
    gradient: "cyan" as const,
  },
  {
    icon: Building2,
    title: "Business Events",
    description: "Networking summits",
    gradient: "red" as const,
  },
  {
    icon: Briefcase,
    title: "Skill Development",
    description: "Advisory services",
    gradient: "yellow" as const,
  },
  {
    icon: Users,
    title: "Community",
    description: "Local entrepreneurs",
    gradient: "cyan" as const,
  },
];


const impactMetrics = [
  { end: 1000, suffix: "+", label: "Startups", icon: Rocket },
  { end: 1000, suffix: "+", label: "Network", icon: Users },
  { end: 100, suffix: "+", label: "Partners", icon: HandshakeIcon },
  { end: 100, prefix: "₹", suffix: "Cr", label: "Funding", icon: TrendingUp },
];

const upcomingEvents = [
  {
    title: "Kerala Startup Fest",
    date: "January 2025",
    description: "Two-day festival with 1000+ entrepreneurs, investors, and workshops.",
  },
  {
    title: "Founder Roundtable",
    date: "Coming Soon",
    description: "Closed-door networking for selected founders and leaders.",
  },
  {
    title: "Startup Boot Camp",
    date: "December 2024",
    description: "Residential camp for aspiring entrepreneurs.",
  },
];

const quickActions = [
  { label: "Register", href: "/register", icon: UserPlus, color: "bg-red-500" },
  { label: "Programs", href: "/programs", icon: Layers, color: "bg-yellow-500" },
  { label: "Partner", href: "/partners", icon: HandshakeIcon, color: "bg-cyan-500" },
];

function Layers(props: any) {
  return <Briefcase {...props} />;
}

export default function Home() {
  const programsQuery = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });
  
  // Create short descriptions for programs (first 30 chars or use a simple tagline)
  const getShortDesc = (title: string, desc: string | null) => {
    const shortDescMap: Record<string, string> = {
      "Startup Boot Camp": "3-day entrepreneurship experience",
      "Business Conclaves": "Connect with industry leaders",
      "Founder Circles": "Exclusive networking meets",
      "Advisory Clinics": "Expert mentoring sessions",
      "Campus Innovation Labs": "Student innovation hubs",
      "KEF Student Entrepreneurs Forum": "Young entrepreneur community",
      "Kerala Startup Fest": "Grand startup celebration",
    };
    return shortDescMap[title] || (desc ? desc.slice(0, 35) + "..." : "Explore more");
  };

  const signaturePrograms = programsQuery.data?.length 
    ? programsQuery.data.map(p => ({
        title: p.title,
        shortDesc: getShortDesc(p.title, p.description),
        icon: p.icon,
      }))
    : fallbackPrograms;
  
  return (
    <>
      {/* MOBILE HERO SECTION */}
      <section className="relative overflow-hidden min-h-[85vh] md:min-h-[700px] lg:min-h-[800px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600 animate-gradient-x bg-[length:200%_auto]" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        
        {/* Animated floating orbs */}
        <GlowingOrbs />
        <FloatingParticles count={30} />
        
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-10 md:right-20 w-16 md:w-32 h-16 md:h-32 border border-white/10 rotate-45"
          />
          <motion.div 
            initial={{ rotate: 45 }}
            animate={{ rotate: -315 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 left-5 md:left-20 w-12 md:w-24 h-12 md:h-24 border border-white/10"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="glass-panel text-white border-white/20 mb-4 md:mb-6 py-1 md:py-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Sparkles className="w-3 h-3 mr-1 md:mr-2" />
                  Kerala's Premier Startup Ecosystem
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 hero-text-shadow"
                data-testid="text-hero-headline"
              >
                Where Kerala's Entrepreneurs{" "}
                <span className="hero-highlight">Rise Together</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl mb-6 md:mb-8"
                data-testid="text-hero-subheadline"
              >
                A statewide non-profit movement empowering entrepreneurs, startups, and innovators to build, grow, and transform Kerala's economic future.
              </motion.p>

              {/* Mobile Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <MagneticButton strength={0.2}>
                  <Link href="/programs">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto btn-angular bg-yellow-400 text-black font-semibold shadow-lg shadow-yellow-500/30 text-sm md:text-base shimmer" 
                      data-testid="button-upcoming-programs"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Upcoming Programs
                    </Button>
                  </Link>
                </MagneticButton>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xs md:text-sm text-white/70 italic mt-4 md:mt-6 hidden sm:block"
                data-testid="text-hero-tagline"
              >
                Where ideas grow. Where founders rise. Where Kerala transforms.
              </motion.p>
            </motion.div>

            {/* Desktop Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              <StaggerContainer stagger={0.15} className="grid grid-cols-2 gap-4">
                {impactMetrics.map((metric, index) => (
                  <StaggerItem key={metric.label}>
                    <HoverScale scale={1.05}>
                      <div
                        className="glass-panel-strong rounded-xl p-6 text-center"
                        data-testid={`stat-card-${index}`}
                      >
                        <div className="text-3xl font-bold text-white mb-1">
                          <CountUp end={metric.end} prefix={metric.prefix || ""} suffix={metric.suffix} duration={2.5} />
                        </div>
                        <div className="text-sm text-white/70">{metric.label}</div>
                      </div>
                    </HoverScale>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MOBILE STATS SECTION - Beautiful horizontal scroll */}
      <section className="md:hidden py-6 bg-background">
        <div className="px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-[140px] snap-center"
              >
                <div className="stat-card-mobile rounded-2xl p-4 text-center mobile-card-shadow">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-cyan-500' :
                    index === 2 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    <metric.icon className={`w-5 h-5 ${index === 2 ? 'text-black' : 'text-white'}`} />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {metric.prefix}{metric.end}{metric.suffix}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{metric.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO - Mobile Grid */}
      <Section background="muted" className="mobile-section">
        <FadeInUp>
          <SectionHeader
            title="What We Do"
            description="Empowering Kerala's entrepreneurial community"
          />
        </FadeInUp>
        <StaggerContainer stagger={0.08} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {whatWeDo.map((item, index) => (
            <StaggerItem key={item.title}>
              <HoverScale scale={1.03}>
                <Card className="h-full overflow-visible">
                  <CardContent className="p-3 md:p-6 text-center">
                    <motion.div 
                      className={`w-10 h-10 md:w-14 md:h-14 mx-auto flex items-center justify-center mb-2 md:mb-4 rounded-xl md:rotate-45 ${
                        item.gradient === 'red' ? 'bg-red-500' :
                        item.gradient === 'yellow' ? 'bg-yellow-400' :
                        'bg-cyan-500'
                      }`}
                      whileHover={{ rotate: [45, 50, 45], scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className={`w-5 h-5 md:w-7 md:h-7 md:-rotate-45 ${item.gradient === 'yellow' ? 'text-black' : 'text-white'}`} />
                    </motion.div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base" data-testid={`text-whatwedo-${index}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* SIGNATURE PROGRAMS - Compact Cards */}
      <Section className="mobile-section">
        <FadeInUp>
          <SectionHeader
            title="Our Signature Programs"
          />
        </FadeInUp>
        
        {/* Mobile horizontal scroll - Compact */}
        <div className="md:hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {signaturePrograms.map((program, index) => {
              const IconComponent = iconMap[program.icon] || Rocket;
              return (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[180px] snap-center"
                >
                  <Card className="h-full mobile-card-shadow">
                    <CardContent className="p-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                        index % 3 === 0 ? 'bg-red-500' :
                        index % 3 === 1 ? 'bg-yellow-400' :
                        'bg-cyan-500'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${index % 3 === 1 ? 'text-black' : 'text-white'}`} />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1" data-testid={`text-program-title-${index}`}>
                        {program.title}
                      </h3>
                      <p className="text-xs text-muted-foreground" data-testid={`text-program-desc-${index}`}>
                        {program.shortDesc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Desktop Grid - Compact */}
        <StaggerContainer stagger={0.1} className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {signaturePrograms.map((program, index) => {
            const IconComponent = iconMap[program.icon] || Rocket;
            return (
              <StaggerItem key={program.title}>
                <HoverScale scale={1.03}>
                  <Card className="h-full overflow-visible">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        index % 3 === 0 ? 'bg-red-500' :
                        index % 3 === 1 ? 'bg-yellow-400' :
                        'bg-cyan-500'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${index % 3 === 1 ? 'text-black' : 'text-white'}`} />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-1" data-testid={`text-program-title-${index}`}>
                        {program.title}
                      </h3>
                      <p className="text-xs text-muted-foreground" data-testid={`text-program-desc-${index}`}>
                        {program.shortDesc}
                      </p>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
        
        <div className="mt-6 md:mt-8 text-center">
          <Link href="/programs">
            <Button className="btn-angular text-sm md:text-base" data-testid="button-view-all-programs">
              View All Programs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* IMPACT SECTION - Desktop Only (Mobile has horizontal scroll above) */}
      <Section background="muted" className="hidden md:block mobile-section">
        <FadeInUp>
          <SectionHeader
            title="Our Vision. Our Impact. Our Future."
          />
        </FadeInUp>
        <StaggerContainer stagger={0.15} className="grid grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => (
            <StaggerItem key={metric.label}>
              <HoverScale scale={1.1}>
                <div className="text-center">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-4 rotate-45 bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center"
                    whileHover={{ rotate: 50, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-2xl font-bold text-white -rotate-45">
                      <CountUp end={metric.end} prefix={metric.prefix || ""} suffix={metric.suffix} duration={2} />
                    </span>
                  </motion.div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* UPCOMING EVENTS */}
      <Section className="mobile-section">
        <FadeInUp>
          <SectionHeader
            title="Upcoming Events"
          />
        </FadeInUp>
        
        {/* Mobile List View */}
        <div className="space-y-3 md:hidden">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="mobile-card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-yellow-400' :
                      'bg-cyan-500'
                    }`}>
                      <Calendar className={`w-5 h-5 ${index === 1 ? 'text-black' : 'text-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm truncate" data-testid={`text-event-title-${index}`}>
                          {event.title}
                        </h3>
                        <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                          {event.date}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2" data-testid={`text-event-desc-${index}`}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Desktop Grid */}
        <StaggerContainer stagger={0.12} className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <StaggerItem key={event.title}>
              <HoverScale scale={1.03}>
                <Card className="h-full overflow-visible">
                  <CardContent className="p-6">
                    <motion.div 
                      className="w-12 h-12 rotate-45 bg-cyan-500 flex items-center justify-center mb-4"
                      whileHover={{ rotate: 50, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Calendar className="w-6 h-6 text-white -rotate-45" />
                    </motion.div>
                    <h3 className="font-semibold text-lg text-foreground mb-3" data-testid={`text-event-title-${index}`}>
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-event-desc-${index}`}>
                      {event.description}
                    </p>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
        
        <div className="mt-6 md:mt-8 text-center">
          <Link href="/programs">
            <Button className="btn-angular text-sm md:text-base" data-testid="button-explore-events">
              Explore All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* CALL TO ACTION */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-gradient-x bg-[length:200%_auto]" />
        <div className="absolute inset-0 geometric-dots" />
        <FloatingParticles count={20} />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Ready to Join the Movement?
            </motion.h2>
            <motion.p 
              className="text-sm md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Be part of Kerala's largest entrepreneurial community. Connect with founders, mentors, investors, and innovators.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MagneticButton strength={0.15}>
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto btn-angular bg-yellow-400 text-black font-semibold shadow-lg shadow-yellow-500/30 text-sm md:text-base shimmer" 
                    data-testid="button-cta-register"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <Link href="/partners">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto btn-angular glass-panel text-white text-sm md:text-base" 
                    data-testid="button-cta-partner"
                  >
                    Partner With Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Footer Info */}
      <section className="md:hidden py-8 px-4 bg-slate-900 text-white">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="KEF Logo" className="w-10 h-10 rounded-lg" />
            <div className="text-left">
              <div className="font-bold text-sm">Kerala Economic Forum</div>
              <div className="text-xs text-slate-400">Empowering Entrepreneurs</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            A statewide non-profit movement empowering entrepreneurs and innovators.
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/about">
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer">About</span>
            </Link>
            <Link href="/programs">
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer">Programs</span>
            </Link>
            <Link href="/contact">
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer">Contact</span>
            </Link>
          </div>
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Kerala Economic Forum. All rights reserved.
          </p>
        </div>
      </section>
    </>
  );
}
