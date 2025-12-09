import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download,
  ExternalLink,
  Newspaper,
  Podcast,
  Presentation,
  ArrowRight
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, SectionHeader, itemVariants } from "@/components/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const resourceCategories = [
  {
    icon: FileText,
    title: "Guides & Templates",
    description: "Business plan templates, pitch deck guides, and startup toolkits",
    count: 25,
    gradient: "purple" as const,
  },
  {
    icon: Video,
    title: "Video Resources",
    description: "Recorded webinars, tutorials, and expert interviews",
    count: 40,
    gradient: "blue" as const,
  },
  {
    icon: Podcast,
    title: "Podcasts",
    description: "Inspiring conversations with successful entrepreneurs",
    count: 30,
    gradient: "teal" as const,
  },
  {
    icon: Presentation,
    title: "Workshop Materials",
    description: "Presentations and materials from our training programs",
    count: 15,
    gradient: "orange" as const,
  },
];

const featuredResources = [
  {
    title: "Startup Business Plan Template",
    type: "Template",
    description: "Comprehensive business plan template with financial projections and market analysis sections.",
    downloads: "2.5k",
  },
  {
    title: "Pitch Deck Masterclass",
    type: "Video",
    description: "Learn how to create compelling pitch decks that attract investors and partners.",
    downloads: "1.8k",
  },
  {
    title: "Funding Options in Kerala",
    type: "Guide",
    description: "Complete guide to funding options available for startups in Kerala - grants, VCs, angels, and more.",
    downloads: "3.2k",
  },
  {
    title: "Legal Checklist for Startups",
    type: "Checklist",
    description: "Essential legal considerations and compliance requirements for new businesses in India.",
    downloads: "1.5k",
  },
  {
    title: "Marketing on a Budget",
    type: "Workshop",
    description: "Strategies and tactics for effective marketing with limited resources.",
    downloads: "2.1k",
  },
  {
    title: "Founder Stories - Season 1",
    type: "Podcast",
    description: "10-episode series featuring candid conversations with successful Kerala founders.",
    downloads: "4.5k",
  },
];

const externalResources = [
  {
    name: "Kerala Startup Mission",
    description: "Government nodal agency for entrepreneurship development",
    url: "#",
  },
  {
    name: "Startup India",
    description: "National portal for startup registration and benefits",
    url: "#",
  },
  {
    name: "DPIIT Recognition",
    description: "Department for Promotion of Industry and Internal Trade",
    url: "#",
  },
  {
    name: "SIDBI",
    description: "Small Industries Development Bank of India funding schemes",
    url: "#",
  },
];

const gradients = {
  purple: "from-purple-500 to-purple-600",
  blue: "from-blue-500 to-blue-600",
  teal: "from-teal-500 to-cyan-500",
  orange: "from-orange-500 to-red-500",
};

export default function Resources() {
  return (
    <>
      <Hero
        title="Resources"
        description="Access our library of guides, templates, videos, and tools to support your entrepreneurial journey."
        size="small"
        gradient="blue"
      />

      <Section>
        <SectionHeader
          subtitle="Resource Library"
          title="Everything You Need to Succeed"
          description="Curated resources to help you at every stage of your startup journey."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resourceCategories.map((category, index) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Card className="h-full hover-elevate cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradients[category.gradient]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <Badge variant="secondary">{category.count} Resources</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="muted">
        <SectionHeader
          subtitle="Featured Resources"
          title="Most Popular Downloads"
          description="Our most accessed resources to help you get started."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources.map((resource, index) => (
            <motion.div key={resource.title} variants={itemVariants}>
              <Card className="h-full hover-elevate group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant="outline">{resource.type}</Badge>
                    <span className="text-xs text-muted-foreground">{resource.downloads} downloads</span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button variant="ghost" className="p-0 h-auto font-medium text-primary">
                    <Download className="mr-1 w-4 h-4" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Button size="lg" data-testid="button-browse-all-resources">
            Browse All Resources
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </Section>

      <Section>
        <SectionHeader
          subtitle="External Resources"
          title="Useful Links"
          description="Important external resources for entrepreneurs and startups."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {externalResources.map((resource, index) => (
            <motion.div key={resource.name} variants={itemVariants}>
              <Card className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-1">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section background="gradient">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <CardContent className="relative z-10 py-12 px-6 lg:px-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-white/90 mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Let us know what resources would help you, and we'll work on adding them to our library.
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-semibold" data-testid="button-resources-suggest">
                  Suggest a Resource
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </Section>
    </>
  );
}
