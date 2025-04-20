export const toggleDescription = (descriptionRef, isExpanded, setIsExpanded) => {
  const descriptionElement = descriptionRef.current;

  if (isExpanded) {
    // Collapse: Set height to the current scrollHeight, then transition to 0
    descriptionElement.style.height = `${descriptionElement.scrollHeight}px`;
    requestAnimationFrame(() => {
      descriptionElement.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      descriptionElement.style.height = '0';
    });
  } else {
    // Expand: Set height to the scrollHeight
    descriptionElement.style.height = '0'; // Start from 0
    requestAnimationFrame(() => {
      descriptionElement.style.transition = 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      descriptionElement.style.height = `${descriptionElement.scrollHeight}px`;
    });

    // Remove the inline height after the transition to allow auto height
    descriptionElement.addEventListener(
      'transitionend',
      () => {
        descriptionElement.style.height = 'auto';
      },
      { once: true }
    );
  }

  setIsExpanded(!isExpanded);
};