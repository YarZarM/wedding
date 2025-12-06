import { useState, useEffect, useRef } from 'react';

interface UseImagePreloaderOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  debug?: boolean; // Add debug logging
  minimumLoadTime?: number; 
}

export function useImagePreloader(
  imageUrls: string[],
  options: UseImagePreloaderOptions = {}
) {
  const { minimumLoadTime = 3000 } = options;
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [minimumTimeMet, setMinimumTimeMet] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Track if we've already started loading
  const hasStartedLoading = useRef(false);
  // Store loaded image URLs to prevent reloading
  const loadedUrls = useRef(new Set<string>());

  // Preload all images - ONLY ONCE
  useEffect(() => {
    // Prevent multiple executions
    if (hasStartedLoading.current) {
      return;
    }
    
    if (imageUrls.length === 0) {
      setImagesLoaded(true);
      setProgress(100);
      return;
    }

    hasStartedLoading.current = true;
    const total = imageUrls.length;
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      const currentProgress = Math.round((loadedCount / total) * 100);
      setLoadedCount(loadedCount);
      setProgress(currentProgress);
      
      // Check if all images are loaded
      if (loadedCount === total) {
        setImagesLoaded(true);
        setProgress(100);
      }
    };

    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        // Skip if already loaded
        if (loadedUrls.current.has(src)) {
          updateProgress();
          resolve();
          return;
        }
        
        const img = new Image();
        
        img.onload = () => {
          loadedUrls.current.add(src);
          updateProgress();
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedUrls.current.add(src); // Mark as "loaded" to prevent retry
          updateProgress();
          resolve();
        };
        
        img.src = src;
      });
    };

    // Load all images in parallel
    Promise.all(imageUrls.map(loadImage))
      .then(() => {
        setImagesLoaded(true);
        setProgress(100);
      })
      .catch((error) => {
        console.error('Error preloading images:', error);
        setImagesLoaded(true);
        setProgress(100);
      });
      
    // Empty dependency array - only run once
  }, []);

  // Minimum display time timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimeMet(true);
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime]);

  // Complete when both conditions are met
  const isComplete = imagesLoaded && minimumTimeMet;

  return {
    isComplete,
    progress,
    loadedCount,
    totalCount: imageUrls.length,
    imagesLoaded,
    minimumTimeMet,
  };
}




















