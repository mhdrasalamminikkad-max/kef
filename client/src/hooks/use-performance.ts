import React, { useEffect } from 'react';

/**
 * Hook to respect user's motion preferences
 * Disables animations if user has set prefers-reduced-motion
 */
export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const mediaQuery = window.matchMedia(query);
  return mediaQuery.matches;
}

/**
 * Hook for lazy loading animations based on viewport visibility
 * Only triggers animation when element enters viewport
 */
export function useAnimationOnceInView() {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.3, ease: 'easeOut' }
  };
}

/**
 * Performance monitoring utility
 * Logs Core Web Vitals metrics
 */
export function initializePerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint (LCP)
    try {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        console.log(`${entry.name}: ${entry.startTime}ms`);
      });
    } catch (e) {
      // Silently fail if not supported
    }

    // Monitor First Input Delay (FID) - INP in newer browsers
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const interactionDelay = entry.processingStart - entry.startTime;
            console.log(`First Input Delay: ${interactionDelay}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Silently fail if not supported
    }
  }
}

/**
 * Throttle function to limit event handler calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

/**
 * Debounce function to delay function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

/**
 * Hook to defer non-critical updates
 * Useful for heavy operations that don't need to be immediate
 */
export function useDeferredValue<T>(value: T, delay: number = 0): T {
  const [deferredValue, setDeferredValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return deferredValue;
}

export default {
  usePrefersReducedMotion,
  useAnimationOnceInView,
  initializePerformanceMonitoring,
  throttle,
  debounce,
  useDeferredValue,
};
