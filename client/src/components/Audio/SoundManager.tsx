import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudio } from '../../lib/stores/useAudio';
import { usePlayerProgress } from '../../lib/stores/usePlayerProgress';

export default function SoundManager() {
  const { isMuted } = useAudio();
  const { streak } = usePlayerProgress();
  const backgroundMusicRef = useRef<Howl | null>(null);
  const prevStreakRef = useRef(streak);

  useEffect(() => {
    // Initialize background music
    const backgroundMusic = new Howl({
      src: ['/sounds/background.mp3'],
      loop: true,
      volume: 0.3,
      autoplay: false
    });

    // Success sound for energy harvesting
    const successSound = new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.5
    });

    // Gentle hit sound for painting/building
    const paintSound = new Howl({
      src: ['/sounds/hit.mp3'],
      volume: 0.2
    });

    backgroundMusicRef.current = backgroundMusic;

    // Start background music if not muted
    if (!isMuted) {
      backgroundMusic.play();
    }

    return () => {
      backgroundMusic.unload();
      successSound.unload();
      paintSound.unload();
    };
  }, []);

  useEffect(() => {
    // Handle mute/unmute
    if (backgroundMusicRef.current) {
      if (isMuted) {
        backgroundMusicRef.current.pause();
      } else {
        backgroundMusicRef.current.play();
      }
    }
  }, [isMuted]);

  useEffect(() => {
    // Play success sound when streak increases
    if (streak > prevStreakRef.current && !isMuted) {
      const successSound = new Howl({
        src: ['/sounds/success.mp3'],
        volume: 0.5
      });
      successSound.play();
    }
    prevStreakRef.current = streak;
  }, [streak, isMuted]);

  // This component only manages audio, no visual output
  return null;
}
