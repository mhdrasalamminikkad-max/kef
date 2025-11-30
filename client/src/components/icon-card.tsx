import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  gradient?: "purple" | "blue" | "teal" | "orange";
}

const gradients = {
  purple: "from-purple-500 to-purple-600",
  blue: "from-blue-500 to-blue-600",
  teal: "from-teal-500 to-cyan-500",
  orange: "from-orange-500 to-red-500",
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
      <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
