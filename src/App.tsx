/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Heart } from 'lucide-react';
import StripGallery from './components/StripGallery';
import BackgroundAudio from './components/BackgroundAudio';
import LyricsDisplay from './components/LyricsDisplay';
import IntroSequence from './components/IntroSequence';
import { mediaItems, playlist } from './data';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const handleStart = () => {
    setHasStarted(true);
    setIsPlaying(true);
  };

  const handleIntroComplete = () => {
    setIntroComplete(true);
    // Reset to first song or specific song for gallery mode if needed
    // For now, let's just loop or continue
    setCurrentSongIndex(0); 
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center space-y-8"
            >
              <h1 className="text-6xl md:text-8xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                For Anyari
              </h1>
              <p className="text-white/60 text-lg font-light tracking-widest uppercase">
                A collection of our moments
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-300"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-5 h-5 fill-white" />
                <span className="font-medium tracking-wide">Start Experience</span>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : !introComplete ? (
          <IntroSequence 
            key="intro"
            playlist={playlist}
            mediaItems={mediaItems}
            onComplete={handleIntroComplete}
            onSongChange={setCurrentSongIndex}
          />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-full"
          >
            {/* Strip Gallery Layer */}
            <StripGallery items={mediaItems} />

            {/* Overlay Elements */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-40 pointer-events-none">
              <div className="flex flex-col">
                <h2 className="text-2xl font-serif italic font-bold drop-shadow-md text-white">Anyari & Me</h2>
                <div className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-widest mt-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>Live Memories</span>
                </div>
              </div>
              
              <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
              </div>
            </div>

            {/* Lyrics Display */}
            <LyricsDisplay 
              lyrics={playlist[currentSongIndex].lyrics} 
              isPlaying={isPlaying} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Player - Persistent across Intro and Main */}
      {hasStarted && (
        <BackgroundAudio
          playlist={playlist}
          currentSongIndex={currentSongIndex}
          isPlaying={isPlaying}
          onNext={handleNextSong}
        />
      )}
    </div>
  );
}


