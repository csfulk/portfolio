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

  useEffect(() => {
    if (transitioning) {
      console.log('Modal is transitioning. Adding fallback for loadViewer.');
      const fallbackTimeout = setTimeout(() => {
        console.log('Fallback: Invoking loadViewer after timeout.');
        loadViewer();
      }, 1000); // Fallback after 1 second

      return () => clearTimeout(fallbackTimeout);
    }
  }, [transitioning, loadViewer]);

  return (
    isModalOpen && (
      <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
        <div
          className={`modal-container ${
            isModalOpen ? 'visible' : ''
          } ${transitioning ? 'transitioning' : ''} ${isExpanded ? 'expanded' : ''}`}
          onTransitionEnd={() => {
            console.log('onTransitionEnd event fired. Invoking loadViewer.');
            loadViewer();
          }}
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