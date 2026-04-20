import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  category?: string;
  imagePlaceholder?: boolean;
  index?: number;
}

export function EventCard({
  title,
  date,
  time,
  location,
  description,
  category,
  imagePlaceholder = true,
  index = 0,
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover-elevate group cursor-pointer h-full">
        {imagePlaceholder && (
          <div className="relative aspect-video bg-gradient-to-br from-red-100 to-cyan-100 dark:from-red-900/30 dark:to-cyan-900/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-red-300 dark:text-red-600" />
            </div>
            {category && (
              <Badge 
                className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-cyan-400 text-white border-0"
              >
                {category}
              </Badge>
            )}
            <div className="absolute bottom-3 right-3 bg-white dark:bg-slate-900 rounded-lg px-3 py-1.5 shadow-lg">
              <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                {date}
              </span>
            </div>
          </div>
        )}
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          <div className="space-y-2 mb-4">
            {time && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-red-500" />
                <span>{time}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
          <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80">
            Learn More
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
