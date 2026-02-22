
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../data';

interface StripGalleryProps {
  items: MediaItem[];
}

export default function StripGallery({ items }: StripGalleryProps) {
  // We want 5 strips
  const stripCount = 5;
  
  // Distribute items across strips
  // We'll just rotate through the items for each strip with an offset
  const getStripItems = (offset: number) => {
    const stripItems = [];
    for (let i = 0; i < items.length; i++) {
      stripItems.push(items[(i + offset) % items.length]);
    }
    return stripItems;
  };

  return (
    <div className="absolute inset-0 flex flex-row overflow-hidden bg-black">
      {[...Array(stripCount)].map((_, i) => (
        <Strip 
          key={i} 
          items={getStripItems(i * 2)} // Offset items so strips look different
          index={i}
          totalStrips={stripCount}
        />
      ))}
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />
    </div>
  );
}

function Strip({ items, index, totalStrips }: { items: MediaItem[], index: number, totalStrips: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Randomize interval for image switching to make it feel organic
  useEffect(() => {
    const currentItem = items[currentIndex];
    
    let timeout: NodeJS.Timeout;

    if (currentItem.type === 'image') {
      // Random duration between 4s and 8s
      const duration = 4000 + Math.random() * 4000;
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, duration);
    } else {
      // For video, wait for it to end or timeout if it fails
      // We handle video end via onEnded event, but add a safety timeout
      // timeout = setTimeout(() => {
      //   setCurrentIndex((prev) => (prev + 1) % items.length);
      // }, 15000); // Max 15s for video in strip
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, items]);

  const handleVideoEnded = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const currentItem = items[currentIndex];

  return (
    <div 
      className="relative h-full overflow-hidden border-r border-black/50 last:border-r-0"
      style={{ width: `${100 / totalStrips}%` }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`${index}-${currentItem.id}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {currentItem.type === 'image' ? (
            <img
              src={currentItem.url}
              alt=""
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentItem.url}
              className="w-full h-full object-cover opacity-90"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
            />
          )}
          
          {/* Strip Overlay Color - subtle tint per strip */}
          <div 
            className="absolute inset-0 mix-blend-overlay pointer-events-none"
            style={{ 
              backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.1)` 
            }} 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
