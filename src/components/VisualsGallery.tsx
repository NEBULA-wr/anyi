
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VisualsGalleryProps {
  items: MediaItem[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  isPlaying: boolean;
}

export default function VisualsGallery({
  items,
  currentIndex,
  onNext,
  onPrev,
  isPlaying,
}: VisualsGalleryProps) {
  const currentItem = items[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  // Reset progress when item changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Handle auto-advance for images and videos
  useEffect(() => {
    if (!isPlaying) return;

    let interval: NodeJS.Timeout;
    let animationFrame: number;

    if (currentItem.type === 'image') {
      const duration = (currentItem.duration || 5) * 1000;
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
        
        if (elapsed < duration) {
          animationFrame = requestAnimationFrame(updateProgress);
        } else {
          onNext();
        }
      };
      
      animationFrame = requestAnimationFrame(updateProgress);
    } else if (currentItem.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(e => console.log("Autoplay prevented", e));

      const handleTimeUpdate = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      };

      const handleEnded = () => {
        onNext();
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
        video.pause();
      };
    }

    return () => {
      if (interval) clearInterval(interval);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [currentIndex, isPlaying, currentItem, onNext]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {currentItem.type === 'image' ? (
            <img
              src={currentItem.url}
              alt={currentItem.caption}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentItem.url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
          
          {/* Caption */}
          {currentItem.caption && (
            <motion.div 
              key={`caption-${currentItem.id}`}
              initial={{ y: 40, opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ y: -40, opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-40 left-0 right-0 text-center px-6 z-30"
            >
              <div className="inline-block relative">
                <h2 className="text-5xl md:text-7xl font-serif italic text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-tight">
                  {currentItem.caption}
                </h2>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-[2px] bg-white/50 mx-auto mt-4 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Film Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-20 mix-blend-overlay" 
           style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise_pattern_with_cross_sections.png")' }}>
      </div>

      {/* CapCut-style Recording UI */}
      <div className="absolute top-8 right-8 z-40 flex items-center gap-2 pointer-events-none">
        <motion.div 
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]"
        />
        <span className="text-white/80 font-mono text-xs tracking-widest">REC</span>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div 
          className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Areas (Invisible but clickable) */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-10 flex items-center justify-start opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={onPrev}>
        <div className="p-4 bg-black/20 backdrop-blur-sm rounded-r-xl">
            <ChevronLeft className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-1/4 z-10 flex items-center justify-end opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={onNext}>
        <div className="p-4 bg-black/20 backdrop-blur-sm rounded-l-xl">
            <ChevronRight className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
