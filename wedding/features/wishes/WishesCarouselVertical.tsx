import React, { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import autoScroll from 'embla-carousel-auto-scroll';
import { Heart } from 'lucide-react';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface WishesCarouselProps {
  wishes: Wish[];
}

export default function WishesCarousel({ wishes }: WishesCarouselProps) {
  const validWishes = Array.isArray(wishes) ? wishes : [];
  if (validWishes.length === 0) return null;

  // create plugin instance with correct options per docs
  const autoScrollPlugin = useRef(
    autoScroll({
      speed: 0.5, // reduced speed (1-10 recommended, lower = slower)
      stopOnInteraction: true, // pause on user interaction
      stopOnMouseEnter: true, // pause on hover
      playOnInit: true, // start auto-scroll on init
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      dragFree: false,
      containScroll: 'trimSnaps' 
    },
    [autoScrollPlugin.current]
  );

  // manually resume on mouse/touch leave for smoother control
  const handleMouseLeave = () => {
    try {
      autoScrollPlugin.current.play();
    } catch (e) {
      console.debug('Resume play failed:', e);
    }
  };

  const handleTouchEnd = () => {
    try {
      autoScrollPlugin.current.play();
    } catch (e) {
      console.debug('Resume play failed:', e);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-0 bg-gray-50 overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black mx-auto mb-3 sm:mb-4 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif mb-2 sm:mb-3 md:mb-4 text-black">
            Wedding Wishes
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Messages from our loved ones
          </p>
        </div>

        {/* Embla carousel */}
        <div
          className="embla overflow-hidden"
          onMouseLeave={handleMouseLeave}
          onTouchEnd={handleTouchEnd}
        >
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container flex gap-4 px-4 sm:px-6 md:px-8">
              {validWishes.map((wish, index) => (
                <div
                  key={`${wish.id}-${index}`}
                  className="embla__slide flex-shrink-0"
                  style={{ minWidth: '280px' }}
                >
                  <ModernCard wish={wish} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 px-4">
          <span className="hidden sm:inline">Hover to pause</span>
          <span className="sm:hidden">Touch to pause</span>
          {' • '}Auto-scrolling
        </div> */}
      </div>

      <style jsx>{`
        .embla {
          width: 100%;
        }
        .embla__viewport {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          /* allow variable widths via card minWidth */
        }
        /* hide scrollbars */
        .embla::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function ModernCard({ wish }: { wish: Wish }) {
  return (
    <div
      className="
        bg-white
        border border-gray-200
        p-6 md:p-8
        transition-all duration-300
        hover:border-black
        hover:shadow-lg
        group
        relative
        overflow-hidden
        rounded
      "
      style={{ width: '100%', maxWidth: 420 }}
    >
      <div className="mb-6">
        <p className="text-gray-800 text-sm md:text-base leading-relaxed min-h-[80px] italic">
          {wish.message}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="font-sans text-base md:text-lg text-black font-medium tracking-tight">
            {wish.name}
          </p>
          <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-1">
            {new Date(wish.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}