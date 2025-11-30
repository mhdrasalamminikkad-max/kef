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
  Briefcase,
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  UserPlus
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { IconCard } from "@/components/icon-card";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const whatWeDo = [
  {
    icon: Rocket,
    title: "Startup Support & Mentoring",
    gradient: "red" as const,
  },
  {
    icon: TrendingUp,
    title: "Funding & Investor Connect",
    gradient: "yellow" as const,
  },
  {
    icon: GraduationCap,
    title: "Campus Entrepreneurship Programs",
    gradient: "cyan" as const,
  },
  {
    icon: Building2,
    title: "Business Conclaves & Networking Summits",
    gradient: "red" as const,
  },
  {
    icon: Briefcase,
    title: "Advisory & Skill Development",
    gradient: "yellow" as const,
  },
  {
    icon: Users,
    title: "Local Entrepreneur Development",
    gradient: "cyan" as const,
  },
];

const signaturePrograms = [
  {
    title: "Startup Boot Camp",
    description: "Residential and day camps where participants learn to think like entrepreneurs through workshops, business model creation, and pitching sessions.",
  },
  {
    title: "Business Conclaves",
    description: "Large-scale gatherings where founders, investors, mentors, thought leaders, and students connect and collaborate.",
  },
  {
    title: "Founder Circle Meets",
    description: "Exclusive curated networking dinners and tea sessions bringing entrepreneurs and experts for honest conversations.",
  },
  {
    title: "Startup Advisory Clinics",
    description: "One-on-one mentoring and business advisory sessions in finance, branding, HR, legal, marketing, and operations.",
  },
  {
    title: "Campus Innovation Labs",
    description: "Building entrepreneurship clubs, innovation cells, startup labs, and student incubators in colleges across Kerala.",
  },
];

const impactMetrics = [
  { end: 1000, suffix: "+", label: "Startups to be supported" },
  { end: 1000, suffix: "+", label: "Entrepreneurs in our network" },
  { end: 100, suffix: "+", label: "Campus partnerships" },
  { end: 100, prefix: "₹", suffix: "+ Cr", label: "Funding enablement target" },
];

const upcomingEvents = [
  {
    title: "Kerala Startup Fest – January",
    description: "Two-day power-packed festival with 1000+ student entrepreneurs, investors, experts, workshops, and real-time pitch battles.",
  },
  {
    title: "KEF Founder Roundtable",
    description: "Closed-door networking session for selected founders and business leaders.",
  },
  {
    title: "Startup Boot Camp",
    description: "Residential Startup Camp for aspiring entrepreneurs.",
  },
];

export default function Home() {
  return (
    <>
      {/* SECTION 1 — HERO / TOP BANNER with Glassmorphism */}
      <section className="relative overflow-hidden min-h-[700px] lg:min-h-[800px] flex items-center">
        {/* Solid red base background for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600" />
        
        {/* Semi-transparent dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Geometric grid overlay */}
        <div className="absolute inset-0 geometric-grid" />
        
        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large geometric blurs */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl" />
          
          {/* Geometric shapes */}
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-32 h-32 border border-white/10 rotate-45"
          />
          <motion.div 
            initial={{ rotate: 45 }}
            animate={{ rotate: -315 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 left-20 w-24 h-24 border border-white/10"
          />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rotate-45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Kerala's Premier Startup Ecosystem
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-bold text-white leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 hero-text-shadow"
                data-testid="text-hero-headline"
              >
                Where Kerala's Entrepreneurs{" "}
                <span className="hero-highlight">Rise Together</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-xl mb-8"
                data-testid="text-hero-subheadline"
              >
                A statewide non-profit movement empowering entrepreneurs, startups, students, institutions, and innovators to build, grow, and transform Kerala's economic future.
              </motion.p>

              {/* Geometric Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold shadow-lg shadow-yellow-500/30" 
                    data-testid="button-register-now"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                </Link>
                <Link href="/programs">
                  <Button 
                    size="lg" 
                    className="btn-angular glass-panel text-white hover:bg-white/20" 
                    data-testid="button-explore-programs"
                  >
                    Explore Programs
                  </Button>
                </Link>
                <Link href="/partners">
                  <Button 
                    size="lg" 
                    className="btn-angular glass-panel text-white hover:bg-white/20" 
                    data-testid="button-partner-with-us"
                  >
                    Partner With Us
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-sm text-white/70 italic"
                data-testid="text-hero-tagline"
              >
                Where ideas grow. Where founders rise. Where Kerala transforms.
              </motion.p>
            </motion.div>

            {/* Right Side - Glass Cards with Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {impactMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="glass-panel-strong rounded-xl p-6 text-center"
                    data-testid={`stat-card-${index}`}
                  >
                    <div className="text-3xl font-bold text-white mb-1">
                      {metric.prefix}{metric.end}{metric.suffix}
                    </div>
                    <div className="text-sm text-white/70">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — QUICK INTRO with Glass Panel */}
      <Section>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6" data-testid="text-intro-title">
              Welcome to Kerala Economic Forum
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-intro-body-1">
              We bring together entrepreneurs, students, institutions, experts, investors, and thought leaders to create opportunities, build networks, and support new ideas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-intro-body-2">
              Our mission is to help Kerala become a leading hub for startups, innovation, and economic development.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about">
                <Button className="btn-angular" data-testid="button-learn-more">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/membership">
                <Button variant="outline" className="btn-angular" data-testid="button-join-now">
                  <UserPlus className="mr-2 w-4 h-4" />
                  Join Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 3 — WHAT WE FOCUS ON */}
      <Section background="muted">
        <SectionHeader
          title="What We Do"
          description="We empower Kerala's entrepreneurial community through:"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatWeDo.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate overflow-visible">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto flex items-center justify-center mb-4 rotate-45 ${
                    item.gradient === 'red' ? 'bg-red-500' :
                    item.gradient === 'yellow' ? 'bg-yellow-400' :
                    'bg-cyan-500'
                  }`}>
                    <item.icon className={`w-7 h-7 -rotate-45 ${item.gradient === 'yellow' ? 'text-black' : 'text-white'}`} />
                  </div>
                  <h3 className="font-semibold text-foreground" data-testid={`text-whatwedo-${index}`}>
                    {item.title}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 4 — SIGNATURE PROGRAMS */}
      <Section>
        <SectionHeader
          title="Our Signature Programs"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signaturePrograms.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate overflow-visible">
                <CardContent className="p-6">
                  <div className="w-2 h-12 bg-gradient-to-b from-red-500 via-yellow-400 to-cyan-500 mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-3" data-testid={`text-program-title-${index}`}>
                    {program.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-program-desc-${index}`}>
                    {program.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/programs">
            <Button className="btn-angular" data-testid="button-view-all-programs">
              View All Programs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* SECTION 5 — IMPACT HIGHLIGHTS (Mobile visible) */}
      <Section background="muted" className="lg:hidden">
        <SectionHeader
          title="Our Vision. Our Impact. Our Future."
        />
        <div className="grid grid-cols-2 gap-6">
          {impactMetrics.map((metric, index) => (
            <AnimatedCounter
              key={metric.label}
              end={metric.end}
              suffix={metric.suffix}
              prefix={metric.prefix}
              label={metric.label}
            />
          ))}
        </div>
      </Section>

      {/* Desktop Impact Section with different style */}
      <Section background="muted" className="hidden lg:block">
        <SectionHeader
          title="Our Vision. Our Impact. Our Future."
        />
        <div className="grid grid-cols-4 gap-8">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rotate-45 bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white -rotate-45">
                  {metric.prefix}{metric.end}{metric.suffix}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 6 — UPCOMING EVENTS */}
      <Section>
        <SectionHeader
          title="Upcoming Events"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate overflow-visible">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rotate-45 bg-cyan-500 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white -rotate-45" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-3" data-testid={`text-event-title-${index}`}>
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid={`text-event-desc-${index}`}>
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/programs">
            <Button className="btn-angular" data-testid="button-explore-events">
              Explore All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* SECTION 7 — CALL TO ACTION */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-500" />
        <div className="absolute inset-0 geometric-dots" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Join the Movement?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of Kerala's largest entrepreneurial community. Register now and connect with founders, mentors, investors, and innovators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold shadow-lg" 
                  data-testid="button-cta-register"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register Now
                </Button>
              </Link>
              <Link href="/partners">
                <Button 
                  size="lg" 
                  className="btn-angular glass-panel text-white hover:bg-white/20" 
                  data-testid="button-cta-partner"
                >
                  Partner With Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
