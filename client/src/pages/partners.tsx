import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Building2, 
  GraduationCap, 
  Landmark, 
  Globe,
  Handshake,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const partnerCategories = [
  {
    icon: Landmark,
    title: "Government Partners",
    partners: [
      { name: "Kerala Startup Mission", type: "Nodal Agency" },
      { name: "KINFRA", type: "Infrastructure" },
      { name: "KSIDC", type: "Investment" },
      { name: "Industries Department", type: "Policy" },
    ],
  },
  {
    icon: Building2,
    title: "Corporate Partners",
    partners: [
      { name: "TCS", type: "Technology" },
      { name: "Infosys", type: "Technology" },
      { name: "UST Global", type: "Technology" },
      { name: "Federal Bank", type: "Banking" },
    ],
  },
  {
    icon: GraduationCap,
    title: "Academic Partners",
    partners: [
      { name: "IIM Kozhikode", type: "B-School" },
      { name: "NIT Calicut", type: "Technical" },
      { name: "CUSAT", type: "University" },
      { name: "Kerala University", type: "University" },
    ],
  },
  {
    icon: Globe,
    title: "Ecosystem Partners",
    partners: [
      { name: "NASSCOM", type: "Industry Body" },
      { name: "TiE Kerala", type: "Network" },
      { name: "CII Kerala", type: "Industry Body" },
      { name: "SIDBI", type: "Finance" },
    ],
  },
];

const partnershipBenefits = [
  "Access to a vibrant community of entrepreneurs and startups",
  "Brand visibility across KEF events and platforms",
  "Networking opportunities with ecosystem stakeholders",
  "Talent access for recruitment and collaboration",
  "CSR and innovation partnership opportunities",
  "Co-creation of programs and initiatives",
];

const partnershipTypes = [
  {
    title: "Strategic Partnership",
    description: "Long-term collaboration for ecosystem development and joint initiatives.",
    features: ["Multi-year commitment", "Joint program design", "Co-branded initiatives", "Board-level engagement"],
  },
  {
    title: "Event Sponsorship",
    description: "Support specific events and gain visibility among the startup community.",
    features: ["Event branding", "Speaking opportunities", "Networking access", "Startup connections"],
  },
  {
    title: "Program Partnership",
    description: "Collaborate on specific programs like accelerators, workshops, or competitions.",
    features: ["Program co-creation", "Mentorship roles", "Resource sharing", "Startup engagement"],
  },
  {
    title: "In-Kind Partnership",
    description: "Provide services or resources that benefit the startup ecosystem.",
    features: ["Service credits", "Infrastructure support", "Tool access", "Expert consultation"],
  },
];

export default function Partners() {
  return (
    <>
      <Hero
        title="Our Partners"
        description="Collaborating with leading organizations to build Kerala's entrepreneurial ecosystem."
        size="small"
        gradient="purple"
      />

      <Section>
        <SectionHeader
          subtitle="Partner Network"
          title="Powered by Collaboration"
          description="Our partners provide the support and resources that make our programs possible."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerCategories.map((category, index) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {category.partners.map((partner) => (
                      <div key={partner.name} className="p-4 rounded-lg bg-muted/50 hover-elevate">
                        <p className="font-medium text-foreground text-sm">{partner.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">{partner.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="Partnership Opportunities"
          title="Partner With Us"
          description="Join our network of partners supporting Kerala's startup ecosystem."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnershipTypes.map((type, index) => (
            <motion.div key={type.title} variants={itemVariants}>
              <Card className="h-full hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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
              Why Partner With KEF?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6">
              Benefits of Partnership
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Partnering with Kerala Economic Forum gives you access to one of Kerala's 
              most active entrepreneurial communities and positions your organization as 
              a supporter of innovation and economic development.
            </p>
            <ul className="space-y-3 mb-8">
              {partnershipBenefits.map((benefit, index) => (
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
            <Link href="/contact">
              <Button size="lg" data-testid="button-partners-explore">
                Explore Partnership
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center p-8">
              <div className="text-center">
                <Handshake className="w-20 h-20 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-bold text-foreground mb-2">100+ Partners</h3>
                <p className="text-muted-foreground">Across government, corporate, and academic sectors</p>
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
                Ready to Make an Impact?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Join our partner network and help build Kerala's entrepreneurial future.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-partners-contact">
                  <Handshake className="mr-2 w-4 h-4" />
                  Become a Partner
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
