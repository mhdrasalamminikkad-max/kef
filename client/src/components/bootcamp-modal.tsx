import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRegistrationStatus } from "@/hooks/use-registration-status";
import bootcampImage from "@assets/kef_bootcamp.png";

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
  const [isMounted, setIsMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const preloadedImageRef = useRef<string | null>(null);
  const { dismissModal, shouldShowModal, setModalOpen } = useRegistrationStatus();

  const { data: settings, isLoading } = useQuery<PopupSettings>({
    queryKey: ["/api/popup-settings"],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [finalImageUrl, setFinalImageUrl] = useState<string>(bootcampImage);

  useEffect(() => {
    // If settings haven't loaded yet and we're still loading, wait
    if (isLoading) return;
    
    setImageLoaded(false);

    // Use settings banner image if available, otherwise use bundled fallback
    const dynamicUrl = settings?.bannerImage;
    
    if (dynamicUrl && dynamicUrl.trim()) {
      const img = new Image();
      img.onload = () => {
        setFinalImageUrl(dynamicUrl);
        preloadedImageRef.current = dynamicUrl;
        setImageLoaded(true);
      };
      img.onerror = () => {
        // If dynamic image fails, use bundled fallback
        setFinalImageUrl(bootcampImage);
        preloadedImageRef.current = bootcampImage;
        setImageLoaded(true);
      };
      img.src = dynamicUrl;
    } else {
      // No dynamic URL configured, use bundled fallback image
      setFinalImageUrl(bootcampImage);
      preloadedImageRef.current = bootcampImage;
      setImageLoaded(true);
    }
  }, [settings?.bannerImage, settings?.isEnabled, isLoading]);

  useEffect(() => {
    if (!isMounted) return;
    if (!imageLoaded) return;

    // Always show the popup on page load
    setIsOpen(true);
  }, [isMounted, imageLoaded]);

  useEffect(() => {
    if (shouldShowModal && settings?.isEnabled && imageLoaded) {
      setIsOpen(true);
    }
  }, [shouldShowModal, settings?.isEnabled, imageLoaded]);

  // Sync modal open state with context
  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen, setModalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    dismissModal();
  };

  const buttonText = settings?.buttonText || "Register Now";
  const buttonLink = settings?.buttonLink || "/register";

  if (!isMounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          style={{ 
            zIndex: 99999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            touchAction: 'none'
          }}
          onClick={handleClose}
          data-testid="bootcamp-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-lg flex flex-col items-center"
            style={{ maxHeight: '88vh' }}
            onClick={(e) => e.stopPropagation()}
            data-testid="bootcamp-modal"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10 h-9 w-9 sm:h-10 sm:w-10 bg-white text-gray-600 hover:bg-gray-100 rounded-full shadow-lg border border-gray-200"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-2xl w-full">
              <img 
                src={finalImageUrl} 
                alt={settings?.title || "Startup Boot Camp"}
                className="w-full h-auto object-contain"
                style={{ maxHeight: 'calc(82vh - 70px)' }}
                data-testid="img-bootcamp-poster"
              />
            </div>
            
            <Link href={buttonLink} className="w-full mt-3 sm:mt-4" onClick={handleClose}>
              <Button 
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-sm sm:text-base py-4 sm:py-6 rounded-lg sm:rounded-xl shadow-lg"
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

  return createPortal(modalContent, document.body);
}
