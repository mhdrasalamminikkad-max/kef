import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Mail, MailOpen, Sparkles, X, ChevronUp, GripVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import { useState, useEffect, useRef } from "react";

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

interface Registration {
  id: string;
  fullName: string;
  createdAt: string;
}

export function FloatingInvitationButton() {
  const { isModalDismissed, isLoaded, reopenModal, isModalCurrentlyOpen, isRegistered, registrationIds, refreshRegistrationIds } = useRegistrationStatus();
  const [isMounted, setIsMounted] = useState(false);
  const [showInvitationList, setShowInvitationList] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const { data: settings, isLoading: isSettingsLoading, isError: isSettingsError } = useQuery<PopupSettings>({
    queryKey: ["/api/popup-settings"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  useEffect(() => {
    setIsMounted(true);
    // Refresh registration IDs from localStorage on mount
    refreshRegistrationIds();
  }, [refreshRegistrationIds]);

  // Fetch registration details when we have IDs - use slim endpoint for speed
  useEffect(() => {
    if (registrationIds.length > 0) {
      Promise.all(
        registrationIds.map(async (id) => {
          try {
            const response = await fetch(`/api/invitation/${id}`);
            if (response.ok) {
              return await response.json();
            }
            return { id, fullName: "Registration", createdAt: new Date().toISOString() };
          } catch {
            return { id, fullName: "Registration", createdAt: new Date().toISOString() };
          }
        })
      ).then((results) => {
        setRegistrations(results.filter(Boolean));
      });
    }
  }, [registrationIds]);

  const isPopupEnabled = settings?.isEnabled ?? true;
  
  const settingsReady = !isSettingsLoading || isSettingsError;

  const hasInvitations = isRegistered && registrationIds.length > 0;
  const invitationCount = registrationIds.length;

  const shouldShowButton = 
    isMounted && 
    isLoaded && 
    settingsReady &&
    (isModalDismissed || hasInvitations) && 
    isPopupEnabled && 
    !isModalCurrentlyOpen;

  if (!isMounted) return null;

  const handleInvitationClick = (id: string) => {
    window.location.href = `/invitation/${id}`;
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    // Refresh from localStorage before showing the list
    refreshRegistrationIds();
    
    if (hasInvitations) {
      // Always show the invitation list, even if there's only 1
      setShowInvitationList(!showInvitationList);
    } else {
      reopenModal();
    }
  };

  const buttonContent = (
    <>
      {/* Drag constraints container */}
      <div 
        ref={constraintsRef} 
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
      <AnimatePresence>
        {shouldShowButton && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.3
            }}
            className="fixed bottom-6 right-6 z-[9999] cursor-grab active:cursor-grabbing"
            whileDrag={{ scale: 1.05 }}
          >
          {/* Invitation List Popup */}
          <AnimatePresence>
            {showInvitationList && hasInvitations && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute bottom-20 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[280px]"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between gap-2">
                  <h3 className="text-white font-semibold text-sm">
                    {invitationCount === 1 ? "Your Invitation" : `Your Invitations (${invitationCount})`}
                  </h3>
                  <button 
                    onClick={() => setShowInvitationList(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {registrations.map((reg, index) => (
                    <motion.button
                      key={reg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleInvitationClick(reg.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      data-testid={`invitation-item-${reg.id}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <MailOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {reg.fullName || `Invitation ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(reg.createdAt).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <ChevronUp className="w-4 h-4 text-gray-400 rotate-90" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <button
            onClick={handleButtonClick}
            className="group"
            data-testid="button-floating-invitation"
            aria-label={hasInvitations ? `View your ${invitationCount} invitation(s)` : "Open invitation"}
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
              <div className={`absolute inset-0 ${hasInvitations ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500' : 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'} rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity`} />
              
              <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${hasInvitations ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700' : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700'} rounded-full shadow-xl border-2 border-white/20`}>
                <motion.div
                  animate={{ rotate: hasInvitations ? 0 : [0, -10, 10, -10, 0] }}
                  transition={{ 
                    duration: 0.5,
                    repeat: hasInvitations ? 0 : Infinity,
                    repeatDelay: 3
                  }}
                >
                  {hasInvitations ? (
                    <MailOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  ) : (
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
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

              {hasInvitations && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-1 -left-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-md border border-white/50"
                >
                  <span className="text-xs font-bold text-green-800">{invitationCount}</span>
                </motion.div>
              )}
              
              {!hasInvitations && (
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
                {hasInvitations 
                  ? invitationCount > 1 
                    ? `View ${invitationCount} Invitations` 
                    : "View Your Invitation"
                  : "View Invitation"}
              </span>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-white dark:bg-gray-800 rotate-45" />
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );

  return createPortal(buttonContent, document.body);
}
