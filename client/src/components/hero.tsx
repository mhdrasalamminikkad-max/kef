import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  size?: "default" | "small";
  align?: "center" | "left";
  gradient?: "purple" | "blue" | "teal";
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  size = "default",
  align = "center",
  gradient = "purple",
}: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      className={`relative overflow-hidden ${
        size === "default" ? "min-h-[600px] lg:min-h-[700px]" : "min-h-[400px] lg:min-h-[450px]"
      } flex items-center`}
    >
      {/* Animated gradient background with yellow shading */}
      <div className="absolute inset-0 hero-gradient-animated" />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Geometric grid overlay */}
      <div className="absolute inset-0 geometric-grid" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-yellow-300/10 rounded-full blur-3xl" />
        
        {/* Geometric shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rotate-45" />
        <div className="absolute bottom-20 left-10 w-16 h-16 border border-white/10 rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/5 rotate-45" />
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full ${
        align === "center" ? "text-center" : "text-left"
      }`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`${align === "center" ? "max-w-4xl mx-auto" : "max-w-3xl"}`}
        >
          {subtitle && (
            <motion.div variants={itemVariants}>
              <Badge className="glass-panel text-white border-white/20 mb-6 py-1.5 px-4">
                <Sparkles className="w-3 h-3 mr-2" />
                {subtitle}
              </Badge>
            </motion.div>
          )}
          
          <motion.h1
            variants={itemVariants}
            className={`font-bold text-white leading-tight tracking-tight hero-text-shadow ${
              size === "default"
                ? "text-4xl sm:text-5xl lg:text-6xl"
                : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p
              variants={itemVariants}
              className={`mt-6 text-lg sm:text-xl text-white/90 leading-relaxed ${
                align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"
              }`}
            >
              {description}
            </motion.p>
          )}
          
          {(primaryCta || secondaryCta) && (
            <motion.div
              variants={itemVariants}
              className={`mt-8 flex flex-col sm:flex-row gap-4 ${
                align === "center" ? "justify-center" : "justify-start"
              }`}
            >
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <Button
                    size="lg"
                    className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-500/30 font-semibold"
                    data-testid="button-hero-primary"
                  >
                    {primaryCta.label}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button
                    size="lg"
                    className="btn-angular glass-panel text-white hover:bg-white/20 font-semibold"
                    data-testid="button-hero-secondary"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    {secondaryCta.label}
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
