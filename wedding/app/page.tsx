'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Heart, Calendar, Clock, MapPin, Mail, Phone, Palette, Quote, CheckCircle } from 'lucide-react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { weddingConfig } from './config/wedding.config';
import { useCountdown } from './hooks/useCountdown';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useRSVPForm } from '@/features/rsvp/useRSVPForm';
import { RSVPFormData, Countdown, Venue } from './types';
import WishesCarousel from '@/features/wishes/WishesCarouselVertical';
import dynamic from 'next/dynamic';
import { useImagePreloader } from '@/features/hooks/useImagePreloader';

const SECTIONS = ['home', 'schedule', 'story', 'gallery', 'details', 'colors', 'rsvp'] as const;
type Section = typeof SECTIONS[number];

const WeddingInvitationWithSealBreak = dynamic(
  () => import('./components/WeddingIntroWithSwipe').then(mod => ({ 
    default: mod.WeddingLoadingScreen
  })),
  { ssr: false }
);


export default function WeddingWebsite() {
  const countdown = useCountdown(weddingConfig.date);
  const { activeSection, scrollToSection } = useScrollSpy([...SECTIONS]);
  const [wishes, setWishes] = useState([]);
  const rsvp = useRSVPForm();
  const [isLoading, setIsLoading] = useState(true);
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;

  const imagesToPreload = [
    // Hero background
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1763569733/144_okbz4b.jpg`,
    
    // Gallery images
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Wedding_ukaslz.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Real_Propose_t5ibmm.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Disney_b2iols.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Aurora_l2aey7.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_600,h_1000/v1764786809/Phd_dm6qwb.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_1200,h_1600/v1764786809/Bachelor_jr3pwr.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Malaga_avofam.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Amsterdam_s7rh3e.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Snow_aakllw.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Piggy_q3bkka.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Paris_oqbck6.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/LieDown_kgixoc.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_face,w_1200,h_1200/v1764786809/Start_Second_sgscgt.jpg`,
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Start_jhxvxd.jpg`,
    
    // Loading screen icon
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1763569733/Icon_pnlk8u.jpg`,
  ];

    // Use the image preloader hook
  const {
    isComplete,
    progress,
    loadedCount,
    totalCount,
    imagesLoaded,
    minimumTimeMet,
  } = useImagePreloader(imagesToPreload, {
    minimumLoadTime: 3000, // Show loading screen for at least 3 seconds
  });

  useEffect(() => {
    async function fetchWishes() {
      try {
        const response = await fetch('/api/wishes');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setWishes(data || []);
      } catch (error) {
        console.error('Failed to fetch wishes:', error);
        setWishes([]);
      }
    }
    fetchWishes();
  }, []);

  // if (isLoading) {
  //   return (
  //     <WeddingInvitationWithSealBreak
  //       coupleNames={weddingConfig.couple}
  //       weddingDate={weddingConfig.date}
  //       onLoadComplete={() => {
  //         setIsLoading(false);
  //       }}        
  //       minimumLoadTime={5000} // 3 seconds minimum
  //     />
  //   );
  // }
  if (isLoading) {
    return (
      <WeddingInvitationWithSealBreak
        coupleNames={weddingConfig.couple}
        weddingDate={weddingConfig.date}
        progress={progress}
        isComplete={isComplete}
        imagesLoaded={imagesLoaded}
        minimumTimeMet={minimumTimeMet}
        onLoadComplete={() => setIsLoading(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero
        couple={weddingConfig.couple}
        date={weddingConfig.date}
        venue={weddingConfig.venue}
        countdown={countdown}
        onRSVPClick={() => scrollToSection('rsvp')}
      />
      <WeddingSchedule />
      <Story />
      <Gallery />
      <WeddingDetails venue={weddingConfig.venue} date={weddingConfig.date} />
      <ColorScheme />
      <WishesCarousel wishes={wishes} />
      <SmartRSVPForm
        formData={rsvp.formData}
        onFieldChange={rsvp.updateField}
        onSubmit={rsvp.submitForm}
        onReset={rsvp.resetSubmission}  // NEW
        isSubmitting={rsvp.isSubmitting}
        isSubmitted={rsvp.isSubmitted}
        hasSubmittedBefore={rsvp.hasSubmittedBefore}  // NEW
        submittedData={rsvp.submittedData}  // NEW
        error={rsvp.error}
        deadline={weddingConfig.rsvpDeadline}
        showResetOption={false}  // Set to true for testing
      />
      <Footer couple={weddingConfig.couple} date={weddingConfig.date} />
    </div>
  );
}

// ============================================
// INTERSECTION OBSERVER HOOK
// ============================================
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView] as const;
}

// ============================================
// HERO COMPONENT WITH BACKGROUND IMAGE
// ============================================
interface HeroProps {
  couple: { name1: string; name2: string };
  date: string;
  venue: { ceremony: Venue; reception: Venue };
  countdown: Countdown;
  onRSVPClick: () => void;
}

function Hero({ couple, date, venue, countdown, onRSVPClick }: HeroProps) {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const img_public_id = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1763569733/144_okbz4b.jpg`;
  
  return (
    // <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
    // <section id="home" className="relative min-h-screen flex items-start justify-center px-4 pt-24 sm:pt-28 md:pt-32 pb-20 overflow-hidden">
    <section id="home" className="relative min-h-screen flex flex-col justify-between px-4 pt-24 sm:pt-28 md:pt-32 pb-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        { 
        <Image 
          src = {img_public_id}
          alt="Wedding background" 
          fill 
          className="object-cover"
          priority
        />
        }
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      {/* <div className="relative z-10 text-center max-w-5xl w-full text-white animate-fade-in"> */}
      <div className="relative z-10 text-center max-w-5xl w-full text-white animate-fade-in mx-auto">
        <div className="mb-8 animate-float">
          <Heart className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif mb-4 tracking-tight animate-slide-up">
          {couple.name1}
          <span className="block text-2xl sm:text-4xl md:text-5xl my-3">&</span>
          {couple.name2}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-2 md:mb-3 font-light animate-slide-up animation-delay-200">
          are getting married!
        </p>
        <p className="text-lg sm:text-xl md:text-2xl mb-2 md:mb-3 font-light animate-slide-up animation-delay-200">
          YOU ARE CORDIALLY INVITED.
        </p>
        {/* Countdown */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 mb-8 md:mb-12 max-w-3xl mx-auto animate-slide-up animation-delay-400">
          {Object.entries(countdown).map(([unit, value], index) => (
            <div 
              key={unit} 
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg p-3 sm:p-4 md:p-6 animate-scale-in"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{value}</div>
              <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider mt-1 md:mt-2 text-white/80">{unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center max-w-5xl w-full text-white mx-auto space-y-6 sm:space-y-8">
        {/* <div className="space-y-2 mb-8 md:mb-12 text-sm sm:text-base md:text-lg animate-slide-up animation-delay-1000"> */}
        <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg animate-slide-up animation-delay-1000">
        {/* <div className="space-y-2 mb-8 md:mb-12 mt-40 sm:mt-38 md:mt-46 text-sm sm:text-base md:text-lg animate-slide-up animation-delay-1000"> */}
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          {/* <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{venue.ceremony.time.split(' - ')[0]}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{venue.ceremony.name}</span>
          </div> */}
        </div>

        <button
          onClick={onRSVPClick}
          className="bg-white text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg animate-slide-up animation-delay-1200 hover:scale-105"
        >
          RSVP Now
        </button>
        <div className="flex flex-col items-center gap-2 animate-bounce pt-4">
          <span className="text-xs sm:text-sm">Scroll Down</span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white"> */}
      {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-scroll"></div>
          </div>
        </div>
      </div> */}
    </section>
  );
}

// ============================================
// MUI TIMELINE WITH SCROLL ANIMATION
// ============================================
function WeddingSchedule() {
  const [ref, isInView] = useInView();
  
  const schedule = [
    { time: '6:00 PM', event: 'Guest Arrival', description: 'Guests are seated; light instrumental or love songs playing', icon: '🎉' },
    { time: '6:10 PM', event: 'Groom\'s Entrance', description: 'Groom walks down the aisle', icon: '🤵' },
    { time: '6:15 PM', event: 'Bride\'s Entrance', description: 'Bride walks down the aisle', icon: '👰' },
    { time: '6:20 PM', event: 'Opening Speech', description: 'Welcome speech', icon: '🎙️' },
    { time: '6:30 PM', event: 'Cake Cutting Ceremony', description: 'Groom and Bride cuts the cake together', icon: '🎂' },
    { time: '6:45 PM', event: 'Friend\'s Speeches', description: 'Groom and Bride\'s friends give short speech', icon: '🗣️' },
    { time: '7:00 PM', event: 'Dinner', description: 'Guests enjoy dinner', icon: '🍽️' },
    { time: '8:00 PM', event: 'Bouqet Toss', description: 'Bride toss bouqet', icon: '💐' },
    { time: '8:20 PM', event: 'Last Dance', description: 'Dance floor all night', icon: '💃' }
  ];

  return (
    <section id="schedule" className="py-16 sm:py-20 md:py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-4 text-black">
            Wedding Day Schedule
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">Plan your day with us</p>
        </div>
        
        {/* MUI Timeline with Animation */}
        <div ref={ref}>
          <Timeline position="alternate">
            {schedule.map((item, index) => (
              <TimelineItem 
                key={index}
                className={`transition-all duration-700 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <TimelineOppositeContent 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                    fontWeight: 600,
                    color: 'text.secondary'
                  }}
                >
                  {item.time}
                </TimelineOppositeContent>
                
                <TimelineSeparator>
                  <TimelineDot 
                    sx={{ 
                      bgcolor: 'black',
                      width: { xs: 50, sm: 60, md: 70 },
                      height: { xs: 50, sm: 60, md: 70 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      border: '3px solid white',
                      boxShadow: 3
                    }}
                  >
                    {item.icon}
                  </TimelineDot>
                  {index < schedule.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: 'black', height: '60px' }} />
                  )}
                </TimelineSeparator>
                
                <TimelineContent>
                  <div className="bg-white border-2 border-black p-4 sm:p-5 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 text-black">
                      {item.event}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </section>
  );
}

// ============================================
// STORY COMPONENT
// ============================================
function Story() {
  const stories = [
    {
      title: "Our Journey",
      content: `Fourteen years is a long time to share a life, yet somehow it feels like both a blink and a lifetime.
We grew up side by side, two people learning not only who we were, but who we could become together.
There were seasons of ease and seasons that asked more of us than we expected.
There were days filled with laughter, and others where we had to choose patience, softness, and understanding all over again.
But in every chapter, we kept choosing each other.
As we step into this new chapter, we bring with us everything those years taught us,
a love strengthened by time, and a partnership we’re still proud to grow.`
    },
  ];

  return (
    <section id="story" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-12 md:mb-16">
          Our Love Story
        </h2>
        
        <div className="space-y-8 md:space-y-12">
          {stories.map((story, index) => (
            <StoryCard key={story.title} story={story} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCard({ story, index }: { story: any; index: number }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`border-l-4 border-black pl-6 md:pl-8 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <h3 className="text-2xl sm:text-3xl font-serif text-black mb-3 md:mb-4">{story.title}</h3>
      <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{story.content}</p>
    </div>
  );
}

// ============================================
// MUI MASONRY GALLERY WITH LAZY LOADING
// ============================================
function Gallery() {
  const [ref, isInView] = useInView();
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const img_public_id = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1763569733/144_okbz4b.jpg`;

  const images = [
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Wedding_ukaslz.jpg`, title: 'Engagement Day', cols: 2, rows: 2 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Real_Propose_t5ibmm.jpg`, title: 'Propose at Kyoto', cols: 1, rows: 2 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Disney_b2iols.jpg`, title: 'Disney', cols: 1, rows: 2 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Aurora_l2aey7.jpg`, title: 'Aurora Hunting', cols: 1, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_600,h_1000/v1764786809/Phd_dm6qwb.jpg`, title: 'Phd Ceremony', cols: 1, rows: 2 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_auto,w_1200,h_1600/v1764786809/Bachelor_jr3pwr.jpg`, title: 'Bachelor', cols: 1, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Malaga_avofam.jpg`, title: 'Malaga Cruise', cols: 2, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Amsterdam_s7rh3e.jpg`, title: 'Amsterdam', cols: 1, rows: 2 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Snow_aakllw.jpg`, title: 'Barcelona', cols: 1, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Piggy_q3bkka.jpg`, title: 'Piggy', cols: 1, rows: 2 },
    // { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Start_Second_sgscgt.jpg`, title: 'Bangkok', cols: 1, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Paris_oqbck6.jpg`, title: 'Italy', cols: 1, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/LieDown_kgixoc.jpg`, title: 'Italy', cols: 1, rows: 2 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_face,w_1200,h_1200/v1764786809/Start_Second_sgscgt.jpg`, title: 'Bangkok', cols: 1, rows: 1 },
    { src: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1764786809/Start_jhxvxd.jpg`, title: 'Very Beginning', cols: 1, rows: 1 },
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 md:py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-3 md:mb-4">
            Our Moments
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">A glimpse of our journey together</p>
        </div>

        {/* Masonry Grid with Individual Animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((item, index) => (
            <GalleryImage 
              key={index}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// INDIVIDUAL GALLERY IMAGE WITH SCROLL ANIMATION
// ============================================
interface GalleryImageProps {
  item: {
    src: string;
    title: string;
    cols: number;
    rows: number;
  };
  index: number;
}

function GalleryImage({ item, index }: GalleryImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the image is visible
        rootMargin: '50px', // Start animation 50px before entering viewport
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
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden group cursor-pointer rounded-md hover:border-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
      }`}
      style={{
        gridColumn: `span ${item.cols}`,
        gridRow: `span ${item.rows}`,
        transitionDelay: `${index * 50}ms`, // Stagger animation based on index
      }}
    >
      <img
        src={item.src}
        alt={item.title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-center font-serif text-sm sm:text-base">{item.title}</p>
      </div>
    </div>
  );
}

// ============================================
// WEDDING DETAILS
// ============================================
interface WeddingDetailsProps {
  venue: { ceremony: Venue; reception: Venue };
  date: string;
}

function WeddingDetails({ venue,date }: WeddingDetailsProps) {
  const [ref, isInView] = useInView();
  
  // Only show ceremony (removed reception)
  const { ceremony } = venue;
  
  // Function to open Google Maps
  const openGoogleMaps = () => {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(ceremony.name);
    // Google Maps URL - works on both mobile and desktop
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <section id="details" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-12 md:mb-16">
          Event Details
        </h2>

        <div ref={ref}>
          <div
            className={`border-2 border-black p-6 sm:p-8 md:p-10 bg-white transition-all duration-700 hover:shadow-xl ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-6 md:mb-8">
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-black mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-serif text-black">Ceremony</h3>
            </div>
            
            <div className="space-y-4 md:space-y-6 text-black">
              <div className="flex items-start gap-3 md:gap-4">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-base md:text-lg mb-1">Date</div>
                  <div className="text-gray-700 text-sm md:text-base">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
              {/* Time */}
              <div className="flex items-start gap-3 md:gap-4">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-base md:text-lg mb-1">Time</div>
                  <div className="text-gray-700 text-sm md:text-base">{ceremony.time}</div>
                </div>
              </div>
              
              {/* Location with Google Maps Link */}
              <div className="flex items-start gap-3 md:gap-4">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-base md:text-lg mb-1">Location</div>
                  <div className="text-gray-700 text-sm md:text-base">{ceremony.name}</div>
                  <div className="text-gray-600 text-xs md:text-sm mt-1">{ceremony.address}</div>
                </div>
              </div>
              
              {/* Get Directions Button */}
              <div className="pt-4">
                <button
                  onClick={openGoogleMaps}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm md:text-base font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  Get Directions on Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div 
          className={`mt-12 md:mt-16 border-2 border-black p-8 sm:p-10 md:p-16 bg-white transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <h3 className="text-2xl sm:text-3xl font-serif text-center text-black mb-4 md:mb-6">What to Expect</h3>
          <p className="text-gray-700 text-center leading-relaxed text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            Join us for an unforgettable evening of love, laughter, and new beginnings as we exchange our vows 
            and celebrate with family and friends. The day will be filled with heartfelt moments, delicious food, 
            and dancing. Your presence means the world to us.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// COLOR SCHEME WITH CIRCLES
// ============================================
function ColorScheme() {
  const [ref, isInView] = useInView();
  
  const colorPalette = [
    { name: 'Desert Sand', hex: '#e6ccb2', description: 'Formal elegance' },
    { name: 'Soft Blossm', hex: '#d7a6b3', description: 'Classic purity' },
    { name: 'Muted Olive', hex: '#b5c99a', description: 'Sophisticated' },
    { name: 'Wisteria Blue', hex: '#81a4cd', description: 'Accent shine' },
  ];

  return (
    <section id="colors" className="py-16 sm:py-20 md:py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <Palette className="w-10 h-10 md:w-12 md:h-12 text-black mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-4 text-black">
            Dress Code
          </h2>
          {/* <p className="text-gray-600 text-base sm:text-lg">Black Tie Optional</p> */}
        </div>

        {/* Color Circles with Animation */}
        <div ref={ref} className="mb-12 md:mb-16">
          <h3 className="text-2xl sm:text-3xl font-serif text-center mb-8 md:mb-12 text-black">Our Color Palette</h3>
          <div className="flex justify-center items-center gap-6 md:gap-12 flex-wrap">
            {colorPalette.map((color, index) => (
              <div
                key={color.name}
                className={`text-center transition-all duration-700 ${
                  isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative inline-block">
                  <div
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-2xl border-4 border-white mb-3 md:mb-4 hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  {color.hex === '#FFFFFF' && (
                    <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
                <h4 className="font-semibold text-base md:text-lg text-black">{color.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{color.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DressCodeCard({ title, index, isInView, children }: { title: string; index: number; isInView: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`relative bg-white p-6 sm:p-8 md:p-10 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Decorative Double Border */}
      <div className="absolute inset-0 border-4 border-black rounded-lg"></div>
      <div className="absolute -inset-2 border-2 border-gray-300 rounded-lg"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl sm:text-3xl font-serif mb-4 md:mb-6 text-black">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ============================================
// RSVP FORM
// ============================================
// interface RSVPFormProps {
//   formData: RSVPFormData;
//   onFieldChange: (field: keyof RSVPFormData, value: string) => void;
//   onSubmit: () => void;
//   isSubmitting: boolean;
//   isSubmitted: boolean;
//   error: string | null;
//   deadline: string;
// }

// function RSVPForm({ formData, onFieldChange, onSubmit, isSubmitting, isSubmitted, error, deadline }: RSVPFormProps) {
//   const [ref, isInView] = useInView();

//   return (
//     <section id="rsvp" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
//       <div className="max-w-2xl mx-auto">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-3 md:mb-4">RSVP</h2>
//         <p className="text-center text-gray-600 mb-12 md:mb-16 text-base sm:text-lg">Please respond by {deadline}</p>

//         {isSubmitted && (
//           <div className="bg-black text-white px-6 py-4 rounded-lg mb-8 text-center animate-slide-down">
//             Thank you for your RSVP! We can't wait to celebrate with you! 🎉
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border-2 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-8 text-center">
//             {error}
//           </div>
//         )}

//         <div
//           ref={ref}
//           className={`border-2 border-black p-6 sm:p-8 md:p-10 bg-white transition-all duration-700 ${
//             isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//           }`}
//         >
//           <div className="space-y-5 md:space-y-6">
//             <div>
//               <label htmlFor="name" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Full Name *</label>
//               <input id="name" type="text" value={formData.name} onChange={(e) => onFieldChange('name', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" placeholder="John Doe" />
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Email *</label>
//               <input id="email" type="email" value={formData.email} onChange={(e) => onFieldChange('email', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" placeholder="john@example.com" />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Phone</label>
//               <input id="phone" type="tel" value={formData.phone} onChange={(e) => onFieldChange('phone', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" placeholder="+1 (555) 123-4567" />
//             </div>
//             <div>
//               <label htmlFor="guests" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Number of Guests *</label>
//               <select id="guests" value={formData.guests} onChange={(e) => onFieldChange('guests', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black">
//                 {['1', '2', '3', '4', '5+'].map(n => <option key={n} value={n}>{n} Guest{n !== '1' ? 's' : ''}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block text-black font-semibold mb-3 text-sm sm:text-base md:text-lg">Will you be attending? *</label>
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
//                 {['yes', 'no'].map(val => (
//                   <label key={val} className="flex items-center gap-2 md:gap-3 cursor-pointer">
//                     <input type="radio" name="attending" value={val} checked={formData.attending === val} onChange={(e) => onFieldChange('attending', e.target.value)} disabled={isSubmitting} className="w-4 h-4 sm:w-5 sm:h-5" />
//                     <span className="text-black text-sm sm:text-base md:text-lg">{val === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label htmlFor="message" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Leave us a wish</label>
//               <textarea id="message" value={formData.message} onChange={(e) => onFieldChange('message', e.target.value)} disabled={isSubmitting} rows={4} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" placeholder="Any allergies, dietary restrictions, or special requests..." />
//             </div>
//             <button onClick={onSubmit} disabled={isSubmitting} className="w-full bg-black text-white py-3 md:py-4 text-base sm:text-lg font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
//               {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

interface SmartRSVPFormProps {
  formData: RSVPFormData;
  onFieldChange: (field: keyof RSVPFormData, value: string) => void;
  onSubmit: () => void;
  onReset?: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  hasSubmittedBefore: boolean;
  submittedData: RSVPFormData | null;
  error: string | null;
  deadline: string;
  showResetOption?: boolean; // Allow admin/testing to reset
}

function SmartRSVPForm({ 
  formData, 
  onFieldChange, 
  onSubmit, 
  onReset,
  isSubmitting, 
  isSubmitted,
  hasSubmittedBefore,
  submittedData,
  error, 
  deadline,
  showResetOption = false
}: SmartRSVPFormProps) {

  // Show thank you message if already submitted
  if (hasSubmittedBefore && submittedData) {
    return (
      <section id="rsvp" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-3 md:mb-4">
            Thank You!
          </h2>
          <p className="text-center text-gray-600 mb-12 md:mb-16 text-base sm:text-lg">
            Your RSVP has been received
          </p>

          {/* Thank You Card */}
          <div className="border-2 border-black p-6 sm:p-8 md:p-10 bg-white shadow-lg">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif text-black mb-4">
                We've Got Your RSVP!
              </h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Thank you for confirming your attendance, <strong>{submittedData.name}</strong>! 
                We're so excited to celebrate with you.
              </p>
            </div>

            {/* Submission Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-lg text-black mb-4">Your RSVP Details:</h4>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-black font-medium">{submittedData.name}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-black font-medium">{submittedData.email}</span>
                </div> */}
                {submittedData.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-black font-medium">{submittedData.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="text-black font-medium">{submittedData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attending:</span>
                  <span className={`font-medium ${submittedData.attending === 'yes' ? 'text-green-600' : 'text-red-600'}`}>
                    {submittedData.attending === 'yes' ? '✓ Yes, I will attend' : '✗ Cannot attend'}
                  </span>
                </div>
                {submittedData.message && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 block mb-2">Your Message:</span>
                    <p className="text-black italic">{submittedData.message}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center text-gray-600 text-sm sm:text-base mb-6">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p>We can't wait to see you on our special day!</p>
              <p className="mt-2 text-xs text-gray-500">
                Need to make changes? Please contact us directly.
              </p>
            </div>

            {/* Reset Button (for testing or if user wants to change RSVP) */}
            {showResetOption && onReset && (
              <div className="text-center pt-6 border-t border-gray-200">
                <button
                  onClick={onReset}
                  className="text-sm text-gray-500 hover:text-black underline"
                >
                  Submit a new RSVP (Testing Only)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Show the form if not yet submitted
  return (
    <section id="rsvp" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-3 md:mb-4">
          RSVP
        </h2>
        <p className="text-center text-gray-600 mb-12 md:mb-16 text-base sm:text-lg">
          Please respond by {deadline}
        </p>

        {/* Success Message (shown briefly after submission) */}
        {isSubmitted && !hasSubmittedBefore && (
          <div className="bg-black text-white px-6 py-4 rounded-lg mb-8 text-center animate-slide-down">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            Thank you for your RSVP! We can't wait to celebrate with you! 🎉
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {/* RSVP Form */}
        <div className="border-2 border-black p-6 sm:p-8 md:p-10 bg-white">
          <div className="space-y-5 md:space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">
                Full Name *
              </label>
              <input 
                id="name" 
                type="text" 
                value={formData.name} 
                onChange={(e) => onFieldChange('name', e.target.value)} 
                disabled={isSubmitting} 
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" 
                placeholder="John Doe" 
                required
              />
            </div>

            {/* Email */}
            {/* <div>
              <label htmlFor="email" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">
                Email *
              </label>
              <input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => onFieldChange('email', e.target.value)} 
                disabled={isSubmitting} 
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" 
                placeholder="john@example.com" 
                required
              />
            </div> */}

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">
                Phone *
              </label>
              <input 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => onFieldChange('phone', e.target.value)} 
                disabled={isSubmitting} 
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" 
                placeholder="+1 (555) 123-4567" 
                required
              />
            </div>

            {/* Number of Guests */}
            <div>
              <label htmlFor="guests" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">
                Number of Guests *
              </label>
              <select 
                id="guests" 
                value={formData.guests} 
                onChange={(e) => onFieldChange('guests', e.target.value)} 
                disabled={isSubmitting} 
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black"
              >
                {['1', '2', '3', '4', '5+'].map(n => (
                  <option key={n} value={n}>{n} Guest{n !== '1' ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Attending */}
            <div>
              <label className="block text-black font-semibold mb-3 text-sm sm:text-base md:text-lg">
                Will you be attending? *
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                {['yes', 'no'].map(val => (
                  <label key={val} className="flex items-center gap-2 md:gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="attending" 
                      value={val} 
                      checked={formData.attending === val} 
                      onChange={(e) => onFieldChange('attending', e.target.value)} 
                      disabled={isSubmitting} 
                      className="w-4 h-4 sm:w-5 sm:h-5" 
                    />
                    <span className="text-black text-sm sm:text-base md:text-lg">
                      {val === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">
                Leave us a wish or note
              </label>
              <textarea 
                id="message" 
                value={formData.message} 
                onChange={(e) => onFieldChange('message', e.target.value)} 
                disabled={isSubmitting} 
                rows={4} 
                className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base text-black" 
                placeholder="You can leave any notes here." 
              />
            </div>

            {/* Submit Button */}
            <button 
              onClick={onSubmit} 
              disabled={isSubmitting} 
              className="w-full bg-black text-white py-3 md:py-4 text-base sm:text-lg font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
interface FooterProps {
  couple: { name1: string; name2: string };
  date: string;
}

function Footer({ couple, date }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12 md:py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Heart className="w-10 h-10 md:w-12 md:h-12 text-white mx-auto mb-4 md:mb-6" />
        <h3 className="text-3xl sm:text-4xl font-serif mb-3 md:mb-4">{couple.name1} & {couple.name2}</h3>
        <p className="text-gray-400 mb-6 md:mb-8 text-base sm:text-lg">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        {/* <div className="flex justify-center gap-6 md:gap-8 mb-6 md:mb-8">
          <button onClick={() => window.location.href = 'mailto:wedding@example.com'} className="hover:text-gray-400 transition" aria-label="Send email">
            <Mail className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          <button onClick={() => window.location.href = 'tel:+1234567890'} className="hover:text-gray-400 transition" aria-label="Call us">
            <Phone className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div> */}
        <p className="text-sm text-gray-500">We can't wait to celebrate with you ♥</p>
      </div>
    </footer>
  );
}