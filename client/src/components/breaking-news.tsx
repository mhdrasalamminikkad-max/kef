import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";

const REGISTRATION_URL = "/apply-for-membership";

export function BreakingNews() {
  const { isRegistered, isLoaded } = useRegistrationStatus();

  if (!isLoaded || isRegistered) {
    return null;
  }

  const newsText = "🎉 Kerala Startup Fest | 50% Discount on KEF Membership | Associate Member ₹1,500 | Student Member ₹750 | Corporate Member ₹5,000 | Institutional Member ₹3,750";
  const mobileNewsText = "🎉 50% OFF KEF Membership | Join Now!";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 text-black py-2 md:py-2.5 relative z-40"
      data-testid="breaking-news-bar"
    >
      <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <a href={REGISTRATION_URL}>
              <Button 
                size="sm" 
                className="bg-red-500 text-white hover:bg-red-600 font-semibold shrink-0 text-xs md:text-sm"
                data-testid="button-breaking-news-register"
              >
                <Zap className="w-3 h-3 mr-1" />
                Special Offer
              </Button>
            </a>
            
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="inline-flex animate-marquee">
                <span className="text-xs md:text-sm px-4 hidden md:inline font-semibold">{newsText}</span>
                <span className="text-xs md:text-sm px-4 hidden md:inline font-semibold">{newsText}</span>
                <span className="text-xs md:text-sm px-4 hidden md:inline font-semibold">{newsText}</span>
                <span className="text-xs px-4 md:hidden font-semibold">{mobileNewsText}</span>
                <span className="text-xs px-4 md:hidden font-semibold">{mobileNewsText}</span>
                <span className="text-xs px-4 md:hidden font-semibold">{mobileNewsText}</span>
              </div>
            </div>
          </div>
          
          <a href={REGISTRATION_URL}>
            <Button 
              size="sm" 
              className="bg-red-500 text-white hover:bg-red-600 font-semibold shrink-0 text-xs md:text-sm"
              data-testid="button-breaking-news-learn-more"
            >
              Join Now
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
