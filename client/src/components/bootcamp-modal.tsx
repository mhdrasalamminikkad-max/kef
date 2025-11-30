import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Users, ArrowRight, Sparkles } from "lucide-react";
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
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={handleClose}
          data-testid="bootcamp-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, type: "spring", damping: 25 }}
            className="relative w-full sm:max-w-md sm:mx-4 max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 sm:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            {/* Mobile drag indicator */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-black/20 text-white hover:bg-black/40 rounded-full backdrop-blur-sm"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Image section */}
            <div className="relative flex-shrink-0">
              <div className="relative overflow-hidden">
                <img 
                  src={bootcampImage} 
                  alt="Startup Boot Camp" 
                  className="w-full h-auto max-h-[40vh] sm:max-h-[45vh] object-cover object-top"
                  data-testid="img-bootcamp-poster"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent" />
              </div>
            </div>

            {/* Content section */}
            <div className="flex-1 px-5 sm:px-6 pb-6 pt-2 space-y-4 overflow-auto">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full">
                  <Sparkles className="w-3 h-3" />
                  LIMITED SEATS
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  Startup Boot Camp
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  3-Day Residential Experience
                </p>
              </div>

              {/* Info pills */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Dec 26-28, 2025</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Kozhikode</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Ages 15-29</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Join Kerala's most exciting entrepreneurship bootcamp. Learn, network, and launch your startup journey!
              </p>
            </div>

            {/* Action buttons - fixed at bottom */}
            <div className="flex-shrink-0 p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register" className="flex-1" onClick={handleClose}>
                  <Button 
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base py-6 sm:py-5 rounded-xl shadow-lg shadow-primary/25"
                    data-testid="button-modal-register"
                  >
                    Register Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="sm:w-auto w-full py-6 sm:py-5 rounded-xl border-gray-200 dark:border-gray-700"
                  onClick={handleClose}
                  data-testid="button-modal-later"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
