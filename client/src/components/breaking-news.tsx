import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";

export function BreakingNews() {
  const { isRegistered, isLoaded } = useRegistrationStatus();

  if (!isLoaded || isRegistered) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-2 relative z-40"
      data-testid="breaking-news-bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link href="/register">
              <Button 
                size="sm" 
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold shrink-0"
                data-testid="button-breaking-news-register"
              >
                Register Now
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                UPCOMING
              </span>
              
              <div className="overflow-hidden whitespace-nowrap">
                <motion.div
                  animate={{ x: [0, -100 + "%"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="inline-block"
                >
                  <span className="text-sm">
                    Startup Boot Camp - 3-Day Residential Experience | December 26-28, 2025 | Caliph Life School, Kozhikode | Open to ages 15-29
                    <span className="mx-8">|</span>
                    Startup Boot Camp - 3-Day Residential Experience | December 26-28, 2025 | Caliph Life School, Kozhikode | Open to ages 15-29
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
          
          <Link href="/register" className="shrink-0 hidden sm:block">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              data-testid="button-breaking-news-learn-more"
            >
              Learn More
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
