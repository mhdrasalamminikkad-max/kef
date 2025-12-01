import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import { useState, useEffect } from "react";
import { Link } from "wouter";

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

export function FloatingInvitationButton() {
  const { isModalDismissed, isLoaded, reopenModal, isModalCurrentlyOpen, isRegistered, registrationId } = useRegistrationStatus();
  const [isMounted, setIsMounted] = useState(false);

  const { data: settings, isLoading: isSettingsLoading, isError: isSettingsError } = useQuery<PopupSettings>({
    queryKey: ["/api/popup-settings"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isPopupEnabled = settings?.isEnabled ?? true;
  
  const settingsReady = !isSettingsLoading || isSettingsError;

  const shouldShowButton = 
    isMounted && 
    isLoaded && 
    settingsReady &&
    isModalDismissed && 
    isPopupEnabled && 
    !isModalCurrentlyOpen;

  if (!isMounted) return null;

  const hasInvitation = isRegistered && registrationId;

  const handleClick = () => {
    if (hasInvitation) {
      window.location.href = `/invitation/${registrationId}`;
    } else {
      reopenModal();
    }
  };

  const buttonContent = (
    <AnimatePresence>
      {shouldShowButton && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.3
          }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-[9999] group"
          data-testid="button-floating-invitation"
          aria-label={hasInvitation ? "View your invitation" : "Open invitation"}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className={`absolute inset-0 ${hasInvitation ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500' : 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'} rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity`} />
            
            <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${hasInvitation ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700' : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'} rounded-full shadow-xl border-2 border-white/20`}>
              <motion.div
                animate={{ rotate: hasInvitation ? 0 : [0, -10, 10, -10, 0] }}
                transition={{ 
                  duration: 0.5,
                  repeat: hasInvitation ? 0 : Infinity,
                  repeatDelay: 3
                }}
              >
                {hasInvitation ? (
                  <Ticket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                ) : (
                  <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                )}
              </motion.div>
              
              <motion.div
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </div>

            {hasInvitation && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-1 -left-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-md border border-white/50"
              >
                <span className="text-[10px] font-bold text-green-800">1</span>
              </motion.div>
            )}
            
            {!hasInvitation && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md border border-white/50"
              >
                <span className="text-[10px] font-bold text-red-700">!</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {hasInvitation ? "View Your Invitation" : "View Invitation"}
            </span>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-white dark:bg-gray-800 rotate-45" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );

  return createPortal(buttonContent, document.body);
}
