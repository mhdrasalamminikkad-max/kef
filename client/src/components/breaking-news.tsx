import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface BreakingNewsSettings {
  id: string;
  isEnabled: boolean;
  newsText: string;
  hasButton: boolean;
  badgeText: string;
  buttonText: string;
  buttonLink: string;
  updatedAt: string;
}

export function BreakingNews() {
  const { data: settings, isLoading } = useQuery<BreakingNewsSettings>({
    queryKey: ["/api/breaking-news-settings"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  if (isLoading) return null;
  if (!settings?.isEnabled) return null;

  const newsText = settings.newsText;
  const hasButton = settings.hasButton;
  const badgeText = settings.badgeText || "Special Offer";
  const buttonText = settings.buttonText || "Register Now";
  const buttonLink = settings.buttonLink || "/apply-for-membership";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 text-black py-2 md:py-2.5"
      data-testid="breaking-news-bar"
    >
      <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {hasButton && (
              <a href={buttonLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  className="bg-red-500 text-white hover:bg-red-600 font-semibold shrink-0 text-xs md:text-sm"
                  data-testid="button-breaking-news-badge"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {badgeText}
                </Button>
              </a>
            )}

            <div className="overflow-hidden whitespace-nowrap flex-1">
              <div className="inline-flex animate-marquee">
                <span className="text-xs md:text-sm px-4 font-semibold">{newsText}</span>
                <span className="text-xs md:text-sm px-4 font-semibold">{newsText}</span>
                <span className="text-xs md:text-sm px-4 font-semibold">{newsText}</span>
              </div>
            </div>
          </div>

          {hasButton && (
            <a href={buttonLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600 font-semibold shrink-0 text-xs md:text-sm"
                data-testid="button-breaking-news-cta"
              >
                {buttonText}
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
