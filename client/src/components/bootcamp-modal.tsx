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
            className="relative w-full max-w-sm flex flex-col items-center"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            {/* Close button - small icon at top right */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 z-10 h-8 w-8 bg-white text-gray-600 hover:bg-gray-100 rounded-full shadow-lg"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Poster image - fits screen */}
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={bootcampImage} 
                alt="Startup Boot Camp" 
                className="w-full h-auto object-contain"
                style={{ maxHeight: 'calc(90vh - 70px)' }}
                data-testid="img-bootcamp-poster"
              />
            </div>
            
            {/* White Register Now button */}
            <Link href="/register" className="w-full mt-3" onClick={handleClose}>
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-base py-6 rounded-xl shadow-lg"
                data-testid="button-modal-register"
              >
                Register Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
