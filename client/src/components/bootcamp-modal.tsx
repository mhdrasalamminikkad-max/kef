import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          data-testid="bootcamp-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative max-w-lg w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 text-white hover:bg-white/20 rounded-full"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="relative">
              <img 
                src={bootcampImage} 
                alt="Startup Boot Camp" 
                className="w-full h-auto"
                data-testid="img-bootcamp-poster"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 via-blue-900/80 to-transparent p-4">
                <div className="flex flex-wrap gap-3 text-white/90 text-xs mb-3">
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                    <Calendar className="w-3 h-3" />
                    <span>Dec 26-28, 2025</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                    <MapPin className="w-3 h-3" />
                    <span>Kozhikode</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                    <Users className="w-3 h-3" />
                    <span>Ages 15-29</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-3">
                <Link href="/register" className="flex-1" onClick={handleClose}>
                  <Button 
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-semibold"
                    data-testid="button-modal-register"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={handleClose}
                  data-testid="button-modal-later"
                >
                  Later
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
