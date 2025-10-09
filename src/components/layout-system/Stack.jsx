/**
 * Stack Component
 * Flexible layout for arranging items in vertical or horizontal stacks
 */

import React from 'react';
import PropTypes from 'prop-types';

const Stack = ({ 
  children, 
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  divider,
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const isHorizontal = direction === 'horizontal';
  
  const stackStyles = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: `var(--spacing-${gap})`,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  const classes = [
    'stack',
    `stack--${direction}`,
    `stack--gap-${gap}`,
    `stack--align-${align}`,
    `stack--justify-${justify}`,
    wrap && 'stack--wrap',
    className
  ].filter(Boolean).join(' ');

  // Handle children with dividers
  const renderChildren = () => {
    if (!divider) return children;

    const childArray = React.Children.toArray(children);
    return childArray.reduce((acc, child, index) => {
      acc.push(child);
      if (index < childArray.length - 1) {
        acc.push(
          <div key={`divider-${index}`} className="stack-divider">
            {divider}
          </div>
        );
      }
      return acc;
    }, []);
  };

  return (
    <Component 
      className={classes}
      style={stackStyles}
      {...props}
    >
      {renderChildren()}
    </Component>
  );
};

// HStack - Horizontal Stack shorthand
const HStack = ({ children, ...props }) => (
  <Stack direction="horizontal" {...props}>
    {children}
  </Stack>
);

// VStack - Vertical Stack shorthand  
const VStack = ({ children, ...props }) => (
  <Stack direction="vertical" {...props}>
    {children}
  </Stack>
);

Stack.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  gap: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly']),
  wrap: PropTypes.bool,
  divider: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType
};

HStack.propTypes = Stack.propTypes;
VStack.propTypes = Stack.propTypes;

Stack.Horizontal = HStack;
Stack.Vertical = VStack;

export { HStack, VStack };
export default Stack;
