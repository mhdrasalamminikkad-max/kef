import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import bootcampImage from "@assets/kef a_1764492076701.png";

interface PopupSettings {
  id: number;
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

  const { data: settings } = useQuery<PopupSettings>({
    queryKey: ["/api/popup-settings"],
  });

  useEffect(() => {
    if (!settings?.isEnabled) return;

    const sessionKey = "popup_shown";
    if (settings.showOnce && sessionStorage.getItem(sessionKey)) {
      return;
    }

    const delay = parseInt(settings.delaySeconds) * 1000 || 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
      if (settings.showOnce) {
        sessionStorage.setItem(sessionKey, "true");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [settings]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const imageToShow = settings?.bannerImage || bootcampImage;
  const buttonText = settings?.buttonText || "Register Now";
  const buttonLink = settings?.buttonLink || "/register";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
          data-testid="bootcamp-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg flex flex-col items-center"
            style={{ maxHeight: '95vh' }}
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 z-10 h-8 w-8 bg-white text-gray-600 hover:bg-gray-100 rounded-full shadow-lg"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={imageToShow} 
                alt={settings?.title || "Startup Boot Camp"}
                className="w-full h-auto object-contain"
                style={{ maxHeight: 'calc(95vh - 70px)' }}
                data-testid="img-bootcamp-poster"
              />
            </div>
            
            <Link href={buttonLink} className="w-full mt-3" onClick={handleClose}>
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-base py-6 rounded-xl shadow-lg"
                data-testid="button-modal-register"
              >
                {buttonText}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
