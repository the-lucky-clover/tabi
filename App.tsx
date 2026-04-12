
import React, { useState, useEffect, useRef } from 'react';
import { Chapters } from './constants';
import Chapter from './components/Chapter';
import Preloader from './components/Preloader';
import Background from './components/Background';
import CouponPalace from './components/CouponPalace';

const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l10-3v13m-10 0l10-3m-10 0a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m0 4l4-4" />
    </svg>
);


const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <audio ref={audioRef} loop>
          {/* Sourced from Wikimedia Commons, Public Domain */}
          <source src="https://upload.wikimedia.org/wikipedia/commons/2/22/Mozart_-_The_Magic_Flute_-_Overture.ogg" type="audio/ogg" />
          Your browser does not support the audio element.
      </audio>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleMusic}
          className="p-3 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <MusicIcon /> : <MuteIcon/>}
        </button>
      </div>

      <main className="relative text-white overflow-x-hidden">
        <Background />
        
        {Chapters.map((chapter, index) => (
          <Chapter key={index} chapter={chapter} index={index} total={Chapters.length} />
        ))}
        
        <CouponPalace />
      </main>
    </>
  );
};

export default App;
