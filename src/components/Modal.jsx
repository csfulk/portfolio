import React, { useEffect } from 'react';
import '../styles/modal.css';
import FeaturedProjectViewer from './projectViewer';

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

  useEffect(() => {
    console.log('Modal visibility updated:', { isModalOpen });
  }, [isModalOpen]);

  if (!isModalOpen) {
    console.log('Modal is unmounted because isModalOpen is false.');
    return null; // Force unmounting of the modal
  }

  if (!modalContent) {
    console.error('Modal content is null or undefined.');
    return null;
  }

  return (
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
        {/* Pass closeModal to FeaturedProjectViewer */}
        <FeaturedProjectViewer 
          key={modalContent.key} // Explicitly pass the key prop
          {...modalContent} 
          onClose={() => {
            console.log('Closing modal from FeaturedProjectViewer.');
            closeModal();
          }}
        />
      </div>
    </div>
  );
};

export default Modal;