import { useState, useRef, useEffect } from 'react';

const useExpandable = (description) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isInitiallyTruncated, setIsInitiallyTruncated] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [description]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (descriptionRef.current) {
        const { scrollHeight, clientHeight } = descriptionRef.current;
        const truncated = scrollHeight > clientHeight;
        setIsTruncated(truncated);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [description, isExpanded]);

  useEffect(() => {
    if (!isExpanded && descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      const truncated = scrollHeight >= clientHeight;
      setIsInitiallyTruncated(truncated);
    }
  }, [description]);

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      const truncated = scrollHeight > clientHeight || scrollHeight === clientHeight;
      setIsInitiallyTruncated(truncated);
    }
  }, []);

  const toggleExpand = () => {
    if (descriptionRef.current) {
      const container = descriptionRef.current;
      if (isExpanded) {
        container.classList.remove('expanded');
        container.classList.add('collapsed');
        container.style.overflow = 'hidden';
        container.style.display = '-webkit-box';
        container.style.webkitLineClamp = '3';
        container.style.webkitBoxOrient = 'vertical';
      } else {
        container.classList.remove('collapsed');
        container.classList.add('expanded');
        container.style.overflow = 'visible';
        container.style.display = 'block';
        container.style.webkitLineClamp = 'unset';
        container.style.webkitBoxOrient = 'unset';
      }
      setIsExpanded(!isExpanded);
    }
  };

  return { isExpanded, isTruncated, isInitiallyTruncated, toggleExpand, descriptionRef };
};

export default useExpandable;