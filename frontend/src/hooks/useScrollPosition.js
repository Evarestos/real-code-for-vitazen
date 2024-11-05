import { useEffect, useState } from 'react';

export const useScrollPosition = (key) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const savedPosition = localStorage.getItem(key);
    if (savedPosition) {
      setScrollPosition(parseInt(savedPosition, 10));
      window.scrollTo({
        top: parseInt(savedPosition, 10),
        behavior: 'smooth'
      });
    }
  }, [key]);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      localStorage.setItem(key, currentPosition.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [key]);

  return scrollPosition;
};
