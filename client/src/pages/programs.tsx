import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Rocket, 
  Users, 
  GraduationCap, 
  Building2,
  Lightbulb,
  Briefcase,
  Target,
  CheckCircle2,
  ArrowRight,
  Calendar
} from "lucide-react";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const advisoryAreas = [
  "Finance",
  "Branding", 
  "Marketing",
  "HR",
  "Operations",
  "Strategy",
  "Compliance"
];

const workshopTopics = [
  "Business Model Canvas",
  "Branding for Success",
  "Marketing on Zero Budget",
  "Pitching Skills",
  "Startup Mindset",
  "Leadership for Young Entrepreneurs"
];

export default function Programs() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 bg-red-500" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4"
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
            We offer a range of programs designed to empower entrepreneurs, students, businesses, and institutions. Each program is crafted to create real impact, practical learning, and meaningful opportunities.
          </motion.p>
        </div>
      </section>

      {/* A. STARTUP BOOT CAMP */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-bootcamp-title">
                    Startup Boot Camp — Transforming Mindsets
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-bootcamp-desc">
                  Both residential and Day camps where participants learn to think like entrepreneurs. The camp includes powerful workshops, business model creation, idea validation, field assignments, pitching sessions, and mentor interactions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground">Who can join:</p>
                    <p className="text-sm text-muted-foreground">Students, founders, aspirants</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground">Outcome:</p>
                    <p className="text-sm text-muted-foreground">Mindset → Idea → Action → Pitch</p>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Badge className="bg-yellow-300 text-black border-0">
                    Upcoming Camp: Dec 26-28, 2025
                  </Badge>
                  <Button data-testid="button-register-bootcamp">
                    Register Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* B. BUSINESS CONCLAVES */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-conclave-title">
                    Business Conclaves
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-conclave-desc">
                  Large-scale gatherings where founders, investors, mentors, thought leaders, and students connect and collaborate.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Purpose
                    </p>
                    <p className="text-sm text-muted-foreground pl-6">Connect the entrepreneurial ecosystem</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Who attends
                    </p>
                    <p className="text-sm text-muted-foreground pl-6">Founders, investors, students, mentors</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Format
                    </p>
                    <p className="text-sm text-muted-foreground pl-6">Keynotes, panels, networking, pitches</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500" /> Opportunities created
                    </p>
                    <p className="text-sm text-muted-foreground pl-6">Partnerships, funding, mentorship</p>
                  </div>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Badge className="bg-yellow-300 text-black border-0">
                    Upcoming: Dec 26-28, 2025
                  </Badge>
                  <Button data-testid="button-register-conclave">
                    Register Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* C. FOUNDER CIRCLES */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-yellow-400 flex items-center justify-center">
                    <Users className="w-7 h-7 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-founder-title">
                    Founder Circles
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-founder-desc">
                  Exclusive curated networking dinners and tea sessions bringing entrepreneurs and experts for honest conversations and opportunities.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* D. ADVISORY CLINICS */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500 flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-advisory-title">
                    Advisory Clinics
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-advisory-desc">
                  One-on-one mentoring and business advisory sessions in finance, branding, HR, legal, marketing, and operations.
                </p>
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Areas covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {advisoryAreas.map((area, index) => (
                      <Badge key={area} variant="secondary" data-testid={`badge-advisory-${index}`}>
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* F. CAMPUS INNOVATION LABS */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500 flex items-center justify-center">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-labs-title">
                    Campus Innovation Labs
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-labs-desc">
                  Building entrepreneurship clubs, innovation cells, startup labs, and student incubators in colleges across Kerala.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* G. KEF STUDENT ENTREPRENEURS FORUM */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-yellow-400 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-sef-title">
                    KEF Student Entrepreneurs Forum
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-sef-desc">
                  Vibrant club of student entrepreneurs and entrepreneurship aspirants.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* H. CAMPUS INITIATIVES */}
      <Section>
        <SectionHeader
          title="Campus Entrepreneurship Initiatives"
          description="We believe the next generation of Kerala's entrepreneurs is sitting in classrooms today. KEF supports colleges and institutions to build entrepreneurship culture inside campuses."
        />

        <div className="space-y-6">
          {/* Management Fest Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
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

          {/* Entrepreneurship Workshops */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
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

          {/* Campus Startup Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
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

          {/* Campus Incubation Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
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
