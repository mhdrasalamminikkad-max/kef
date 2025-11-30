import { useEffect, useCallback } from "react";
import { useLocation } from "wouter";

const SECRET_CODE = "786786";

export function useSecretCode() {
  const [, setLocation] = useLocation();
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    const currentSequence = sessionStorage.getItem("secretSequence") || "";
    const newSequence = (currentSequence + event.key).slice(-SECRET_CODE.length);
    
    sessionStorage.setItem("secretSequence", newSequence);
    
    if (newSequence === SECRET_CODE) {
      sessionStorage.removeItem("secretSequence");
      setLocation("/admin/login");
    }
  }, [setLocation]);
  
  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);
}
