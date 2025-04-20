import { useState, useEffect } from 'react';

export const useScrollSpy = (threshold = 0.05) => {
  const [isHeroOutOfView, setIsHeroOutOfView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero');
      if (!hero) return;

      const heroRect = hero.getBoundingClientRect();
      const heroBottom = heroRect.bottom;

      // Check if the hero is nearly out of view (5% or less visible)
      const isOutOfView = heroBottom <= window.innerHeight * threshold;

      setIsHeroOutOfView(isOutOfView);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isHeroOutOfView;
};