import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "kef:bootcamp-registered";
const MODAL_DISMISSED_KEY = "kef:bootcamp-modal-dismissed";
const REGISTRATION_IDS_KEY = "kef:bootcamp-registration-ids";

interface RegistrationContextType {
  isRegistered: boolean;
  isModalDismissed: boolean;
  isLoaded: boolean;
  shouldShowModal: boolean;
  isModalCurrentlyOpen: boolean;
  registrationId: string | null;
  registrationIds: string[];
  markRegistered: (registrationId?: string) => void;
  dismissModal: () => void;
  reopenModal: () => void;
  clearRegistered: () => void;
  setModalOpen: (open: boolean) => void;
  refreshRegistrationIds: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isModalDismissed, setIsModalDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isModalCurrentlyOpen, setIsModalCurrentlyOpen] = useState(false);
  const [registrationIds, setRegistrationIds] = useState<string[]>([]);

  useEffect(() => {
    const registered = localStorage.getItem(STORAGE_KEY) === "true";
    const dismissed = localStorage.getItem(MODAL_DISMISSED_KEY) === "true";
    
    // Load registration IDs array
    const savedRegIds = localStorage.getItem(REGISTRATION_IDS_KEY);
    let ids: string[] = [];
    if (savedRegIds) {
      try {
        const parsed = JSON.parse(savedRegIds);
        if (Array.isArray(parsed)) {
          ids = parsed;
        } else if (typeof parsed === "string") {
          // Handle legacy single-value format
          ids = [parsed];
        }
      } catch {
        // If it's not valid JSON, it might be a plain string ID (legacy format)
        if (savedRegIds && !savedRegIds.startsWith('[')) {
          ids = [savedRegIds];
        }
      }
    }
    
    // Log for debugging
    console.log("[Registration Context] Loaded IDs from localStorage:", ids);
    
    setIsRegistered(registered);
    setIsModalDismissed(dismissed);
    setRegistrationIds(ids);
    setIsLoaded(true);
  }, []);

  const markRegistered = useCallback((regId?: string) => {
    localStorage.setItem(STORAGE_KEY, "true");
    if (regId) {
      // Add to array of registration IDs (avoid duplicates)
      const savedRegIds = localStorage.getItem(REGISTRATION_IDS_KEY);
      let ids: string[] = [];
      if (savedRegIds) {
        try {
          ids = JSON.parse(savedRegIds);
          if (!Array.isArray(ids)) ids = [];
        } catch {
          ids = [];
        }
      }
      
      if (!ids.includes(regId)) {
        ids.push(regId);
        localStorage.setItem(REGISTRATION_IDS_KEY, JSON.stringify(ids));
        setRegistrationIds(ids);
      }
    }
    setIsRegistered(true);
  }, []);

  const dismissModal = useCallback(() => {
    localStorage.setItem(MODAL_DISMISSED_KEY, "true");
    setIsModalDismissed(true);
    setShouldShowModal(false);
    setIsModalCurrentlyOpen(false);
  }, []);

  const reopenModal = useCallback(() => {
    setShouldShowModal(true);
  }, []);

  const clearRegistered = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REGISTRATION_IDS_KEY);
    setIsRegistered(false);
    setRegistrationIds([]);
  }, []);

  const setModalOpen = useCallback((open: boolean) => {
    setIsModalCurrentlyOpen(open);
  }, []);

  // Refresh registration IDs from localStorage (useful when localStorage might have been updated externally)
  const refreshRegistrationIds = useCallback(() => {
    const savedRegIds = localStorage.getItem(REGISTRATION_IDS_KEY);
    let ids: string[] = [];
    if (savedRegIds) {
      try {
        ids = JSON.parse(savedRegIds);
        if (!Array.isArray(ids)) ids = [];
      } catch {
        ids = [];
      }
    }
    setRegistrationIds(ids);
    setIsRegistered(ids.length > 0 || localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  // For backward compatibility, return the first registration ID
  const registrationId = registrationIds.length > 0 ? registrationIds[0] : null;

  return (
    <RegistrationContext.Provider
      value={{
        isRegistered,
        isModalDismissed,
        isLoaded,
        shouldShowModal,
        isModalCurrentlyOpen,
        registrationId,
        registrationIds,
        markRegistered,
        dismissModal,
        reopenModal,
        clearRegistered,
        setModalOpen,
        refreshRegistrationIds,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistrationStatus() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error("useRegistrationStatus must be used within a RegistrationProvider");
  }
  return context;
}
