import React from 'react';
import ProjectViewer from '../components/projectViewer';

// Mapping of case study data
const caseStudyData = {
  'Case Study 1': {
    title: 'YouTube Living Room Case Study',
    folder: '/assets/yt_case_study_00',
    count: 18,
    fileName: 'featured_ytlr'
  },
  'Case Study 2': {
    title: 'YouTube Movies & Shows Case Study',
    folder: '/assets/yt_case_study_01',
    count: 23,
    fileName: 'feature_project_ytms'
  },
  'Apple Case Study 1': {
    title: 'YouTube Movies & Shows Case Study',
    folder: '/assets/apple_case_study_01',
    count: 13,
    fileName: 'apple_dev_doc'
  },
  'Apple Case Study 2': {
    title: 'YouTube Movies & Shows Case Study',
    folder: '/assets/apple_case_study_02',
    count: 7,
    fileName: 'apple_product'
  }
};

/**
 * Creates a handler for case study logic.
 * @param {Object} api - An object containing modal and auth methods and flags.
 * @param {boolean} api.authenticated - Whether the user has already been authenticated.
 * @param {function} api.openModal - Function to open the modal: openModal(content, expanded).
 * @param {function} api.closeModal - Function to close the modal.
 * @param {function} api.openPasswordGate - Function to open the password gate: openPasswordGate(viewerProps).
 * @param {function} api.loadViewer - Function to load the project viewer after transition.
 * @returns {{ handleCaseStudyClick: function, loadViewer: function }}
 */
export function useCaseStudyViewer({
  authenticated,
  openModal,
  closeModal,
  openPasswordGate,
  loadViewer
}) {
  const handleCaseStudyClick = React.useCallback((key) => {
    // Scroll to the section
    const sectionEl = document.querySelector(`[data-section-key="${key}"]`);
    sectionEl?.scrollIntoView({ behavior: 'smooth' });

    // Prepare viewerProps
    const cs = caseStudyData[key];
    if (!cs) return;
    const { title, folder, count, fileName } = cs;
    const images = Array.from({ length: count }, (_, i) =>
      `${folder}/${fileName}_${String(i + 1).padStart(2, '0')}.webp`
    );
    const viewerProps = { title, images, onClose: closeModal };

    if (authenticated) {
      // Show viewer directly in expanded modal
      openModal(React.createElement(ProjectViewer, viewerProps), true);
    } else {
      // Trigger password gate flow
      openPasswordGate(viewerProps);
    }
  }, [authenticated, openModal, openPasswordGate, closeModal]);

  return {
    handleCaseStudyClick,
    loadViewer
  };
}

export default useCaseStudyViewer;