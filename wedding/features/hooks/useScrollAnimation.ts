import { useState, useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;      // When to trigger (0-1, default 0.1)
  rootMargin?: string;     // Margin before trigger (default '50px')
  triggerOnce?: boolean;   // Only animate once (default true)
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Unobserve after first trigger if triggerOnce is true
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          // If triggerOnce is false, hide when out of view
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}






















