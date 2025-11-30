import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Play } from "lucide-react";

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

const gradients = {
  purple: "from-red-500 via-red-500 to-cyan-400",
  blue: "from-red-500 via-cyan-400 to-yellow-300",
  teal: "from-cyan-400 via-yellow-300 to-red-500",
};

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
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]} opacity-95`} />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-yellow-300/15 rounded-full blur-3xl" />
      </div>
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

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
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm border border-white/20 mb-6">
                {subtitle}
              </span>
            </motion.div>
          )}
          
          <motion.h1
            variants={itemVariants}
            className={`font-bold text-white leading-tight tracking-tight ${
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
                    className="bg-white text-purple-700 hover:bg-white/90 shadow-lg shadow-purple-900/20 font-semibold px-8"
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
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8"
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
