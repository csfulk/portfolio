// Page Components
export { default as Hero } from './pages/Hero'

// Modal Components
export { Modal, PasswordGate } from './modals'

// Main Components
// Icon moved to design system

// Layout Components
export { default as Navigation } from './layout/Navigation'
export { default as Footer } from './layout/Footer'

// Section Components  
export { default as SectionWrapper } from './sections/SectionWrapper'

// Data
export { sectionsData } from './data/sectionsData'

// Viewers
export { ProjectViewer, FigmaEmbedViewer } from './viewers'

// Layout System
export { 
  Container, 
  Grid, 
  Stack, 
  HStack, 
  VStack, 
  Spacer, 
  Section 
} from './layout-system'

// UI Primitives (DIRECT FROM DESIGN-SYSTEM)
export { 
  Button,
  Surface,
  Icon
} from '../design-system/components'

// Privacy Components
export { PrivacyBanner, PrivacyDetailsModal } from './privacy'
