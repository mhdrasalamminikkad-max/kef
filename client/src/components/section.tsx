import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "gradient";
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Section({ 
  children, 
  className, 
  id,
  background = "default" 
}: SectionProps) {
  const bgClass = {
    default: "bg-background",
    muted: "bg-muted/30",
    gradient: "bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-950/20 dark:to-background",
  };

  return (
    <section 
      id={id}
      className={cn(
        "py-10 md:py-16 lg:py-24",
        bgClass[background],
        className
      )}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SectionHeader({ 
  title, 
  subtitle, 
  description, 
  align = "center",
  className 
}: SectionHeaderProps) {
  return (
    <motion.div 
      variants={itemVariants}
      className={cn(
        "mb-8 md:mb-12 lg:mb-16",
        align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-2xl",
        className
      )}
    >
      {subtitle && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-primary/10 text-primary mb-3 md:mb-4">
          {subtitle}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 md:mt-4 text-sm md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

export { containerVariants, itemVariants };
