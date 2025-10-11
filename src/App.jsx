// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from '@theme';
import { 
  Navigation, 
  Footer, 
  Hero, 
  Modal, 
  SectionWrapper, 
  sectionsData 
} from '@components';
import { 
  useAuth, 
  useCaseStudyViewer, 
  useModalManager,
  useImageOptimization,
  usePrivacyIntegration
} from '@hooks';
import { PrivacyBanner, PrivacyDetailsModal } from './components/privacy';
import { ComponentBrowser } from './design-system/componentBrowser';
import { getCaseStudyImages } from '@data';
import { initializeServices } from '@services';

// Development only - privacy test utilities
if (import.meta.env.DEV) {
  import('@utils/privacyTestUtils.js');
  import('@utils/privacyTestHelper.js');
}

const App = () => {
  // Enhanced modal management with integrated keyboard interactions and styling
  const modalManager = useModalManager({
    onEscape: () => {
      console.log('Modal escaped via keyboard');
    },
    allowEnterInInputs: true
  });

  // Privacy integration for EU GDPR compliance
  const privacy = usePrivacyIntegration();

  const {
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    isExpanded,
    loading,
    transitioning,
    setExpanded,
    startTransition,
    completeTransition,
    loadViewer,
    debugInfo: modalDebugInfo
  } = modalManager;

  const { authenticated, authenticateAndOpenViewer } = useAuth({
    startTransition,
    completeTransition,
    setModalContent: openModal,
    setExpanded,
  });

  const viewer = useCaseStudyViewer({
    authenticateAndOpenViewer,
  });

  console.log('Modal flags →', { isModalOpen, transitioning, isExpanded, loading });

  // Initialize services with privacy compliance
  useEffect(() => {
    const setupServices = async () => {
      try {
        console.log('🚀 Starting service initialization...');
        
        const services = await initializeServices({
          enablePerformanceMonitoring: true,
          enableImageOptimization: true,
          enableNavigation: true,
          config: {
            defaults: {
              performance: {
                thresholds: {
                  componentRender: 100,
                  resourceLoad: 2000
                }
              }
            }
          }
        });
        
        console.log('✅ Services initialized successfully:', services);
        console.log('🔒 Privacy Manager:', services.privacy);
        console.log('📊 Performance Monitor:', services.performance);
        
        // Make services globally available for debugging
        window.portfolioServices = services;
        
      } catch (error) {
        console.error('❌ Failed to initialize services:', error);
        console.error('Error details:', error.stack);
      }
    };
    
    setupServices();
  }, []);

  // Get images from enabled case studies
  const { criticalImages: caseStudyCriticalImages, allImages: caseStudyAllImages } = getCaseStudyImages(3);
  
  // Preload critical images immediately (only from enabled case studies)
  const criticalImages = [
    '/assets/section_01_colt.fulk.youtube.webp',
    '/assets/section_02_colt.fulk.apple.webp',
    '/assets/section_04_colt.fulk.figma.webp',
    '/assets/password.laugh2.gif',
    ...caseStudyCriticalImages
  ];
  
  // Enhanced image optimization with performance monitoring
  const imageOptimization = useImageOptimization({
    criticalImages,
    lazyImages: caseStudyAllImages,
    logProgress: false // Set to true for debugging
  });

  // Console log modal state for debugging (remove in production)
  console.log('Modal State →', modalDebugInfo);
  console.log('Image Stats →', imageOptimization.imageStats);

  // Check for demo mode query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const demoMode = urlParams.get('demo');
  
  // Show Component Browser - unified navigation for all design system tools
  if (demoMode) {
    return (
      <ThemeProvider>
        <ComponentBrowser />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <>
        <Navigation />
        <Hero />
        <Suspense fallback={<div>Loading sections...</div>}>
          {sectionsData.map((section) => (
            <SectionWrapper
              key={section.id}
              section={section}
              handleCaseStudyClick={viewer.handleCaseStudyClick}
              authenticated={authenticated}
            />
          ))}
        </Suspense>

        <Modal
          isModalOpen={isModalOpen}
          modalContent={modalContent}
          closeModal={closeModal}
          transitioning={transitioning}
          isExpanded={isExpanded}
          loadViewer={loadViewer}
          loading={loading}
        />
        
        {/* Privacy Components - EU GDPR Compliance */}
        {privacy.showBanner && (
          <PrivacyBanner
            onAccept={privacy.onBannerAccept}
            onDecline={privacy.onBannerDecline}
            onShowDetails={privacy.onBannerShowDetails}
            autoAcceptDelay={8000}
          />
        )}
        
        <PrivacyDetailsModal
          isOpen={privacy.showDetails}
          onClose={privacy.onDetailsClose}
        />
        
        <Footer />
      </>
    </ThemeProvider>
  );
};

export default App;
