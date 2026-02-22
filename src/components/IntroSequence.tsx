import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Song, MediaItem } from '../data';
import { BookOpen, ChevronRight } from 'lucide-react';

interface IntroSequenceProps {
  playlist: Song[];
  mediaItems: MediaItem[];
  onComplete: () => void;
  onSongChange: (index: number) => void;
}

export default function IntroSequence({ playlist, mediaItems, onComplete, onSongChange }: IntroSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'playing' | 'revealing' | 'formed'>('playing');
  const [showCard, setShowCard] = useState(true);
  const [mediaOffset, setMediaOffset] = useState(0);

  // Mapping for "TE AMO ANYARI"
  // T: Song 3 (Thinking...), Index 0
  // E: Song 1 (Perfect), Index 1
  // A: Song 5 (All of Me), Index 0
  // M: Song 5 (All of Me), Index 7
  // O: Song 0 (Photograph), Index 2
  // A: Song 6 (A Thousand...), Index 0
  // N: Song 3 (Thinking...), Index 3
  // Y: Song 7 (Love Yourself), Index 5
  // A: Song 2 (Rewrite...), Index 14
  // R: Song 2 (Rewrite...), Index 0
  // I: Song 4 (Beautiful...), Index 5
  
  const targetChars = useMemo(() => [
    { id: 'T1', songIndex: 3, charIndex: 0, char: 'T' },
    { id: 'E1', songIndex: 1, charIndex: 1, char: 'E' },
    { id: 'space1', songIndex: -1, charIndex: -1, char: ' ' },
    { id: 'A1', songIndex: 5, charIndex: 0, char: 'A' },
    { id: 'M1', songIndex: 5, charIndex: 7, char: 'M' },
    { id: 'O1', songIndex: 0, charIndex: 2, char: 'O' },
    { id: 'space2', songIndex: -1, charIndex: -1, char: ' ' },
    { id: 'A2', songIndex: 6, charIndex: 0, char: 'A' },
    { id: 'N1', songIndex: 3, charIndex: 3, char: 'N' },
    { id: 'Y1', songIndex: 7, charIndex: 5, char: 'Y' },
    { id: 'A3', songIndex: 2, charIndex: 14, char: 'A' },
    { id: 'R1', songIndex: 2, charIndex: 0, char: 'R' },
    { id: 'I1', songIndex: 4, charIndex: 5, char: 'I' },
  ], []);

  useEffect(() => {
    if (phase !== 'playing') return;

    setShowCard(true);
    setMediaOffset(0);

    const songDuration = 10000; // 10s per song
    
    onSongChange(currentIndex);

    // Hide card after 3 seconds
    const cardTimer = setTimeout(() => {
      setShowCard(false);
    }, 3000);

    // Switch media after 5 seconds
    const mediaTimer = setTimeout(() => {
      setMediaOffset(1);
    }, 5000);

    const nextTimer = setTimeout(() => {
      if (currentIndex < playlist.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setPhase('revealing');
      }
    }, songDuration);

    return () => {
      clearTimeout(cardTimer);
      clearTimeout(mediaTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, playlist, onSongChange, phase]);

  useEffect(() => {
    if (phase === 'revealing') {
      // Show list for a moment, then form the phrase
      const timer = setTimeout(() => {
        setPhase('formed');
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (phase === 'formed') {
       const timer = setTimeout(() => {
        onComplete();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const currentMediaIndex = (currentIndex * 2 + mediaOffset) % mediaItems.length;
  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <div className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase === 'playing' ? `bg-${currentIndex}-${mediaOffset}` : 'bg-final'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {phase === 'playing' ? (
            <div className="w-full h-full relative">
               {currentMedia.type === 'image' ? (
                <img 
                  src={currentMedia.url} 
                  alt="" 
                  className={`w-full h-full object-cover transition-all duration-1000 ${showCard ? 'blur-md scale-110' : 'blur-0 scale-100'}`} 
                />
              ) : (
                <video 
                  src={currentMedia.url} 
                  className={`w-full h-full object-cover transition-all duration-1000 ${showCard ? 'blur-md scale-110' : 'blur-0 scale-100'}`} 
                  muted 
                  autoPlay 
                  loop 
                />
              )}
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${showCard ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          ) : (
             <div className="w-full h-full bg-black/90" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: Math.random() * 100 + 'vw', opacity: 0 }}
            animate={{ y: '-20vh', opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 15 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute text-white/10"
          >
            <BookOpen size={40 + Math.random() * 40} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {phase === 'playing' && showCard && (
            <motion.div
              key={`card-${playlist[currentIndex].id}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative p-12 md:p-16 bg-[#fff9f0] text-black rounded-sm shadow-2xl max-w-2xl mx-auto transform rotate-1">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 rounded-sm" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 text-black/40 flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                    <span className="w-8 h-[1px] bg-black/40" />
                    Chapter {currentIndex + 1}
                    <span className="w-8 h-[1px] bg-black/40" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif italic mb-4 leading-tight text-black/90">
                    {playlist[currentIndex].title}
                  </h2>
                  <p className="font-mono text-sm uppercase tracking-widest text-black/50 mt-4">
                    {playlist[currentIndex].artist}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reveal Phase: Show List then Form Phrase */}
          {(phase === 'revealing' || phase === 'formed') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Song List Container */}
              <div className="relative flex flex-col items-center gap-4">
                {playlist.map((song, songIndex) => (
                  <motion.div 
                    key={song.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'revealing' ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className="flex items-center justify-center h-12 relative"
                  >
                    {song.title.split('').map((char, charIndex) => {
                      // Check if this specific character is used in the target phrase
                      const target = targetChars.find(t => t.songIndex === songIndex && t.charIndex === charIndex);
                      
                      if (target) {
                        return (
                          <motion.span
                            key={`${songIndex}-${charIndex}`}
                            layoutId={target.id} // Magic happens here
                            className="text-2xl md:text-3xl font-serif text-pink-300 font-bold mx-[1px] inline-block"
                          >
                            {char}
                          </motion.span>
                        );
                      }
                      
                      return (
                        <span key={`${songIndex}-${charIndex}`} className="text-2xl md:text-3xl font-serif text-white/20 mx-[1px] inline-block">
                          {char}
                        </span>
                      );
                    })}
                  </motion.div>
                ))}
              </div>

              {/* Formed Phrase Container */}
              {phase === 'formed' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 max-w-4xl px-8">
                    {targetChars.map((target, i) => {
                      if (target.char === ' ') return <div key={i} className="w-8" />;
                      
                      return (
                        <motion.span
                          key={target.id}
                          layoutId={target.id}
                          className="text-6xl md:text-9xl font-serif italic text-white drop-shadow-[0_0_30px_rgba(255,192,203,0.8)]"
                          transition={{ type: "spring", stiffness: 60, damping: 12 }}
                        >
                          {target.char}
                        </motion.span>
                      );
                    })}
                  </div>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="text-xl text-pink-200 font-light tracking-[0.5em] uppercase mt-12"
                  >
                    Forever & Always
                  </motion.p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <button 
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-white/30 hover:text-white/80 transition-colors flex items-center gap-2 text-sm uppercase tracking-widest z-50"
      >
        Skip <ChevronRight size={14} />
      </button>
    </div>
  );
}
