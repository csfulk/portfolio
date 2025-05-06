import { useEffect } from 'react';

const usePreloadImages = (imagesToPreload, options = { lazy: false }) => {
  useEffect(() => {
    if (options.lazy) {
      // Lazy load images when they are needed
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = entry.target.dataset.src;
            img.onload = () => {
              entry.target.src = img.src;
              observer.unobserve(entry.target);
            };
          }
        });
      });

      imagesToPreload.forEach((image) => {
        const imgElement = document.querySelector(`[data-src='${image}']`);
        if (imgElement) {
          observer.observe(imgElement);
        }
      });

      return () => observer.disconnect();
    } else {
      // Preload images immediately
      imagesToPreload.forEach((image) => {
        const img = new Image();
        img.src = image;
        img.onload = () => console.log(`Preloaded image: ${image}`);
      });
    }
  }, [imagesToPreload, options.lazy]);
};

export default usePreloadImages;