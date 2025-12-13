import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";

const REGISTRATION_URL = "https://keralastartupfest.com";

export function BreakingNews() {
  const { isRegistered, isLoaded } = useRegistrationStatus();

  if (!isLoaded || isRegistered) {
    return null;
  }

  const newsText = "Kerala Startup Fest 2026 - First of Its Kind in the State | January 7-8, 2026 | Kozhikode Beach | Register Now!";
  const mobileNewsText = "Kerala Startup Fest | Jan 7-8, 2026 | Kozhikode";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-2 md:py-2.5 relative z-40"
      data-testid="breaking-news-bar"
    >
      <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
              <Button 
                size="sm" 
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold shrink-0 text-xs md:text-sm"
                data-testid="button-breaking-news-register"
              >
                Register
              </Button>
            </a>
            
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="hidden sm:inline">UPCOMING</span>
                <span className="sm:hidden">NEW</span>
              </span>
              
              <div className="overflow-hidden whitespace-nowrap flex-1">
                <div className="inline-flex animate-marquee">
                  <span className="text-xs md:text-sm px-4 hidden md:inline">{newsText}</span>
                  <span className="text-xs md:text-sm px-4 hidden md:inline">{newsText}</span>
                  <span className="text-xs md:text-sm px-4 hidden md:inline">{newsText}</span>
                  <span className="text-xs px-4 md:hidden">{mobileNewsText}</span>
                  <span className="text-xs px-4 md:hidden">{mobileNewsText}</span>
                  <span className="text-xs px-4 md:hidden">{mobileNewsText}</span>
                </div>
              </div>
            </div>
          </div>
          
          <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 hidden sm:block">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              data-testid="button-breaking-news-learn-more"
            >
              Learn More
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
