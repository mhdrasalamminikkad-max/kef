import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import bootcampImage from "@assets/kef_bootcamp.png";
import { Link } from "wouter";

export function FloatingInvitationButton() {
  const { isModalDismissed, isRegistered, isLoaded } = useRegistrationStatus();
  const [showModal, setShowModal] = useState(false);

  const shouldShowButton = isLoaded && isModalDismissed && !isRegistered;

  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
        data-testid="floating-invitation-container"
      >
        <Button
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0 bg-gradient-to-r from-red-500 to-yellow-500"
          onClick={() => setShowModal(true)}
          data-testid="button-floating-invitation"
        >
          <Mail className="h-6 w-6 text-white" />
        </Button>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
        </span>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            data-testid="invitation-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg flex flex-col items-center"
              style={{ maxHeight: '95vh' }}
              onClick={(e) => e.stopPropagation()}
              data-testid="invitation-modal"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 z-10 h-8 w-8 bg-white text-gray-600 hover:bg-gray-100 rounded-full shadow-lg"
                onClick={() => setShowModal(false)}
                data-testid="button-close-invitation-modal"
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src={bootcampImage} 
                  alt="Startup Boot Camp" 
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: 'calc(95vh - 70px)' }}
                  data-testid="img-invitation-poster"
                />
              </div>
              
              <Link href="/register" className="w-full mt-3" onClick={() => setShowModal(false)}>
                <Button 
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-base py-6 rounded-xl shadow-lg"
                  data-testid="button-invitation-register"
                >
                  Register Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
