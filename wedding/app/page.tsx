'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Heart, Calendar, Clock, MapPin, Mail, Phone, Palette } from 'lucide-react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { weddingConfig } from './config/wedding.config';
import { useCountdown } from './hooks/useCountdown';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useRSVPForm } from '@/features/rsvp/useRSVPForm';
import { RSVPFormData, Countdown, Venue } from './types';

const SECTIONS = ['home', 'schedule', 'story', 'gallery', 'details', 'colors', 'rsvp'] as const;
type Section = typeof SECTIONS[number];

export default function WeddingWebsite() {
  const countdown = useCountdown(weddingConfig.date);
  const { activeSection, scrollToSection } = useScrollSpy([...SECTIONS]);
  const rsvp = useRSVPForm();

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
      <WeddingDetails venue={weddingConfig.venue} />
      <ColorScheme />
      <RSVPForm
        formData={rsvp.formData}
        onFieldChange={rsvp.updateField}
        onSubmit={rsvp.submitForm}
        isSubmitting={rsvp.isSubmitting}
        isSubmitted={rsvp.isSubmitted}
        error={rsvp.error}
        deadline={weddingConfig.rsvpDeadline}
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
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        { 
        // <Image 
        //   src="/gallery/header.jpg" 
        //   alt="Wedding background" 
        //   fill 
        //   className="object-cover"
        //   priority
        // />
        }
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl w-full text-white animate-fade-in">
        <div className="mb-8 animate-float">
          <Heart className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif mb-4 tracking-tight animate-slide-up">
          {couple.name1}
          <span className="block text-2xl sm:text-4xl md:text-5xl my-3">&</span>
          {couple.name2}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 font-light animate-slide-up animation-delay-200">
          are getting married
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

        <div className="space-y-2 mb-8 md:mb-12 text-sm sm:text-base md:text-lg animate-slide-up animation-delay-1000">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{venue.ceremony.time.split(' - ')[0]}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{venue.ceremony.name}</span>
          </div>
        </div>

        <button
          onClick={onRSVPClick}
          className="bg-white text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg animate-slide-up animation-delay-1200 hover:scale-105"
        >
          RSVP Now
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MUI TIMELINE WITH SCROLL ANIMATION
// ============================================
function WeddingSchedule() {
  const [ref, isInView] = useInView();
  
  const schedule = [
    { time: '3:00 PM', event: 'Guest Arrival', description: 'Welcome drinks and light refreshments', icon: '🎉' },
    { time: '4:00 PM', event: 'Ceremony Begins', description: 'Please be seated by 3:45 PM', icon: '💒' },
    { time: '4:30 PM', event: 'Cocktail Hour', description: 'Mingle with guests and enjoy hors d\'oeuvres', icon: '🍸' },
    { time: '5:30 PM', event: 'Reception Entrance', description: 'Grand entrance of the newlyweds', icon: '✨' },
    { time: '6:00 PM', event: 'Dinner Service', description: 'Three-course plated dinner', icon: '🍽️' },
    { time: '7:30 PM', event: 'First Dance', description: 'Followed by parent dances', icon: '💃' },
    { time: '8:00 PM', event: 'Open Dancing', description: 'Dance the night away!', icon: '🎵' },
    { time: '10:00 PM', event: 'Cake Cutting', description: 'Sweet celebration', icon: '🎂' },
    { time: '11:00 PM', event: 'Last Dance', description: 'Thank you for celebrating with us!', icon: '🌙' }
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
      title: "How We Met",
      content: "Our story began on a beautiful spring day when fate brought us together at a mutual friend's gathering. What started as a simple conversation quickly turned into hours of laughter and connection that we'll never forget."
    },
    {
      title: "The Proposal",
      content: "Under the stars on a warm summer evening, surrounded by candles and rose petals, the question was asked and answered with tears of joy. It was a moment of pure magic that marked the beginning of our forever."
    },
    {
      title: "Our Journey",
      content: "Together we've built a life filled with adventure, love, and countless memories. From quiet mornings to exciting travels, every moment has brought us closer. Now, we're ready to embark on our greatest adventure yet - marriage."
    }
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
  
  const images = [
    { src: '/gallery/photo1.jpg', title: 'Engagement Day', cols: 2, rows: 2 },
    { src: '/gallery/photo2.jpg', title: 'Beach Vacation', cols: 1, rows: 1 },
    { src: '/gallery/photo3.jpg', title: 'First Date Spot', cols: 1, rows: 1 },
    { src: '/gallery/photo4.jpg', title: 'Hiking Adventure', cols: 1, rows: 2 },
    { src: '/gallery/photo5.jpg', title: 'City Nights', cols: 2, rows: 1 },
    { src: '/gallery/photo6.jpg', title: 'Family Gathering', cols: 1, rows: 1 },
    { src: '/gallery/photo7.jpg', title: 'Sunset Moments', cols: 1, rows: 2 },
    { src: '/gallery/photo8.jpg', title: 'Proposal Location', cols: 2, rows: 1 },
    { src: '/gallery/photo9.jpg', title: 'Dancing Together', cols: 1, rows: 1 },
    { src: '/gallery/photo10.jpg', title: 'Cozy Evenings', cols: 1, rows: 1 },
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 md:py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-black mb-3 md:mb-4">
            Our Moments
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">Capturing our journey together</p>
        </div>

        {/* MUI Masonry Image List with Animation */}
        <div ref={ref}>
          <ImageList
            variant="masonry"
            cols={3}
            gap={16}
            sx={{
              '@media (max-width: 600px)': {
                columnCount: 1,
              },
              '@media (min-width: 600px) and (max-width: 960px)': {
                columnCount: 2,
              },
            }}
          >
            {images.map((item, index) => (
              <ImageListItem 
                key={index}
                className={`transition-all duration-700 ${
                  isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-gray-200 overflow-hidden group cursor-pointer border-2 border-black hover:border-4 transition-all duration-300 aspect-square">
                  {/* Placeholder - replace with actual images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-4xl sm:text-5xl md:text-6xl mb-2">📸</div>
                      <p className="text-sm sm:text-base md:text-lg font-serif text-gray-700">{item.title}</p>
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>
              </ImageListItem>
            ))}
          </ImageList>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-500 text-xs sm:text-sm">
            📁 Add your photos to <span className="font-mono bg-gray-200 px-2 py-1 rounded text-black">public/gallery/</span> folder
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// WEDDING DETAILS
// ============================================
interface WeddingDetailsProps {
  venue: { ceremony: Venue; reception: Venue };
}

function WeddingDetails({ venue }: WeddingDetailsProps) {
  const [ref, isInView] = useInView();
  const details = [
    { title: 'Ceremony', icon: Heart, ...venue.ceremony },
    { title: 'Reception', icon: Heart, ...venue.reception }
  ];

  return (
    <section id="details" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-12 md:mb-16">
          Event Details
        </h2>

        <div ref={ref} className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {details.map(({ title, icon: Icon, name, address, time }, index) => (
            <div
              key={title}
              className={`border-2 border-black p-6 sm:p-8 md:p-10 bg-white transition-all duration-700 hover:shadow-xl ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="text-center mb-6 md:mb-8">
                <Icon className="w-10 h-10 md:w-12 md:h-12 text-black mx-auto mb-4" />
                <h3 className="text-2xl sm:text-3xl font-serif text-black">{title}</h3>
              </div>
              <div className="space-y-4 md:space-y-6 text-black">
                <div className="flex items-start gap-3 md:gap-4">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-base md:text-lg mb-1">Time</div>
                    <div className="text-gray-700 text-sm md:text-base">{time}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-black mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-base md:text-lg mb-1">Location</div>
                    <div className="text-gray-700 text-sm md:text-base">{name}</div>
                    <div className="text-gray-600 text-xs md:text-sm mt-1">{address}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    { name: 'Black', hex: '#000000', description: 'Formal elegance' },
    { name: 'White', hex: '#FFFFFF', description: 'Classic purity' },
    { name: 'Charcoal', hex: '#36454F', description: 'Sophisticated' },
    { name: 'Silver', hex: '#C0C0C0', description: 'Accent shine' },
  ];

  return (
    <section id="colors" className="py-16 sm:py-20 md:py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <Palette className="w-10 h-10 md:w-12 md:h-12 text-black mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-4 text-black">
            Dress Code
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">Black Tie Optional</p>
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

        {/* Dress Code with Decorative Border */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <DressCodeCard title="For Her" index={0} isInView={isInView}>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Floor-length gowns or cocktail dresses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Black, white, silver, or charcoal tones preferred</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Please avoid bright or neon colors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Elegant accessories in silver or crystal</span>
              </li>
            </ul>
          </DressCodeCard>

          <DressCodeCard title="For Him" index={1} isInView={isInView}>
            <ul className="space-y-3 text-gray-700 text-sm sm:text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Tuxedo or dark suit preferred</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Black, charcoal, or dark navy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Bow tie or necktie</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black mt-1">•</span>
                <span>Black leather dress shoes</span>
              </li>
            </ul>
          </DressCodeCard>
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
interface RSVPFormProps {
  formData: RSVPFormData;
  onFieldChange: (field: keyof RSVPFormData, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  deadline: string;
}

function RSVPForm({ formData, onFieldChange, onSubmit, isSubmitting, isSubmitted, error, deadline }: RSVPFormProps) {
  const [ref, isInView] = useInView();

  return (
    <section id="rsvp" className="py-16 sm:py-20 md:py-24 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center text-black mb-3 md:mb-4">RSVP</h2>
        <p className="text-center text-gray-600 mb-12 md:mb-16 text-base sm:text-lg">Please respond by {deadline}</p>

        {isSubmitted && (
          <div className="bg-black text-white px-6 py-4 rounded-lg mb-8 text-center animate-slide-down">
            Thank you for your RSVP! We can't wait to celebrate with you! 🎉
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        <div
          ref={ref}
          className={`border-2 border-black p-6 sm:p-8 md:p-10 bg-white transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="space-y-5 md:space-y-6">
            <div>
              <label htmlFor="name" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Full Name *</label>
              <input id="name" type="text" value={formData.name} onChange={(e) => onFieldChange('name', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Email *</label>
              <input id="email" type="email" value={formData.email} onChange={(e) => onFieldChange('email', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Phone</label>
              <input id="phone" type="tel" value={formData.phone} onChange={(e) => onFieldChange('phone', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label htmlFor="guests" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Number of Guests *</label>
              <select id="guests" value={formData.guests} onChange={(e) => onFieldChange('guests', e.target.value)} disabled={isSubmitting} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base">
                {['1', '2', '3', '4', '5+'].map(n => <option key={n} value={n}>{n} Guest{n !== '1' ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-black font-semibold mb-3 text-sm sm:text-base md:text-lg">Will you be attending? *</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                {['yes', 'no'].map(val => (
                  <label key={val} className="flex items-center gap-2 md:gap-3 cursor-pointer">
                    <input type="radio" name="attending" value={val} checked={formData.attending === val} onChange={(e) => onFieldChange('attending', e.target.value)} disabled={isSubmitting} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-black text-sm sm:text-base md:text-lg">{val === 'yes' ? 'Joyfully Accept' : 'Regretfully Decline'}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-black font-semibold mb-2 text-sm sm:text-base md:text-lg">Special Notes or Dietary Restrictions</label>
              <textarea id="message" value={formData.message} onChange={(e) => onFieldChange('message', e.target.value)} disabled={isSubmitting} rows={4} className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 text-sm sm:text-base" placeholder="Any allergies, dietary restrictions, or special requests..." />
            </div>
            <button onClick={onSubmit} disabled={isSubmitting} className="w-full bg-black text-white py-3 md:py-4 text-base sm:text-lg font-semibold hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
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
        <div className="flex justify-center gap-6 md:gap-8 mb-6 md:mb-8">
          <button onClick={() => window.location.href = 'mailto:wedding@example.com'} className="hover:text-gray-400 transition" aria-label="Send email">
            <Mail className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          <button onClick={() => window.location.href = 'tel:+1234567890'} className="hover:text-gray-400 transition" aria-label="Call us">
            <Phone className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>
        <p className="text-sm text-gray-500">We can't wait to celebrate with you ♥</p>
      </div>
    </footer>
  );
}