import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  GraduationCap, 
  Users, 
  Lightbulb, 
  Award,
  BookOpen,
  Presentation,
  Trophy,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Star
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { IconCard } from "@/components/icon-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const campusPrograms = [
  {
    icon: Users,
    title: "Campus Ambassador Program",
    description: "Empowering students to become entrepreneurship advocates and event organizers in their institutions.",
    gradient: "purple" as const,
  },
  {
    icon: Lightbulb,
    title: "Innovation Clubs",
    description: "Establishing and supporting student-led innovation clubs across colleges and universities.",
    gradient: "blue" as const,
  },
  {
    icon: Presentation,
    title: "Entrepreneurship Workshops",
    description: "Regular workshops and bootcamps conducted in educational institutions on startup fundamentals.",
    gradient: "teal" as const,
  },
  {
    icon: Trophy,
    title: "Startup Competitions",
    description: "Inter-college competitions to identify and nurture promising student entrepreneurs.",
    gradient: "orange" as const,
  },
];

const ambassadorBenefits = [
  "Official KEF Campus Ambassador certification",
  "Direct mentorship from industry leaders",
  "Priority access to KEF events and programs",
  "Networking with the startup ecosystem",
  "Internship and job opportunities",
  "Letters of recommendation for higher studies",
  "Leadership and organizational experience",
  "Access to exclusive resources and training",
];

const upcomingCampusEvents = [
  {
    title: "Startup Weekend - College Edition",
    date: "January 2025",
    venue: "Multiple Campuses",
    type: "Competition",
  },
  {
    title: "Innovation Talk Series",
    date: "Ongoing",
    venue: "Virtual",
    type: "Webinar",
  },
  {
    title: "Campus Ambassador Bootcamp",
    date: "February 2025",
    venue: "Kochi",
    type: "Training",
  },
  {
    title: "Inter-College Hackathon",
    date: "March 2025",
    venue: "Technopark",
    type: "Hackathon",
  },
];

const partnerInstitutions = [
  "IIM Kozhikode",
  "NIT Calicut",
  "CUSAT",
  "Kerala University",
  "MG University",
  "Calicut University",
  "IIST Thiruvananthapuram",
  "College of Engineering Trivandrum",
];

export default function CampusInitiatives() {
  return (
    <>
      <Hero
        title="Campus Initiatives"
        description="Fostering entrepreneurship culture in educational institutions and empowering the next generation of innovators."
        size="small"
        gradient="blue"
      />

      <Section>
        <SectionHeader
          subtitle="Our Programs"
          title="Building Tomorrow's Entrepreneurs Today"
          description="Comprehensive initiatives designed to nurture entrepreneurial mindset among students."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {campusPrograms.map((program, index) => (
            <IconCard
              key={program.title}
              icon={program.icon}
              title={program.title}
              description={program.description}
              gradient={program.gradient}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section background="muted">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Campus Ambassador Program
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Become a Change Agent
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The KEF Campus Ambassador Program is our flagship student initiative designed to 
              identify and empower passionate students who can drive entrepreneurship culture 
              in their institutions. As a Campus Ambassador, you'll be the bridge between KEF 
              and your college community.
            </p>
            <h3 className="text-xl font-semibold text-foreground mb-4">What You'll Get</h3>
            <ul className="space-y-3 mb-8">
              {ambassadorBenefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <Star className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
            <Link href="/membership">
              <Button size="lg" data-testid="button-campus-apply">
                Apply as Campus Ambassador
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-foreground">Upcoming Campus Events</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingCampusEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <Badge variant="secondary" className="shrink-0">{event.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                      <p className="text-sm text-muted-foreground">{event.venue}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          subtitle="Partner Institutions"
          title="Our Campus Network"
          description="We work with leading educational institutions across Kerala to promote entrepreneurship."
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partnerInstitutions.map((institution, index) => (
            <motion.div 
              key={institution}
              variants={itemVariants}
              className="p-6 rounded-xl bg-muted/50 text-center hover-elevate"
            >
              <GraduationCap className="w-8 h-8 mx-auto mb-3 text-purple-500" />
              <span className="text-sm font-medium text-foreground">{institution}</span>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={itemVariants} className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want your institution to join our network?
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg" data-testid="button-campus-partner">
              Partner With Us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </Section>

      <Section background="gradient">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12 text-center">
              <GraduationCap className="w-16 h-16 mx-auto text-white/90 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Start Your Entrepreneurial Journey Today
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Whether you're a student with a startup idea or a faculty member looking to 
                promote innovation, we have something for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/membership">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-campus-join">
                    <Award className="mr-2 w-4 h-4" />
                    Join as Student
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold" data-testid="button-campus-contact">
                    Contact for Partnerships
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
