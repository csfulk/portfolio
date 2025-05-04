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
      const fallbackTimeout = setTimeout(() => {
        loadViewer();
      }, 1000); // Fallback after 1 second

      return () => clearTimeout(fallbackTimeout);
    }
  }, [transitioning, loadViewer]);

  if (!isModalOpen) {
    return null; // Force unmounting of the modal
  }

  if (!modalContent) {
    console.error('Modal content is null or undefined.');
    return null;
  }

  console.log('Modal content:', modalContent);

  if (modalContent.type === 'PasswordGate') {
    console.log('Rendering PasswordGate.');
    return modalContent;
  }

  if (modalContent.type === 'FeaturedProjectViewer') {
    if (!modalContent.images || modalContent.images.length === 0) {
      console.warn('Images not available for FeaturedProjectViewer. Skipping rendering.');
      return null;
    }
    console.log('Rendering FeaturedProjectViewer with images:', modalContent.images);
  }

  if (modalContent.type === 'FeaturedProjectViewer' && (!modalContent.images || modalContent.images.length === 0)) {
    console.warn('Modal content images are not yet available. Showing loading spinner.');
    return (
      <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
        <div
          className={`modal-container ${
            isModalOpen ? 'visible' : ''
          } ${transitioning ? 'transitioning' : ''} ${isExpanded ? 'expanded' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
      <div
        className={`modal-container ${
          isModalOpen ? 'visible' : ''
        } ${transitioning ? 'transitioning' : ''} ${isExpanded ? 'expanded' : ''}`}
        onTransitionEnd={() => {
          if (!transitioning) {
            loadViewer();
          }
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
          key={modalContent.key} 
          title={modalContent.title} 
          images={modalContent.images} 
          onClose={() => {
            closeModal();
          }}
        />
      </div>
    </div>
  );
};

export default Modal;