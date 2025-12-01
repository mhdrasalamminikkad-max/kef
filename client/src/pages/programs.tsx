import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  Building2,
  Lightbulb,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Sparkles,
  X,
  MapPin,
  Clock,
  UserCheck,
  Target,
  LucideIcon
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Program {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  iconBg: string;
  description: string;
  whoCanJoin?: string;
  outcome?: string;
  upcomingDate?: string;
  venue?: string;
  duration?: string;
  features?: string[];
  hasRegistration?: boolean;
  posterPlaceholder?: string;
}

const programs: Program[] = [
  {
    id: "bootcamp",
    title: "Startup Boot Camp — Transforming Mindsets",
    shortTitle: "Startup Boot Camp",
    icon: Rocket,
    iconBg: "bg-red-500",
    description: "Both residential and Day camps where participants learn to think like entrepreneurs. The camp includes powerful workshops, business model creation, idea validation, field assignments, pitching sessions, and mentor interactions.",
    whoCanJoin: "Students, founders, aspirants",
    outcome: "Mindset, Idea, Action, Pitch",
    upcomingDate: "Dec 26-28, 2025",
    venue: "Caliph Life School, Kozhikode",
    duration: "3 Days Residential",
    hasRegistration: true,
    posterPlaceholder: "STARTUP BOOT CAMP"
  },
  {
    id: "conclave",
    title: "Business Conclaves",
    shortTitle: "Business Conclaves",
    icon: Building2,
    iconBg: "bg-cyan-500",
    description: "Large-scale gatherings where founders, investors, mentors, thought leaders, and students connect and collaborate.",
    whoCanJoin: "Founders, investors, students, mentors",
    outcome: "Partnerships, funding, mentorship",
    features: ["Keynotes & panels", "Networking sessions", "Pitch competitions", "Expert interactions"],
    upcomingDate: "Dec 26-28, 2025",
    hasRegistration: true,
    posterPlaceholder: "BUSINESS CONCLAVE"
  },
  {
    id: "founder-circles",
    title: "Founder Circles",
    shortTitle: "Founder Circles",
    icon: Users,
    iconBg: "bg-yellow-400",
    description: "Exclusive curated networking dinners and tea sessions bringing entrepreneurs and experts for honest conversations and opportunities.",
    whoCanJoin: "Entrepreneurs, business owners, startup founders",
    outcome: "Network expansion, mentorship connections, business opportunities",
    hasRegistration: false,
    posterPlaceholder: "FOUNDER CIRCLES"
  },
  {
    id: "advisory",
    title: "Advisory Clinics",
    shortTitle: "Advisory Clinics",
    icon: Briefcase,
    iconBg: "bg-cyan-500",
    description: "One-on-one mentoring and business advisory sessions in finance, branding, HR, legal, marketing, and operations.",
    features: ["Finance", "Branding", "Marketing", "HR", "Operations", "Strategy", "Compliance"],
    whoCanJoin: "Startups, small businesses, entrepreneurs",
    outcome: "Expert guidance, problem-solving, strategic direction",
    hasRegistration: false,
    posterPlaceholder: "ADVISORY CLINICS"
  },
  {
    id: "innovation-labs",
    title: "Campus Innovation Labs",
    shortTitle: "Campus Innovation Labs",
    icon: Lightbulb,
    iconBg: "bg-cyan-500",
    description: "Building entrepreneurship clubs, innovation cells, startup labs, and student incubators in colleges across Kerala.",
    whoCanJoin: "Colleges, universities, educational institutions",
    outcome: "Innovation ecosystem, student startups, entrepreneurial culture",
    hasRegistration: false,
    posterPlaceholder: "INNOVATION LABS"
  },
  {
    id: "student-forum",
    title: "KEF Student Entrepreneurs Forum",
    shortTitle: "Student Entrepreneurs Forum",
    icon: GraduationCap,
    iconBg: "bg-yellow-400",
    description: "Vibrant club of student entrepreneurs and entrepreneurship aspirants.",
    whoCanJoin: "Students aged 15-30",
    outcome: "Community, learning, startup opportunities",
    hasRegistration: true,
    posterPlaceholder: "STUDENT FORUM"
  },
];

const workshopTopics = [
  "Business Model Canvas",
  "Branding for Success",
  "Marketing on Zero Budget",
  "Pitching Skills",
  "Startup Mindset",
  "Leadership for Young Entrepreneurs"
];

function ProgramModal({ 
  program, 
  open, 
  onClose 
}: { 
  program: Program | null; 
  open: boolean; 
  onClose: () => void;
}) {
  if (!program) return null;
  
  const IconComponent = program.icon;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative h-48 bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 geometric-grid opacity-30" />
            <div className="relative z-10 text-center">
              <div className={`w-16 h-16 ${program.iconBg} rotate-45 mx-auto mb-4 flex items-center justify-center`}>
                <IconComponent className="w-8 h-8 text-white -rotate-45" />
              </div>
              <h2 className="text-2xl font-bold text-white px-4">{program.shortTitle}</h2>
            </div>
          </div>
          
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-foreground">
                {program.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground leading-relaxed mt-2">
                {program.description}
              </DialogDescription>
            </DialogHeader>
            
            {program.upcomingDate && (
              <div className="mb-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming: {program.upcomingDate}</span>
                </div>
                {program.venue && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{program.venue}</span>
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {program.whoCanJoin && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-cyan-500" />
                    <p className="text-sm font-medium text-foreground">Who can join</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{program.whoCanJoin}</p>
                </div>
              )}
              {program.outcome && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-medium text-foreground">Outcome</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{program.outcome}</p>
                </div>
              )}
            </div>
            
            {program.features && program.features.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  {program.id === "advisory" ? "Areas covered:" : "What's included:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {program.features.map((feature, i) => (
                    <Badge key={i} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {program.hasRegistration && (
              <Link href="/register">
                <Button className="w-full btn-angular" data-testid={`button-register-${program.id}`}>
                  Register Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ProgramCard({ 
  program, 
  index, 
  onClick 
}: { 
  program: Program; 
  index: number; 
  onClick: () => void;
}) {
  const IconComponent = program.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card 
        className="overflow-visible cursor-pointer hover-elevate active-elevate-2 h-full"
        onClick={onClick}
        data-testid={`card-program-${program.id}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${program.iconBg} rotate-45 flex-shrink-0 flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 -rotate-45 ${program.iconBg === 'bg-yellow-400' ? 'text-black' : 'text-white'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground mb-2">
                {program.shortTitle}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {program.description}
              </p>
              {program.upcomingDate && (
                <Badge className="bg-yellow-400 text-black border-0 mb-3">
                  {program.upcomingDate}
                </Badge>
              )}
              <Button variant="ghost" className="p-0 h-auto font-medium text-red-500 hover:text-red-600">
                View Details
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (program: Program) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProgram(null);
  };

  return (
    <>
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600" />
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
              Learn & Grow
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4 hero-text-shadow"
            data-testid="text-programs-title"
          >
            Our Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-white/90 max-w-3xl mx-auto"
            data-testid="text-programs-intro"
          >
            We offer a range of programs designed to empower entrepreneurs, students, businesses, and institutions. Click on any program to learn more.
          </motion.p>
        </div>
      </section>

      <Section>
        <SectionHeader
          title="Explore Our Programs"
          description="Each program is crafted to create real impact, practical learning, and meaningful opportunities."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <ProgramCard
              key={program.id}
              program={program}
              index={index}
              onClick={() => openModal(program)}
            />
          ))}
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          title="Campus Entrepreneurship Initiatives"
          description="We believe the next generation of Kerala's entrepreneurs is sitting in classrooms today. KEF supports colleges and institutions to build entrepreneurship culture inside campuses."
        />

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="text-fest-title">
                  Management Fest Support
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["Judging", "Event and games rounds planning", "Sponsorship", "Expert lectures", "Workshop modules", "How colleges can invite KEF"].map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="text-workshops-title">
                  Entrepreneurship Workshops
                </h3>
                <div className="flex flex-wrap gap-2">
                  {workshopTopics.map((topic, i) => (
                    <Badge key={topic} variant="secondary" data-testid={`badge-workshop-${i}`}>
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="text-challenges-title">
                  Campus Startup Challenges
                </h3>
                <p className="text-muted-foreground" data-testid="text-challenges-desc">
                  Competitions designed to identify, nurture, and support student entrepreneurs with real business potential.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4" data-testid="text-incubation-title">
                  Campus Incubation Support
                </h3>
                <p className="text-muted-foreground mb-4">KEF helps build:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Startup labs", "Innovation cells", "Mini incubators", "Entrepreneurship clubs"].map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <ProgramModal
        program={selectedProgram}
        open={modalOpen}
        onClose={closeModal}
      />
    </>
  );
}
