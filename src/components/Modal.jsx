import React, { useEffect } from 'react';
import '../styles/modal.css';

const Modal = ({
  isModalOpen,
  modalContent,
  closeModal,
  transitioning,
  isExpanded,
  loadViewer,
  loading,
}) => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isModalOpen) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        document.activeElement?.blur();
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  return (
    isModalOpen && (
      <div className="modal-overlay" onClick={closeModal}>
        <div
          className={`modal-container ${
            transitioning ? 'transitioning' : ''
          } ${isExpanded ? 'expanded' : ''}`}
          onTransitionEnd={loadViewer}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            modalContent
          )}
        </div>
      </div>
    )
  );
};

export default Modal;