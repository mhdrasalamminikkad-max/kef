import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "kef:bootcamp-registered";
const MODAL_DISMISSED_KEY = "kef:bootcamp-modal-dismissed";

interface RegistrationContextType {
  isRegistered: boolean;
  isModalDismissed: boolean;
  isLoaded: boolean;
  shouldShowModal: boolean;
  markRegistered: () => void;
  dismissModal: () => void;
  reopenModal: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isModalDismissed, setIsModalDismissed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    const registered = localStorage.getItem(STORAGE_KEY) === "true";
    const dismissed = localStorage.getItem(MODAL_DISMISSED_KEY) === "true";
    setIsRegistered(registered);
    setIsModalDismissed(dismissed);
    setIsLoaded(true);
  }, []);

  const markRegistered = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsRegistered(true);
  }, []);

  const dismissModal = useCallback(() => {
    localStorage.setItem(MODAL_DISMISSED_KEY, "true");
    setIsModalDismissed(true);
    setShouldShowModal(false);
  }, []);

  const reopenModal = useCallback(() => {
    setShouldShowModal(true);
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        isRegistered,
        isModalDismissed,
        isLoaded,
        shouldShowModal,
        markRegistered,
        dismissModal,
        reopenModal,
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
