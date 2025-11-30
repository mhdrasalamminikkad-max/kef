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
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md"
          onClick={handleClose}
          data-testid="bootcamp-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full max-w-[min(92vw,400px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: 'min(94vh, 580px)' }}
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-black/30 text-white hover:bg-black/50 rounded-full backdrop-blur-sm"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Image section - fixed height */}
            <div className="relative flex-shrink-0 h-[clamp(140px,30vh,200px)]">
              <img 
                src={bootcampImage} 
                alt="Startup Boot Camp" 
                className="w-full h-full object-cover object-top rounded-t-2xl"
                data-testid="img-bootcamp-poster"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent rounded-t-2xl" />
            </div>

            {/* Content section - compact */}
            <div className="flex-1 px-4 py-3 space-y-2">
              {/* Badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] font-bold rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                LIMITED SEATS
              </span>

              {/* Title */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  Startup Boot Camp
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  3-Day Residential Experience
                </p>
              </div>

              {/* Info pills - compact */}
              <div className="flex flex-wrap gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span>Dec 26-28</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span>Kozhikode</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  <Users className="w-3 h-3 text-primary" />
                  <span>Ages 15-29</span>
                </div>
              </div>

              {/* Description - short */}
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Join Kerala's most exciting entrepreneurship bootcamp!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 p-3 pt-0">
              <div className="flex gap-2">
                <Link href="/register" className="flex-1" onClick={handleClose}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl h-11"
                    data-testid="button-modal-register"
                  >
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="rounded-xl h-11 px-4 border-gray-200 dark:border-gray-700"
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
