
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LyricsDisplayProps {
  lyrics: string[];
  isPlaying: boolean;
}

export default function LyricsDisplay({ lyrics, isPlaying }: LyricsDisplayProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setCurrentLineIndex(0);
    setIsVisible(true);

    // Hide after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [lyrics]);

  useEffect(() => {
    if (!isPlaying) return;

    // Cycle through lyrics every 4 seconds if we have multiple lines
    // But since we hide after 3s, this might not be needed unless we want to show multiple lines in sequence within the 3s?
    // The user said "que el texto salga en cd cancion y luego se quite despues cuando pase 2 a 3 seg".
    // So likely just one line or a few lines then disappear.
    // We'll keep the cycling but the visibility timer controls the overall display.
    
    const interval = setInterval(() => {
      setCurrentLineIndex((prev) => (prev + 1) % lyrics.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, lyrics]);

  if (!lyrics || lyrics.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 z-50 flex justify-center px-8 pointer-events-none">
      <AnimatePresence mode="wait">
        {isVisible && lyrics[currentLineIndex] && (
          <motion.div
            key={`${lyrics[currentLineIndex]}-${currentLineIndex}`}
            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-2xl md:text-4xl font-serif italic text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] bg-black/30 backdrop-blur-sm px-6 py-2 rounded-xl border border-white/10">
              "{lyrics[currentLineIndex]}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
