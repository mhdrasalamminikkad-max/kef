import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  gradient?: "purple" | "blue" | "teal" | "orange" | "red" | "yellow" | "cyan";
}

const gradients = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  cyan: "bg-cyan-500",
};

const iconColors = {
  purple: "text-white",
  blue: "text-white",
  teal: "text-white",
  orange: "text-white",
  red: "text-white",
  yellow: "text-black",
  cyan: "text-white",
};

export function IconCard({
  icon: Icon,
  title,
  description,
  index = 0,
  gradient = "purple",
}: IconCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6 group"
    >
      {/* Geometric diamond-shaped icon container */}
      <div className={`w-14 h-14 mx-auto mb-4 rotate-45 ${gradients[gradient]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 -rotate-45 ${iconColors[gradient]}`} />
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
