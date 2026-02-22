
import { useEffect, useRef } from 'react';
import { Song } from '../data';

interface BackgroundAudioProps {
  playlist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  onNext: () => void;
}

export default function BackgroundAudio({
  playlist,
  currentSongIndex,
  isPlaying,
  onNext,
}: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = playlist[currentSongIndex];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      // Clear any existing stop timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (isPlaying) {
        // Set start time
        audioRef.current.currentTime = currentSong.startTime || 0;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented:", error);
          });
        }

        // Set timer to stop/next if duration is specified
        if (currentSong.duration) {
          timeoutRef.current = setTimeout(() => {
            // Fade out effect could go here
            onNext();
          }, currentSong.duration * 1000);
        }
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentSongIndex, currentSong]);

  return (
    <audio
      ref={audioRef}
      src={currentSong.url}
      onEnded={onNext} // Fallback if duration isn't set
      className="hidden"
    />
  );
}
