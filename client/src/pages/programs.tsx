import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  Building2,
  Lightbulb,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
  LucideIcon,
  Play,
  Clock,
  History
} from "lucide-react";
import { Section, SectionHeader } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Program } from "@shared/schema";

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
};

const gradientBgMap: Record<string, string> = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
};

const workshopTopics = [
  "Business Model Canvas",
  "Branding for Success",
  "Marketing on Zero Budget",
  "Pitching Skills",
  "Startup Mindset",
  "Leadership for Young Entrepreneurs"
];

const statusConfig = {
  live: { 
    label: "Live Now", 
    bgClass: "bg-green-500/20", 
    textClass: "text-green-600 dark:text-green-400",
    icon: Play
  },
  upcoming: { 
    label: "Upcoming", 
    bgClass: "bg-blue-500/20", 
    textClass: "text-blue-600 dark:text-blue-400",
    icon: Clock
  },
  past: { 
    label: "Completed", 
    bgClass: "bg-gray-500/20", 
    textClass: "text-gray-600 dark:text-gray-400",
    icon: History
  },
};

function ProgramCard({ 
  program, 
  index
}: { 
  program: Program; 
  index: number;
}) {
  const IconComponent = iconMap[program.icon] || Rocket;
  const iconBgClass = gradientBgMap[program.gradient] || gradientBgMap.purple;
  const status = statusConfig[program.programStatus as keyof typeof statusConfig] || statusConfig.upcoming;
  const StatusIcon = status.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
    >
      <Link href={`/programs/${program.id}`}>
        <Card 
          className="overflow-visible cursor-pointer hover-elevate active-elevate-2"
          data-testid={`card-program-${program.id}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${iconBgClass} rotate-45 flex-shrink-0 flex items-center justify-center`}>
                <IconComponent className={`w-5 h-5 -rotate-45 ${program.gradient === 'orange' ? 'text-black' : 'text-white'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {program.title}
                </h3>
              </div>
              <Badge className={`${status.bgClass} ${status.textClass} border-0 flex-shrink-0`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Programs() {
  const { data: programsList, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const livePrograms = programsList?.filter(p => p.programStatus === 'live') || [];
  const upcomingPrograms = programsList?.filter(p => p.programStatus === 'upcoming') || [];
  const pastPrograms = programsList?.filter(p => p.programStatus === 'past') || [];

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

      {isLoading ? (
        <Section>
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </Section>
      ) : (
        <>
          {/* LIVE PROGRAMS */}
          {livePrograms.length > 0 && (
            <Section>
              <SectionHeader
                title="Live Programs"
                subtitle="Currently running programs - Register now!"
              />
              <div className="space-y-3">
                {livePrograms.map((program, index) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    index={index}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* UPCOMING PROGRAMS */}
          {upcomingPrograms.length > 0 && (
            <Section background={livePrograms.length > 0 ? "muted" : undefined}>
              <SectionHeader
                title="Upcoming Programs"
                subtitle="Stay tuned for these exciting programs coming soon"
              />
              <div className="space-y-3">
                {upcomingPrograms.map((program, index) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    index={index}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* PAST PROGRAMS */}
          {pastPrograms.length > 0 && (
            <Section background={(livePrograms.length > 0 && upcomingPrograms.length === 0) || (livePrograms.length === 0 && upcomingPrograms.length > 0) ? "muted" : undefined}>
              <SectionHeader
                title="Past Programs"
                subtitle="Completed programs that made an impact"
              />
              <div className="space-y-3">
                {pastPrograms.map((program, index) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    index={index}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* No programs message */}
          {livePrograms.length === 0 && upcomingPrograms.length === 0 && pastPrograms.length === 0 && (
            <Section>
              <div className="text-center py-12 text-muted-foreground">
                No programs available at the moment. Check back soon!
              </div>
            </Section>
          )}
        </>
      )}

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
    </>
  );
}
