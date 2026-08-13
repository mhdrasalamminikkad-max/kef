import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const SESSION_DISMISSED_KEY = "kef:popup-dismissed-session";

interface PopupSettings {
  id: string;
  isEnabled: boolean;
  title: string;
  bannerImage: string;
  buttonText: string;
  buttonLink: string;
  delaySeconds: string;
  showOnce: boolean;
}

export function BootcampModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { data: settings, isLoading } = useQuery<PopupSettings>({
    queryKey: ["/api/popup-settings"],
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Wait until settings have loaded
    if (isLoading || !settings) return;

    // Don't show if admin disabled it
    if (!settings.isEnabled) return;

    // Don't show if there's no image configured
    if (!settings.bannerImage || !settings.bannerImage.trim()) return;

    // Check if dismissed this browser session
    const dismissedThisSession = sessionStorage.getItem(SESSION_DISMISSED_KEY) === "true";
    if (dismissedThisSession) return;

    // Show with configured delay
    const delayMs = Math.max(1, parseInt(settings.delaySeconds ?? "2", 10)) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isLoading, settings]);

  const handleClose = () => {
    setIsOpen(false);
    // Only dismiss for this browser session (not permanently)
    sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
  };

  if (!isMounted || !settings?.isEnabled) return null;

  const buttonText = settings?.buttonText || "Register Now";
  const buttonLink = settings?.buttonLink || "#";
  const bannerImage = settings?.bannerImage || "";

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          style={{ zIndex: 99999 }}
          onClick={handleClose}
          data-testid="bootcamp-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-lg"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-3 -right-3 z-10 h-9 w-9 bg-white text-gray-700 hover:bg-gray-100 rounded-full shadow-lg border border-gray-200"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Poster image */}
            {bannerImage && (
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={bannerImage}
                  alt={settings?.title || "Event Announcement"}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "calc(82vh - 70px)" }}
                  data-testid="img-bootcamp-poster"
                />
              </div>
            )}

            {/* CTA button */}
            {buttonLink && buttonLink !== "#" && (
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3"
                onClick={handleClose}
              >
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm sm:text-base py-5 rounded-xl shadow-lg"
                  data-testid="button-modal-register"
                >
                  {buttonText}
                </Button>
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
