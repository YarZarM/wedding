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
  const {
    minimumLoadTime = 3000,
    debug = false,
  } = options;
  
  const [loadedCount, setLoadedCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [minimumTimeMet, setMinimumTimeMet] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Use ref to track count to avoid closure issues
  const loadedCountRef = useRef(0);

  // Preload all images
  useEffect(() => {
    if (imageUrls.length === 0) {
      setImagesLoaded(true);
      setProgress(100);
      return;
    }

    const total = imageUrls.length;
    
    if (debug) {
      console.log(`🖼️ Starting to preload ${total} images...`);
    }

    const updateProgress = (imageSrc: string, success: boolean) => {
      loadedCountRef.current++;
      const currentCount = loadedCountRef.current;
      const currentProgress = Math.round((currentCount / total) * 100);
      
      setLoadedCount(currentCount);
      setProgress(currentProgress);
      
      if (debug) {
        console.log(`${success ? '✅' : '❌'} ${currentCount}/${total} (${currentProgress}%) - ${imageSrc.substring(0, 60)}...`);
      }
      
      // Check if all images are loaded
      if (currentCount === total) {
        setImagesLoaded(true);
        setProgress(100);
        if (debug) {
          console.log('🎉 All images preloaded!');
        }
      }
    };

    const loadImage = (src: string, index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          updateProgress(src, true);
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          updateProgress(src, false);
          resolve();
        };
        
        if (debug) {
          console.log(`🔄 Loading ${index + 1}/${total}: ${src.substring(0, 60)}...`);
        }
        
        img.src = src;
      });
    };

    // Load all images in parallel
    imageUrls.forEach((url, index) => {
      loadImage(url, index);
    });

  }, [imageUrls, debug]);

  // Minimum display time timer
  useEffect(() => {
    if (debug) {
      console.log(`⏱️ Starting minimum time timer: ${minimumLoadTime}ms`);
    }
    
    const timer = setTimeout(() => {
      setMinimumTimeMet(true);
      if (debug) {
        console.log('⏱️ Minimum time met!');
      }
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime, debug]);

  // Complete when both conditions are met
  const isComplete = imagesLoaded && minimumTimeMet;
  
  useEffect(() => {
    if (debug && isComplete) {
      console.log('🚀 Loading complete! Ready to show website.');
    }
  }, [isComplete, debug]);

  return {
    isComplete,
    progress,
    loadedCount,
    totalCount: imageUrls.length,
    imagesLoaded,
    minimumTimeMet,
  };
}






















