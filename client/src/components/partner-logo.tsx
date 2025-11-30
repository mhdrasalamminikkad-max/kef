import { motion } from "framer-motion";

interface PartnerLogoProps {
  name: string;
  index?: number;
}

export function PartnerLogo({ name, index = 0 }: PartnerLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex items-center justify-center p-6 rounded-xl bg-muted/50 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover-elevate"
      data-testid={`partner-logo-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-full h-12 flex items-center justify-center">
        <span className="text-lg font-semibold text-muted-foreground/60 hover:text-foreground transition-colors">
          {name}
        </span>
      </div>
    </motion.div>
  );
}
