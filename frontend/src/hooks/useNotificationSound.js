import { useEffect, useRef } from 'react';

export const useNotificationSound = () => {
  const audioRef = useRef(new Audio('/notification-sound.mp3'));

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const playNotificationSound = () => {
    audioRef.current.play().catch(error => console.error('Error playing notification sound:', error));
  };

  return playNotificationSound;
};
