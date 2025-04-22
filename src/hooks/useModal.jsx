import { useState } from 'react';

const useModal = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isExpanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const openModal = (content, expanded = false) => {
    setLoading(false);
    setTransitioning(false);
    setModalContent(content);
    setModalOpen(true);
    setExpanded(expanded); // Set expanded state based on the argument
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setExpanded(false);
    setLoading(false);
    setTransitioning(false);
  };

  const startTransition = () => {
    setLoading(true);
    setTransitioning(true);
  };

  const completeTransition = () => {
    setLoading(false);
    setTransitioning(false);
    setExpanded(true);
  };

  return {
    isModalOpen,
    modalContent,
    isExpanded,
    loading,
    transitioning,
    openModal,
    closeModal,
    setExpanded,
    setLoading,
    startTransition,
    completeTransition,
  };
};

export default useModal;