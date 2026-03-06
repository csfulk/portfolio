import React, { useEffect, useRef } from 'react';
import '../../styles/modal.css';
import FeaturedProjectViewer from '../viewers/ProjectViewer';
import FigmaEmbedViewer from '../viewers/FigmaEmbedViewer';
import { eventTracker } from '@services/core/EventTracker.js';

const Modal = ({
  isModalOpen,
  modalContent,
  closeModal,
  transitioning,
  isExpanded,
  loadViewer,
  loading,
}) => {
  // Track project open/close with duration
  const openTimeRef  = useRef(null);
  const openTitleRef = useRef(null);

  useEffect(() => {
    const isProject = isModalOpen && modalContent?.type === 'FeaturedProjectViewer';
    if (isProject && !openTimeRef.current) {
      openTimeRef.current  = Date.now();
      openTitleRef.current = modalContent?.title ?? null;
      eventTracker.track('project_open', modalContent?.title ?? null);
    } else if (!isModalOpen && openTimeRef.current) {
      const seconds = Math.round((Date.now() - openTimeRef.current) / 1000);
      eventTracker.track('project_close', openTitleRef.current, seconds);
      openTimeRef.current  = null;
      openTitleRef.current = null;
    } else if (!isProject && openTimeRef.current) {
      openTimeRef.current  = null;
      openTitleRef.current = null;
    }
  }, [isModalOpen, modalContent?.type, modalContent?.title]);

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


  // Handle FigmaEmbedViewer
  if (modalContent && modalContent.type === 'FigmaEmbedViewer') {
    return (
      <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
        <FigmaEmbedViewer embedUrl={modalContent.embedUrl} onClose={closeModal} />
      </div>
    );
  }

  if (!modalContent || (modalContent.type !== 'PasswordGate' && !modalContent.images)) {
    console.error('Modal content is invalid:', modalContent);
    return <div className="modal-error">Error: Modal content is missing or invalid.</div>;
  }

  console.log('Modal content:', modalContent);

  if (modalContent.type === 'PasswordGate') {
    console.log('Rendering PasswordGate component:', modalContent.component);
    const containerClass = `modal-container ${isModalOpen ? 'visible' : ''} ${transitioning ? 'transitioning' : ''} ${isExpanded ? 'expanded' : ''} ${modalContent.type === 'PasswordGate' ? 'password-gate-modal' : ''}`;
    return (
      <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
        <div
          className={containerClass}
          onClick={(e) => e.stopPropagation()}
        >
          {modalContent.component}
        </div>
      </div>
    );
  }

  if (modalContent.type === 'FeaturedProjectViewer' && (!modalContent.images || modalContent.images.length === 0)) {
    console.warn('Modal content images are not yet available. Showing loading spinner.');
    const containerClass = `modal-container ${isModalOpen ? 'visible' : ''} ${transitioning ? 'transitioning' : ''} ${modalContent.type === 'FeaturedProjectViewer' ? 'expanded' : ''}`;
    return (
      <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
        <div
          className={containerClass}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  } else if (modalContent.type === 'FeaturedProjectViewer') {
    console.log('Rendering FeaturedProjectViewer with images:', modalContent.images);
  }

  console.log('Modal content before rendering:', modalContent);

  if (modalContent.type === 'FeaturedProjectViewer') {
    const containerClass = `modal-container ${isModalOpen ? 'visible' : ''} ${transitioning ? 'transitioning' : ''} ${modalContent.type === 'FeaturedProjectViewer' ? 'expanded' : ''}`;
    return (
      <div className={`modal-overlay ${isModalOpen ? 'visible' : ''}`} onClick={closeModal}>
        <div
          className={containerClass}
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
            <FeaturedProjectViewer
              title={modalContent.title}
              images={modalContent.images}
              onClose={closeModal}
            />
          )}
        </div>
      </div>
    );
  }

  // Fallback for other modal types (shouldn't reach here with current logic)
  console.warn('Unexpected modal content type:', modalContent);
  return null;
};

export default Modal;