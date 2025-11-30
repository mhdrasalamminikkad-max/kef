import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award,
  Lightbulb,
  Globe,
  ArrowRight
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { IconCard } from "@/components/icon-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Fostering creative thinking and breakthrough solutions that drive progress and transformation.",
    gradient: "purple" as const,
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Building partnerships and networks that amplify collective impact and shared success.",
    gradient: "blue" as const,
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Operating with transparency, ethics, and accountability in all our endeavors.",
    gradient: "teal" as const,
  },
  {
    icon: Globe,
    title: "Inclusivity",
    description: "Ensuring equal opportunities for all entrepreneurs regardless of background or location.",
    gradient: "orange" as const,
  },
];

const milestones = [
  { year: "2018", title: "Foundation", description: "KEF was established with a vision to transform Kerala's economic landscape." },
  { year: "2019", title: "First Summit", description: "Organized the inaugural Kerala Startup Summit with 500+ participants." },
  { year: "2020", title: "Digital Pivot", description: "Launched virtual programs during the pandemic, reaching 5000+ entrepreneurs." },
  { year: "2021", title: "District Expansion", description: "Established presence in all 14 districts of Kerala." },
  { year: "2022", title: "KSUM Partnership", description: "Formalized partnership with Kerala Startup Mission for ecosystem development." },
  { year: "2023", title: "Campus Network", description: "Launched Campus Ambassador Program in 50+ institutions." },
  { year: "2024", title: "10,000 Strong", description: "Community crossed 10,000 members milestone." },
];

const teamMembers = [
  { name: "Dr. Priya Menon", role: "Chairperson", bio: "Former Tech CEO with 20+ years of experience in entrepreneurship" },
  { name: "Rahul Krishnan", role: "Executive Director", bio: "Startup ecosystem builder and policy advocate" },
  { name: "Anitha Nair", role: "Director - Programs", bio: "Innovation specialist with focus on women entrepreneurship" },
  { name: "Vijay Thomas", role: "Director - Partnerships", bio: "Corporate relations expert with extensive industry network" },
];

export default function About() {
  return (
    <>
      <Hero
        title="About Kerala Economic Forum"
        description="A dynamic platform dedicated to fostering entrepreneurship, supporting startups, and driving sustainable economic growth across Kerala."
        size="small"
        gradient="blue"
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Transforming Kerala's Economic Landscape
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Kerala Economic Forum (KEF) was founded in 2018 with a bold vision: to transform Kerala 
                into a global hub for innovation and entrepreneurship. What started as a small group of 
                passionate individuals has grown into one of the state's most influential platforms for 
                economic development.
              </p>
              <p>
                We believe that entrepreneurship is the key to sustainable economic growth. By nurturing 
                innovative ideas, connecting entrepreneurs with resources, and creating a supportive 
                ecosystem, we aim to unlock Kerala's tremendous potential.
              </p>
              <p>
                Today, KEF brings together a diverse community of entrepreneurs, investors, policymakers, 
                academicians, and industry leaders who share a common goal: building a prosperous and 
                innovative Kerala.
              </p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">K</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Kerala Economic Forum</h3>
                  <p className="text-muted-foreground mt-2">Empowering Entrepreneurs Since 2018</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl opacity-20 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </Section>

      <Section background="muted" id="vision">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To establish Kerala as a globally recognized hub for innovation and entrepreneurship, 
                  where every aspiring entrepreneur has access to the resources, mentorship, and support 
                  needed to transform their ideas into successful ventures that contribute to sustainable 
                  economic growth.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To create a vibrant entrepreneurial ecosystem by connecting stakeholders, facilitating 
                  knowledge sharing, providing comprehensive support to startups, and advocating for 
                  policies that foster innovation and economic development across all regions of Kerala.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          subtitle="Our Values"
          title="Principles That Guide Us"
          description="These core values shape everything we do and how we work with our community."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <IconCard
              key={value.title}
              icon={value.icon}
              title={value.title}
              description={value.description}
              gradient={value.gradient}
              index={index}
            />
          ))}
        </div>
      </Section>

      <Section background="gradient">
        <SectionHeader
          subtitle="Our Journey"
          title="Milestones & Achievements"
          description="A timeline of our growth and impact over the years."
        />
        
        <div className="relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-0.5" />
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                variants={itemVariants}
                className={`relative flex flex-col lg:flex-row gap-4 lg:gap-8 ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="lg:w-1/2" />
                <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1.5 lg:-translate-x-2 mt-1" />
                <div className="lg:w-1/2 pl-12 lg:pl-0">
                  <Card>
                    <CardContent className="p-6">
                      <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                      <h3 className="text-lg font-semibold text-foreground mt-1">{milestone.title}</h3>
                      <p className="text-muted-foreground mt-2">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="team">
        <SectionHeader
          subtitle="Leadership Team"
          title="The People Behind KEF"
          description="Meet the dedicated individuals driving our mission forward."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
            >
              <Card className="h-full hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                    <Users className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-3">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="muted">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Want to Be Part of Our Story?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join our growing community and contribute to Kerala's entrepreneurial transformation.
              </p>
              <Link href="/membership">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-about-join">
                  <Award className="mr-2 w-4 h-4" />
                  Join KEF Today
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
