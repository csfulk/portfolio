import { useState, useEffect } from 'react';

export const useScrollSpy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero');
    const navigation = document.querySelector('.navigation');

    if (!hero || !navigation) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(false); // Hero is in view, hide navigation
        } else {
          setIsVisible(true); // Hero is out of view, show navigation
        }
      },
      { threshold: 0.01 } // Trigger when 10% of the hero is visible
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return isVisible;
};