import { useState } from 'react';

const useModal = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isExpanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const openModal = (content, expanded = false) => {
    console.log('openModal called with content:', content);
    setLoading(false);
    setTransitioning(false);
    setModalContent(content);
    setModalOpen(true);
    setExpanded(expanded);
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
    console.log('Transition complete. Modal is now expanded.');
  };

  const loadViewer = () => {
    console.log('Viewer content is being loaded.');
    // Add any additional logic for loading the viewer content here
  };

  return {
    isModalOpen,
    modalContent,
    isExpanded,
    loading,
    transitioning,
    openModal,
    closeModal,
    startTransition,
    completeTransition,
    loadViewer, // Add loadViewer to the returned object
    setExpanded,
  };
};

export default useModal;