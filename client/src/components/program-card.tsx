import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  href?: string;
  index?: number;
  gradient?: "purple" | "blue" | "teal" | "orange";
}

const gradients = {
  purple: "from-purple-500 to-purple-600",
  blue: "from-blue-500 to-indigo-600",
  teal: "from-teal-500 to-cyan-500",
  orange: "from-orange-500 to-red-500",
};

export function ProgramCard({
  icon: Icon,
  title,
  description,
  features,
  href = "#",
  index = 0,
  gradient = "purple",
}: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full hover-elevate group cursor-pointer overflow-visible">
        <CardHeader className="pb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
          {features && features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <Link href={href}>
            <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
              Learn More
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
