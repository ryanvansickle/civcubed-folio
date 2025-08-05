import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set up audio properties
    audio.volume = 0.15; // Very soft volume
    audio.loop = true;

    // Auto-play after user interaction
    const handleFirstInteraction = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    // Wait for user interaction before playing
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
    document.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = 0.15;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* Audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        src="https://upload.wikimedia.org/wikipedia/commons/2/23/Debussy_Clair_de_Lune.ogg"
      />
      
      {/* Mute/Unmute button */}
      {isPlaying && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      )}
    </>
  );
};