/**
 * Section Component - Composable Section Pattern
 * Replaces the monolithic SectionWrapper with composable parts
 */

import React from 'react';
import PropTypes from 'prop-types';
import Container from '../layout-system/Container';
import { VStack, HStack } from '../layout-system/Stack';
import { Surface, Typography as Text } from '../ui-primitives';
import { useExpandable, useLazyImage } from '@hooks';

// Main Section container
const Section = ({ 
  children, 
  id,
  variant = 'section',
  className = '',
  ...props 
}) => {
  return (
    <Surface
      as="section"
      id={id}
      variant={variant}
      className={`section ${className}`.trim()}
      padding="7xl"
      style={{ minHeight: '100vh' }}
      {...props}
    >
      <Container size="full">
        {children}
      </Container>
    </Surface>
  );
};

// Section Header (logo, title, subtitle)
const SectionHeader = ({ 
  logo, 
  title, 
  subtitle, 
  children,
  className = '',
  ...props 
}) => {
  return (
    <VStack gap="2xl" className={`section-header ${className}`.trim()} {...props}>
      {logo && (
        <div className="section-logo">
          <img 
            src={logo} 
            alt="Logo" 
            style={{ maxHeight: '80px', objectFit: 'contain' }}
          />
        </div>
      )}
      
      {title && (
        <Text.Heading 
          level={1} 
          color="section.primary"
          className="section-title"
        >
          {title}
        </Text.Heading>
      )}
      
      {subtitle && (
        <Text.Heading 
          level={2} 
          color="section.secondary"
          className="section-subtitle"
        >
          {subtitle}
        </Text.Heading>
      )}
      
      {children}
    </VStack>
  );
};

// Section Content area
const SectionContent = ({ 
  children, 
  layout = 'horizontal',
  gap = 'lg',
  className = '',
  ...props 
}) => {
  const StackComponent = layout === 'horizontal' ? HStack : VStack;
  
  return (
    <StackComponent 
      gap={gap}
      align="flex-start"
      className={`section-content ${className}`.trim()}
      style={{ width: '100%' }}
      {...props}
    >
      {children}
    </StackComponent>
  );
};

// Section Description with expandable functionality
const SectionDescription = ({ 
  children, 
  expandable = false,
  className = '',
  ...props 
}) => {
  const { isExpanded, isTruncated, toggleExpand, descriptionRef } = useExpandable(children);

  if (!expandable) {
    return (
      <div className={`section-description ${className}`.trim()} {...props}>
        {typeof children === 'string' ? (
          children.split('\n').map((paragraph, index) => (
            <Text.Body key={index} style={{ marginBottom: 'var(--spacing-md)' }}>
              {paragraph.trim()}
            </Text.Body>
          ))
        ) : (
          children
        )}
      </div>
    );
  }

  return (
    <VStack gap="xs" className={`section-description ${className}`.trim()}>
      <div
        ref={descriptionRef}
        className={`description-container ${isExpanded ? 'expanded' : 'truncated'}`}
        style={{ 
          maxHeight: isExpanded ? 'none' : '5.4em',
          overflow: 'hidden'
        }}
      >
        {typeof children === 'string' ? (
          children.split('\n').map((paragraph, index) => (
            <Text.Body key={index} style={{ marginBottom: 'var(--spacing-md)' }}>
              {paragraph.trim()}
            </Text.Body>
          ))
        ) : (
          children
        )}
      </div>
      
      {isTruncated && (
        <button
          onClick={toggleExpand}
          className="expand-toggle"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--colors-interactive-accent)',
            cursor: 'pointer',
            fontSize: 'var(--typography-font-size-sm)',
            padding: '0',
            textDecoration: 'underline'
          }}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </VStack>
  );
};

// Section Image with lazy loading
const SectionImage = ({ 
  src, 
  alt = '', 
  threshold = 0.9,
  className = '',
  ...props 
}) => {
  const { imgRef, isLoaded, isVisible, imageSrc } = useLazyImage(src, threshold);

  return (
    <div 
      ref={imgRef}
      className={`section-image ${isLoaded ? 'loaded' : ''} ${className}`.trim()}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        width: '100%',
        height: 'auto'
      }}
      {...props}
    >
      {isVisible && (
        <img 
          src={imageSrc} 
          alt={alt}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover'
          }}
          onLoad={() => console.log(`Section image loaded: ${src}`)}
        />
      )}
    </div>
  );
};

// Section Actions (buttons, etc.)
const SectionActions = ({ 
  children, 
  layout = 'horizontal',
  gap = 'md',
  className = '',
  ...props 
}) => {
  const StackComponent = layout === 'horizontal' ? HStack : VStack;
  
  return (
    <StackComponent 
      gap={gap}
      className={`section-actions ${className}`.trim()}
      {...props}
    >
      {children}
    </StackComponent>
  );
};

// PropTypes
Section.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'section', 'modal']),
  className: PropTypes.string
};

SectionHeader.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

SectionContent.propTypes = {
  children: PropTypes.node.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string
};

SectionDescription.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  expandable: PropTypes.bool,
  className: PropTypes.string
};

SectionImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  threshold: PropTypes.number,
  className: PropTypes.string
};

SectionActions.propTypes = {
  children: PropTypes.node.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  gap: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string
};

// Attach sub-components
Section.Header = SectionHeader;
Section.Content = SectionContent;
Section.Description = SectionDescription;
Section.Image = SectionImage;
Section.Actions = SectionActions;

export { SectionHeader, SectionContent, SectionDescription, SectionImage, SectionActions };
export default Section;
