'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Heart, Quote } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface WishesCarouselProps {
  wishes: Wish[];
}

export function WishesCarousel({ wishes }: WishesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Safety check: ensure wishes is a valid array
  const validWishes = Array.isArray(wishes) ? wishes : [];

  // useEffect(() => {
  //   const scrollContainer = scrollRef.current;
  //   if (!scrollContainer || isPaused || validWishes.length === 0) return;

  //   let animationFrameId: number;
  //   let scrollPosition = 0;

  //   const scroll = () => {
  //     // Smooth scrolling speed - adjust this value (0.3 to 1.5 recommended)
  //     scrollPosition += 0.5;
      
  //     // Reset to beginning when reaching halfway (seamless loop)
  //     if (scrollPosition >= scrollContainer.scrollWidth / 2) {
  //       scrollPosition = 0;
  //     }
      
  //     scrollContainer.scrollLeft = scrollPosition;
  //     animationFrameId = requestAnimationFrame(scroll);
  //   };

  //   animationFrameId = requestAnimationFrame(scroll);

  //   return () => {
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //   };
  // }, [isPaused, validWishes.length]);
    useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || validWishes.length === 0) return;

    let rafId: number | null = null;
    const speed = 0.6; // pixels per frame — tweak as needed

    // compute single copy width and single item width (including gap) for alignment
    const computeSizes = () => {
      const singleWidth = scrollContainer.scrollWidth / 3;
      const firstItem = scrollContainer.firstElementChild as HTMLElement | null;
      let itemFullWidth = 0;
      let gap = 0;
      if (firstItem) {
        const rect = firstItem.getBoundingClientRect();
        itemFullWidth = rect.width;
        const style = window.getComputedStyle(scrollContainer);
        gap = parseFloat(style.columnGap || style.gap || '0') || 0;
        itemFullWidth += gap;
      }
      return { singleWidth, itemFullWidth, gap };
    };

    // start in the middle copy so looping is seamless
    const initPosition = () => {
      const { singleWidth } = computeSizes();
      if (singleWidth) scrollContainer.scrollLeft = singleWidth;
    };
    initPosition();

    const step = () => {
      if (!scrollContainer || isPaused) {
        rafId = null;
        return;
      }

      // advance
      scrollContainer.scrollLeft += speed;

      const { singleWidth, itemFullWidth } = computeSizes();

      // when we move past the 2nd copy, jump back one copy for seamless loop
      if (singleWidth && scrollContainer.scrollLeft >= singleWidth * 2) {
        // preserve offset within the item so alignment remains smooth
        const offsetWithinItem = scrollContainer.scrollLeft % itemFullWidth;
        scrollContainer.scrollLeft = scrollContainer.scrollLeft - singleWidth;

        // reapply offsetWithinItem (keeps relative position inside card)
        // guard in case itemFullWidth is 0
        if (itemFullWidth) {
          scrollContainer.scrollLeft = Math.max(0, scrollContainer.scrollLeft - (scrollContainer.scrollLeft % itemFullWidth) + offsetWithinItem);
        }
      }

      rafId = requestAnimationFrame(step);
    };

    if (!isPaused) rafId = requestAnimationFrame(step);

    const onResize = () => initPosition();
    window.addEventListener('resize', onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [isPaused, validWishes.length]);

  // Triple the wishes for ultra-smooth seamless loop
  const duplicatedWishes = [...validWishes, ...validWishes, ...validWishes];

  // Don't render if no wishes
  if (validWishes.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-0 bg-gray-50 overflow-hidden">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black mx-auto mb-3 sm:mb-4 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-2 sm:mb-3 md:mb-4 text-black">
            Wedding Wishes
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Messages from our loved ones
          </p>
        </div>

        {/* Scrolling Container */}
        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-hidden scroll-smooth px-4 sm:px-6 md:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {duplicatedWishes.map((wish, index) => (
            // <WishCard key={`${wish.id}-${index}`} wish={wish} />
            // <LuxuryCard key={`luxury-${wish.id}-${index}`} wish={wish} />
            <ModernCard key={`modern-${wish.id}-${index}`} wish={wish} />
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 px-4">
          <span className="hidden sm:inline">Hover to pause</span>
          <span className="sm:hidden">Touch to pause</span>
          {' • '}Auto-scrolling
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function WishCard({ wish }: { wish: Wish }) {
  return (
    <div 
      className="
        flex-shrink-0 
        w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px]
        bg-white 
        border-2 border-black 
        p-5 sm:p-6 md:p-7 lg:p-8
        transition-all duration-300 
        hover:shadow-2xl hover:scale-105 hover:border-4
        group
        cursor-pointer
      "
    >
      {/* Quote Icon */}
      <div className="mb-3 sm:mb-4 opacity-30 group-hover:opacity-50 transition-opacity">
        <Quote className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" />
      </div>

      {/* Message */}
      <p className="
        text-gray-700 
        text-xs sm:text-sm md:text-base 
        leading-relaxed 
        mb-5 sm:mb-6 
        min-h-[60px] sm:min-h-[70px] md:min-h-[80px]
        italic
        line-clamp-4
      ">
        "{wish.message}"
      </p>

      {/* Divider */}
      <div className="border-t-2 border-black mb-3 sm:mb-4 group-hover:border-gray-400 transition-colors"></div>

      {/* Name and Date */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="
            font-serif 
            text-base sm:text-lg md:text-xl 
            text-black 
            font-semibold
            truncate
            group-hover:text-gray-700
            transition-colors
          ">
            {wish.name}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            {new Date(wish.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        <Heart className="
          w-4 h-4 sm:w-5 sm:h-5 
          text-black 
          fill-black 
          group-hover:fill-red-500 
          group-hover:text-red-500
          transition-all
          flex-shrink-0
          ml-2
        " />
      </div>
    </div>
  );
}

function LuxuryCard({ wish }: { wish: Wish }) {
  return (
    <div 
      className="
        flex-shrink-0 
        w-[300px] sm:w-[340px] md:w-[380px] lg:w-[420px]
        bg-gradient-to-br from-gray-50 to-white
        border border-gray-200
        p-8 md:p-10
        transition-all duration-500
        hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
        hover:border-gray-300
        group
        relative
      "
    >
      {/* Decorative Corner Elements */}
      <div className="absolute top-4 right-4 w-12 h-12 opacity-10">
        <div className="absolute top-0 right-0 w-full border-t-2 border-r-2 border-black"></div>
        <div className="absolute bottom-0 left-0 w-full border-b-2 border-l-2 border-black"></div>
      </div>

      {/* Center Alignment Container */}
      <div className="flex flex-col h-full justify-between min-h-[280px]">
        {/* Message */}
        <div className="flex-1 flex items-center">
          <p className="
            text-gray-700 
            text-sm md:text-base 
            leading-relaxed
            text-center
            font-light
            tracking-wide
            italic
          ">
            "{wish.message}"
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center my-6">
          <div className="w-2 h-2 bg-black transform rotate-45 mx-2"></div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
          <div className="w-2 h-2 bg-black transform rotate-45 mx-2"></div>
        </div>

        {/* Author */}
        <div className="text-center">
          <p className="font-serif text-lg md:text-xl text-black tracking-wide mb-1">
            {wish.name}
          </p>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">
            {new Date(wish.createdAt).toLocaleDateString('en-US', { 
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}

function ModernCard({ wish }: { wish: Wish }) {
  return (
    <div 
      className="
        flex-shrink-0 
        w-[300px] sm:w-[340px] md:w-[380px] lg:w-[420px]
        bg-white
        border border-gray-200
        p-8 md:p-10
        transition-all duration-300
        hover:border-black
        hover:shadow-lg
        group
        relative
        overflow-hidden
      "
    >
      {/* Sliding Accent Bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>

      {/* Message */}
      <div className="mb-8">
        <p className="
          text-gray-800 
          text-sm md:text-base 
          leading-relaxed
          min-h-[80px]
          font-light
          italic
        ">
          {wish.message}
        </p>
      </div>

      {/* Author Section */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div>
          <p className="font-sans text-base md:text-lg text-black font-medium tracking-tight">
            {wish.name}
          </p>
          <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-1">
            {new Date(wish.createdAt).toLocaleDateString('en-US', { 
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Geometric Icon */}
        {/* <div className="w-10 h-10 border border-gray-300 flex items-center justify-center group-hover:border-black transition-colors">
          <div className="w-3 h-3 bg-black transform rotate-45"></div>
        </div> */}
      </div>
    </div>
  );
}


export default WishesCarousel;