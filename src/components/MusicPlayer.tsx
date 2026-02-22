
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { Song } from '../data';
import { motion } from 'motion/react';

interface MusicPlayerProps {
  playlist: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function MusicPlayer({
  playlist,
  currentSongIndex,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    onNext();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        {/* Song Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
            {isPlaying ? (
              <div className="flex items-end justify-center gap-[2px] h-6 w-full px-2 pb-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/80 rounded-t-sm"
                    animate={{
                      height: [4, 16, 8, 20, 4],
                    }}
                    transition={{
                      duration: 0.5 + i * 0.1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{currentSong.title}</h3>
            <p className="text-white/60 text-xs truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1 rounded-full mb-4 cursor-pointer group" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (audioRef.current) audioRef.current.currentTime = percent * duration;
        }}>
          <div 
            className="bg-white h-full rounded-full relative group-hover:bg-pink-500 transition-colors" 
            style={{ width: `${(progress / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg transform scale-0 group-hover:scale-100 transition-all" />
          </div>
        </div>
        
        <div className="flex justify-between text-[10px] text-white/40 -mt-2 mb-2 font-mono">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
            <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <div className="flex items-center gap-6">
                <button onClick={onPrev} className="text-white/80 hover:text-white transition-transform hover:scale-110">
                    <SkipBack size={24} />
                </button>
                
                <button 
                    onClick={onPlayPause} 
                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </button>

                <button onClick={onNext} className="text-white/80 hover:text-white transition-transform hover:scale-110">
                    <SkipForward size={24} />
                </button>
            </div>

            <div className="w-5" /> {/* Spacer for balance */}
        </div>

        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
}
