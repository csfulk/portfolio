import { useState } from 'react';

const useModal = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isExpanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setExpanded(false);
    setLoading(false);
  };

  return {
    isModalOpen,
    modalContent,
    isExpanded,
    loading,
    openModal,
    closeModal,
    setExpanded,
    setLoading,
  };
};

export default useModal;