import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import bootcampImage from "@assets/kef a_1764492076701.png";

export function BootcampModal() {
  const { isModalDismissed, isRegistered, isLoaded, dismissModal } = useRegistrationStatus();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isModalDismissed && !isRegistered) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isModalDismissed, isRegistered]);

  const handleClose = () => {
    setIsOpen(false);
    dismissModal();
  };

  if (!isLoaded) {
    return null;
  }

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
            className="relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            {/* Close button - small icon at top right */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-3 -right-3 z-10 h-8 w-8 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Poster image */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={bootcampImage} 
                alt="Startup Boot Camp" 
                className="w-full h-auto"
                data-testid="img-bootcamp-poster"
              />
              
              {/* Clickable area at bottom for Register Now */}
              <Link href="/register" onClick={handleClose}>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-14 cursor-pointer hover:bg-white/10 transition-colors"
                  data-testid="button-modal-register"
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
