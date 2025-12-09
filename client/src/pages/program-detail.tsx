import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Target,
  ArrowRight,
  Sparkles,
  Loader2,
  Rocket,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
  LucideIcon,
  Tag,
  Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Program } from "@shared/schema";

const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Lightbulb,
};

const gradientMap: Record<string, string> = {
  purple: "from-purple-600 via-purple-500 to-purple-600",
  blue: "from-blue-600 via-blue-500 to-blue-600",
  teal: "from-teal-600 via-teal-500 to-teal-600",
  orange: "from-orange-600 via-orange-500 to-orange-600",
};

const iconBgMap: Record<string, string> = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
};

export default function ProgramDetail() {
  const params = useParams();
  const programId = params.id;

  const { data: program, isLoading, error } = useQuery<Program>({
    queryKey: ["/api/programs", programId],
    enabled: !!programId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Program not found</h1>
        <Link href="/programs">
          <Button>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Programs
          </Button>
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[program.icon] || Rocket;
  const gradientClass = gradientMap[program.gradient] || gradientMap.purple;
  const iconBgClass = iconBgMap[program.gradient] || iconBgMap.purple;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Always show theme color gradient */}
      <section className={`relative min-h-[300px] lg:min-h-[350px] flex items-center`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 geometric-grid" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/programs">
              <Button variant="ghost" className="text-white mb-6 hover:bg-white/20" data-testid="button-back">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Programs
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className={`w-16 h-16 ${iconBgClass} rotate-45 flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-white -rotate-45" />
            </div>
            <Badge className="glass-panel text-white border-white/20 py-1.5 px-4">
              <Sparkles className="w-3 h-3 mr-2" />
              KEF Program
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-white leading-tight tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-4 hero-text-shadow max-w-4xl"
            data-testid="text-program-title"
          >
            {program.title}
          </motion.h1>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Program</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6 whitespace-pre-line" data-testid="text-program-description">
                  {program.description}
                </p>
              </motion.div>

              {/* Bold Details Section */}
              {(program.eventDate || program.venue || program.feeAmount) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    {program.eventDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-lg font-bold text-foreground" data-testid="text-program-date">
                          {program.eventDate}
                        </span>
                      </div>
                    )}
                    {program.venue && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-lg font-bold text-foreground" data-testid="text-program-venue">
                          {program.venue}
                        </span>
                      </div>
                    )}
                    {program.feeAmount && (
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-lg font-bold text-foreground" data-testid="text-program-fee">
                          {program.feeLabel || "Fee"}: Rs {program.feeAmount}/-
                        </span>
                      </div>
                    )}
                    {program.earlyBirdOffer && (
                      <div className="mt-2">
                        <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-0 text-sm py-1.5 px-3" data-testid="badge-early-bird">
                          <Percent className="w-4 h-4 mr-1" />
                          {program.earlyBirdOffer}
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Banner Image */}
              {program.bannerImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <img 
                    src={program.bannerImage} 
                    alt={`${program.title} banner`}
                    className="w-full h-auto rounded-lg shadow-lg"
                    data-testid="img-program-banner"
                  />
                </motion.div>
              )}

              {program.features && program.features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-4">What's Included</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {program.features.map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1.5">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-visible">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Program Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <UserCheck className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Status</p>
                          <p className="text-sm text-muted-foreground">
                            {program.isActive ? "Currently Active" : "Coming Soon"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Program Type</p>
                          <p className="text-sm text-muted-foreground capitalize">{program.gradient} Theme</p>
                        </div>
                      </div>
                    </div>
                    
                    {program.programStatus === 'live' && (
                      <div className="mt-6 pt-6 border-t border-border">
                        {program.title === "Kerala Startup Fest" ? (
                          <a href="https://keralastartupfest.com" target="_blank" rel="noopener noreferrer">
                            <Button className="w-full btn-angular" data-testid="button-register-program">
                              Register Now
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </a>
                        ) : (
                          <Link href="/register">
                            <Button className="w-full btn-angular" data-testid="button-register-program">
                              Register Now
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                    {program.programStatus === 'upcoming' && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-center text-muted-foreground text-sm">
                          Registration opens soon
                        </p>
                      </div>
                    )}
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
                    <h3 className="text-lg font-bold text-foreground mb-4">Need More Info?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Have questions about this program? Contact us for more details.
                    </p>
                    <Link href="/contact">
                      <Button variant="outline" className="w-full" data-testid="button-contact-program">
                        Contact Us
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
