import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Target, 
  Eye, 
  Lightbulb,
  Users,
  Rocket,
  GraduationCap,
  Calendar,
  Briefcase,
  TrendingUp,
  Building2,
  HandshakeIcon,
  Globe,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Floating3DShapes } from "@/components/animations";

const coreObjectives = [
  {
    number: "1",
    title: "Create a Statewide Entrepreneur Network",
    points: [
      "Bring together entrepreneurs, founders, business owners, and investors into one community",
      "Facilitate collaborations, partnerships, and mutual business support",
      "Build Kerala's largest business networking circle"
    ]
  },
  {
    number: "2",
    title: "Empower Startups at Every Stage",
    points: ["Idea validation", "Prototype building", "Market entry", "Scaling", "Investor readiness"]
  },
  {
    number: "3",
    title: "Strengthen Student Entrepreneurship",
    points: ["College workshops", "Entrepreneurship clubs", "Innovation challenges", "Boot camps", "Real business exposure"]
  },
  {
    number: "4",
    title: "Conduct High-Impact Events & Conclaves",
    points: ["State-level business conclaves", "District-level networking meets", "Sector-based roundtables", "Startup festivals", "Leadership summits"]
  },
  {
    number: "5",
    title: "Offer Expert Business Advisory",
    points: ["Business planning", "Financial modelling", "Branding strategies", "Market research", "Legal structuring and compliance"]
  },
  {
    number: "6",
    title: "Bridge Entrepreneurs and Investors",
    points: ["Angel investment opportunities", "Pitch days", "Connect with VCs and investor circles", "Investment-readiness mentoring"]
  },
  {
    number: "7",
    title: "Industry–Academia Integration",
    points: [
      "Partner with schools, colleges, and universities",
      "Help institutions run entrepreneurship programs",
      "Train commerce/management faculty to enhance startup coaching",
      "Support management fests with judges, speakers, and workshops",
      "KEF mentor visits for idea guidance",
      "Industry insights for BBA, B.Com, MBA students",
      "Workshops on business model creation, finance, branding, HR, marketing"
    ]
  },
  {
    number: "8",
    title: "Promote Kerala's Local Entrepreneurs",
    points: ["Support village-based and district-based talents", "Marketing and branding assistance", "Digital transformation programs"]
  },
  {
    number: "9",
    title: "Build a Culture of Mutual Growth",
    points: ["Member-to-member discounts", "Joint ventures", "Knowledge sharing", "Talent exchange"]
  },
  {
    number: "10",
    title: "Support Management Fests & Business Competitions",
    points: [
      "Provide expert judges",
      "Sponsor event categories",
      "Offer prize funding / certifications",
      "Prepare rounds",
      "Conduct masterclasses and keynote sessions",
      "Help colleges design high-quality events",
      "Bring industry leaders as speakers"
    ]
  },
  {
    number: "11",
    title: "Campus-to-Market Pathways",
    points: ["Validate their ideas", "Find early customers", "Build prototypes", "Prepare pitch decks", "Connect with real investors"]
  },
  {
    number: "12",
    title: "Internship & Industry Exposure Programs",
    points: ["Internships at startups", "Real-life business assignments", "Market research projects", "Work with SMEs across Kerala"]
  }
];

const whyKeralaNeeds = [
  "Kerala's youth talent",
  "Lack of unified ecosystem",
  "Difficulty accessing investors",
  "Campus ideas not converting to startups",
  "Need for networks and mentoring",
  "Economic upliftment potential"
];

const leaders = [
  { name: "Founder / Board", role: "Leadership", bio: "Leading Kerala Economic Forum's vision to transform the state's entrepreneurial landscape." },
  { name: "Advisors", role: "Advisory Board", bio: "Industry experts providing strategic guidance and mentorship to the community." },
  { name: "Mentors", role: "Mentor Network", bio: "Experienced entrepreneurs and professionals supporting the next generation." },
];

export default function About() {
  return (
    <>
      {/* SECTION 1 — WHO WE ARE - Glassmorphism Hero */}
      <section className="relative overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-[450px] flex items-center">
        <div className="absolute inset-0 hero-gradient-animated" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <Floating3DShapes />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-12 md:w-20 h-12 md:h-20 border border-white/10 rotate-45" />
          <div className="absolute bottom-20 left-10 w-10 md:w-16 h-10 md:h-16 border border-white/10 rotate-12" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Our Story
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl hero-text-shadow"
            data-testid="text-about-title"
          >
            About Kerala Economic Forum
          </motion.h1>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-4" data-testid="text-about-body-1">
              Kerala Economic Forum (KEF) is a non-profit movement formed with a single mission: to uplift Kerala's entrepreneurial landscape by building a powerful, interconnected ecosystem where entrepreneurs, students, professionals, institutions, and investors can grow together.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-body-2">
              We exist to help Kerala move forward—economically, socially, and technologically—through innovation, entrepreneurship, collaboration, and opportunities for all.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 2 — OUR VISION */}
      <Section background="muted">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rotate-45 bg-red-500 flex items-center justify-center">
                    <Eye className="w-7 h-7 text-white -rotate-45" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-vision-title">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-vision-body">
                  To build Kerala as a globally recognised entrepreneurial state by supporting, nurturing, and scaling new-age startups and business leaders, while creating an interconnected network of founders, institutions, investors, and innovators.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 3 — OUR MISSION */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-visible">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rotate-45 bg-cyan-500 flex items-center justify-center">
                    <Target className="w-7 h-7 text-white -rotate-45" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-mission-title">Our Mission</h2>
                </div>
                <ul className="space-y-4 text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-3" data-testid="text-mission-1">
                    <div className="w-6 h-6 rotate-45 bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 -rotate-45" />
                    </div>
                    <span>To equip individuals and institutions with the skills, support, networks, and opportunities needed to build sustainable businesses.</span>
                  </li>
                  <li className="flex items-start gap-3" data-testid="text-mission-2">
                    <div className="w-6 h-6 rotate-45 bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 -rotate-45" />
                    </div>
                    <span>To bridge the gap between students, ideas, businesses, growth, and investors.</span>
                  </li>
                  <li className="flex items-start gap-3" data-testid="text-mission-3">
                    <div className="w-6 h-6 rotate-45 bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 -rotate-45" />
                    </div>
                    <span>To become Kerala's most trusted platform for entrepreneurial guidance, collaborations, and economic upliftment.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* SECTION 4 — CORE OBJECTIVES */}
      <Section background="muted">
        <SectionHeader title="Core Objectives" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreObjectives.map((objective, index) => (
            <motion.div
              key={objective.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="h-full overflow-visible">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rotate-45 bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm -rotate-45">{objective.number}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-3" data-testid={`text-objective-title-${index}`}>
                        {objective.title}
                      </h3>
                      <ul className="space-y-1">
                        {objective.points.map((point, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 5 — WHY KERALA NEEDS KEF */}
      <Section>
        <SectionHeader title="Why Kerala Needs KEF" />
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyKeralaNeeds.map((reason, index) => (
              <motion.div
                key={reason}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate overflow-visible">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rotate-45 bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-red-500 -rotate-45" />
                    </div>
                    <span className="text-foreground font-medium" data-testid={`text-why-${index}`}>{reason}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SECTION 6 — LEADERS OF KEF */}
      <Section background="muted">
        <SectionHeader title="Leaders of KEF" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover-elevate overflow-visible">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto rotate-45 bg-cyan-500 flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-white -rotate-45" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-1" data-testid={`text-leader-name-${index}`}>
                    {leader.name}
                  </h3>
                  <p className="text-sm text-primary mb-3">{leader.role}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-leader-bio-${index}`}>
                    {leader.bio}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 hero-text-shadow">
              Join the Movement
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of Kerala's entrepreneurial transformation. Connect with founders, mentors, and innovators.
            </p>
            <Link href="/membership">
              <Button 
                size="lg" 
                className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold shadow-lg" 
                data-testid="button-cta-join"
              >
                Become a Member
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
