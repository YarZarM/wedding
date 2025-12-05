import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Import Image from next/image


interface WeddingLoadingScreenProps {
  coupleNames: {
    name1: string;
    name2: string;
  };
  weddingDate: string;
  progress: number;
  isComplete: boolean;
  imagesLoaded: boolean;
  minimumTimeMet: boolean;
  onLoadComplete: () => void;
}

export function WeddingLoadingScreen({ 
  coupleNames, 
  weddingDate, 
  progress,
  isComplete,
  imagesLoaded,
  minimumTimeMet,
  onLoadComplete,
}: WeddingLoadingScreenProps) {
  const [shouldExit, setShouldExit] = React.useState(false);
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const icon = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1763569733/Icon_pnlk8u.jpg`;

  // Handle completion
  React.useEffect(() => {
    if (isComplete && !shouldExit) {
      // Small delay before starting fade out
      setTimeout(() => {
        setShouldExit(true);
      }, 500);

      // Call onComplete after fade animation
      setTimeout(() => {
        onLoadComplete();
      }, 1300);
    }
  }, [isComplete, shouldExit, onLoadComplete]);

  return (
    <AnimatePresence>
      {!shouldExit && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Hearts */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-gray-200"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${20 + Math.random() * 40}px`,
                }}
                initial={{ y: '100vh', opacity: 0 }}
                animate={{
                  y: '-10vh',
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              >
                ♥
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
            {/* Animated Icon */}
            <motion.div
              className="mb-8 flex justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                <Image 
                  src={icon}
                  alt="Wedding logo" 
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
                />
              </div>
            </motion.div>

            {/* Couple Names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black mb-2">
                {coupleNames.name1}
              </h1>
              <div className="text-2xl sm:text-3xl text-gray-400 my-3">&</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black">
                {coupleNames.name2}
              </h1>
            </motion.div>

            {/* Date */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-600 mb-8"
            >
              {new Date(weddingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="w-full max-w-md mx-auto"
            >
              {/* Progress Bar Container */}
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-black rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              {/* Loading Text with Status */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-gray-500 uppercase tracking-widest"
              >
                {!imagesLoaded ? (
                  <span>Loading Images... {Math.round(progress)}%</span>
                ) : !minimumTimeMet ? (
                  <span>Almost Ready...</span>
                ) : (
                  <span>Welcome!</span>
                )}
              </motion.div>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="w-32 h-px bg-black mx-auto mt-8"
            />
          </div>

          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute text-2xl"
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${20 + (i % 3) * 30}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WeddingLoadingScreen;

// interface WeddingLoadingScreenProps {
//   coupleNames: {
//     name1: string;
//     name2: string;
//   };
//   weddingDate: string;
//   onLoadComplete: () => void;
//   minimumLoadTime?: number; // Minimum display time in ms (default 2000)
// }

// export function WeddingLoadingScreen({ 
//   coupleNames, 
//   weddingDate, 
//   onLoadComplete,
//   minimumLoadTime = 2000 
// }: WeddingLoadingScreenProps) {
//   const [progress, setProgress] = useState(0);
//   const [isComplete, setIsComplete] = useState(false);
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [minimumTimeMet, setMinimumTimeMet] = useState(false);
//   const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
//   const icon = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_face,w_264,h_364/v1763569733/Icon_pnlk8u.jpg`;

//   // Track all images on the page
//   useEffect(() => {
//     const images = Array.from(document.images);
//     let loadedCount = 0;
//     const totalImages = images.length;

//     if (totalImages === 0) {
//       // No images to load
//       setImagesLoaded(true);
//       setProgress(100);
//       return;
//     }

//     const checkImageLoaded = () => {
//       loadedCount++;
//       const currentProgress = (loadedCount / totalImages) * 100;
//       setProgress(currentProgress);

//       if (loadedCount === totalImages) {
//         setImagesLoaded(true);
//       }
//     };

//     // Check each image
//     images.forEach((img) => {
//       if (img.complete) {
//         // Image already loaded
//         checkImageLoaded();
//       } else {
//         // Wait for image to load
//         img.addEventListener('load', checkImageLoaded);
//         img.addEventListener('error', checkImageLoaded); // Count errors as "loaded" to prevent hanging
//       }
//     });

//     // Cleanup
//     return () => {
//       images.forEach((img) => {
//         img.removeEventListener('load', checkImageLoaded);
//         img.removeEventListener('error', checkImageLoaded);
//       });
//     };
//   }, []);

//   // Minimum display time timer
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMinimumTimeMet(true);
//     }, minimumLoadTime);

//     return () => clearTimeout(timer);
//   }, [minimumLoadTime]);

//   // Complete when both conditions are met
//   useEffect(() => {
//     if (imagesLoaded && minimumTimeMet && !isComplete) {
//       // Small delay before starting fade out
//       setTimeout(() => {
//         setIsComplete(true);
//       }, 500);

//       // Call onComplete after fade animation
//       setTimeout(() => {
//         onLoadComplete();
//       }, 1300);
//     }
//   }, [imagesLoaded, minimumTimeMet, isComplete, onLoadComplete]);

//   return (
//     <AnimatePresence>
//       {!isComplete && (
//         <motion.div
//           className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           {/* Animated Background Pattern */}
//           <div className="absolute inset-0 overflow-hidden">
//             {/* Floating Hearts */}
//             {[...Array(20)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute text-gray-200"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   fontSize: `${20 + Math.random() * 40}px`,
//                 }}
//                 initial={{ y: '100vh', opacity: 0 }}
//                 animate={{
//                   y: '-10vh',
//                   opacity: [0, 0.3, 0],
//                 }}
//                 transition={{
//                   duration: 8 + Math.random() * 4,
//                   repeat: Infinity,
//                   delay: Math.random() * 5,
//                   ease: 'linear',
//                 }}
//               >
//                 ♥
//               </motion.div>
//             ))}
//           </div>

//           {/* Main Content */}
//           <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
//             {/* Animated Rings Icon */}
//             <motion.div
//               className="mb-8"
//               animate={{
//                 scale: [1, 1.1, 1],
//                 rotate: [0, 5, -5, 0],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: 'easeInOut',
//               }}
//             >
//               {/* <div className="text-8xl sm:text-9xl">
//                 💍
//               </div> */}
//              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
//                 <Image 
//                   src={icon}
//                   alt="Wedding logo" 
//                   fill
//                   className="object-contain"
//                   priority
//                   sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
//                 />
//               </div>
//             </motion.div>

//             {/* Couple Names */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3, duration: 0.8 }}
//               className="mb-6"
//             >
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black mb-2">
//                 {coupleNames.name1}
//               </h1>
//               <div className="text-2xl sm:text-3xl text-gray-400 my-3">&</div>
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black">
//                 {coupleNames.name2}
//               </h1>
//             </motion.div>

//             {/* Date */}
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6, duration: 0.8 }}
//               className="text-lg sm:text-xl text-gray-600 mb-8"
//             >
//               {new Date(weddingDate).toLocaleDateString('en-US', {
//                 month: 'long',
//                 day: 'numeric',
//                 year: 'numeric'
//               })}
//             </motion.p>

//             {/* Progress Bar */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.9, duration: 0.5 }}
//               className="w-full max-w-md mx-auto"
//             >
//               {/* Progress Bar Container */}
//               <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
//                 <motion.div
//                   className="absolute top-0 left-0 h-full bg-black rounded-full"
//                   initial={{ width: '0%' }}
//                   animate={{ width: `${Math.min(progress, 100)}%` }}
//                   transition={{ duration: 0.3, ease: 'easeOut' }}
//                 />
//               </div>

//               {/* Loading Text with Status */}
//               <motion.div
//                 animate={{ opacity: [0.5, 1, 0.5] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="text-sm text-gray-500 uppercase tracking-widest"
//               >
//                 {!imagesLoaded ? (
//                   <span>Loading Images... {Math.round(progress)}%</span>
//                 ) : !minimumTimeMet ? (
//                   <span>Almost Ready...</span>
//                 ) : (
//                   <span>Welcome!</span>
//                 )}
//               </motion.div>
//             </motion.div>

//             {/* Decorative Line */}
//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ delay: 1.2, duration: 0.8 }}
//               className="w-32 h-px bg-black mx-auto mt-8"
//             />
//           </div>

//           {/* Sparkle Effects */}
//           <div className="absolute inset-0 pointer-events-none">
//             {[...Array(10)].map((_, i) => (
//               <motion.div
//                 key={`sparkle-${i}`}
//                 className="absolute text-2xl"
//                 style={{
//                   left: `${10 + i * 10}%`,
//                   top: `${20 + (i % 3) * 30}%`,
//                 }}
//                 animate={{
//                   scale: [0, 1, 0],
//                   rotate: [0, 180, 360],
//                   opacity: [0, 1, 0],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   delay: i * 0.3,
//                   ease: 'easeInOut',
//                 }}
//               >
//                 ✨
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// export default WeddingLoadingScreen;