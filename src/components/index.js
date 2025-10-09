// Main Components
export { default as Hero } from './Hero'
export { default as Modal } from './Modal'
export { default as PasswordGate } from './PasswordGate'
// Removed legacy button - use Button from design system instead
export { default as Icon } from './icon'
export { default as FigmaEmbedViewer } from './FigmaEmbedViewer'

// Layout Components
export { default as Navigation } from './layout/Navigation'
export { default as Footer } from './layout/Footer'

// Section Components  
export { default as SectionWrapper } from './sections/SectionWrapper'

// Data
export { sectionsData } from './sectionsData'

// Viewers
export { default as ProjectViewer } from './projectViewer'

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
  Typography, 
  Heading, 
  Display, 
  Body, 
  Subtitle, 
  Caption, 
  Overline,
  Button,
  Surface 
} from '../design-system/components'

// Privacy Components
export { PrivacyBanner, PrivacyDetailsModal } from './privacy'
