/**
 * Enhanced Section Wrapper - Using New Component Architecture
 * Demonstrates the new composable section pattern
 */

import React from 'react';
import { 
  Section,
  HStack,
  VStack,
  EnhancedButton as Button
} from '@components';

const EnhancedSectionWrapper = ({ 
  section, 
  handleCaseStudyClick, 
  authenticated 
}) => {
  if (!section) {
    console.error('Section data is undefined');
    return null;
  }

  const { 
    id, 
    className, 
    logo, 
    title, 
    subtitle, 
    description, 
    image, 
    caseStudies = [] 
  } = section;

  return (
    <Section id={id} className={className}>
      <HStack gap="lg" align="flex-start" style={{ width: '100%' }}>
        {/* Left Column */}
        <VStack gap="2xl" style={{ flex: '0 0 40%' }}>
          <Section.Header 
            logo={logo}
            title={title}
            subtitle={subtitle}
          />
          
          <Section.Description expandable>
            {description}
          </Section.Description>
          
          {caseStudies.length > 0 && (
            <Section.Actions layout="vertical" gap="sm">
              {caseStudies.map((study) => (
                <Button
                  key={study.key}
                  variant="secondary"
                  size="md"
                  icon={study.button.icon}
                  onClick={() => handleCaseStudyClick(study.key)}
                  fullWidth
                >
                  {study.button.text}
                </Button>
              ))}
            </Section.Actions>
          )}
        </VStack>

        {/* Right Column */}
        {image && (
          <div style={{ flex: '1' }}>
            <Section.Image 
              src={image} 
              alt={`${title} illustration`}
              threshold={0.9}
            />
          </div>
        )}
      </HStack>
    </Section>
  );
};

export default EnhancedSectionWrapper;
