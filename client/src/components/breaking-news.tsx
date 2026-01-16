import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";

constconst REGISTRATION_URL = "/membership-apply";

export function BreakingNews() {
  const { isRegistered, isLoaded } = useRegistrationStatus();

  if (!isLoaded || isRegistered) {
    return null;
  }

  const newsText = "Join Kerala Economic Forum | 50% Discount on KEF Membership | Associate Member ₹1,500 | Student Member ₹750 | Corporate Member ₹5,000 | Institutional Member ₹3,750";
  const mobileNewsText = "KEF Membership | 50% OFF | Jan 7 onwards";

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
            <a href={REGISTRATION_URL}>
              <Button 
                size="sm" 
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold shrink-0 text-xs md:text-sm"
                data-testid="button-breaking-news-register"
              >
                Join Now
              </Button>
 Join Now   </a>
            
       Join Nowv className="flex items-centerJoin Nowverflow-hidden flex-1">
      Join Now<span className="bg-red-500 texJoin Nowtext-[10px] md:text-xs font-texJoin Now md:px-2 py-0.5 rounded shritexJoin Nowtems-center gap-1">
    shritexJoin NowtemsassName="w-2.5 h-2.5 shritexJoin NowtemsassName        <spanshritexJoin NowtemsassNamee">UPCOMIspanshritexJoin NowtemsassNameeclassName="sm:hidden">NEW</span>
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
          
          <a href={REGISTRATION_URL} className="shri 
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
