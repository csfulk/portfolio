/**
 * Grid Component
 * Flexible CSS Grid layout with responsive capabilities
 */

import React from 'react';
import PropTypes from 'prop-types';

const Grid = ({ 
  children, 
  columns = 1,
  rows = 'auto',
  gap = 'md',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  alignContent = 'start',
  justifyContent = 'start',
  className = '',
  as: Component = 'div',
  responsive = {},
  ...props 
}) => {
  // Handle responsive columns
  const getResponsiveValue = (value, breakpoint) => {
    if (typeof value === 'object' && value !== null) {
      return value[breakpoint] || value.base || columns;
    }
    return value;
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: typeof columns === 'number' 
      ? `repeat(${columns}, 1fr)`
      : columns,
    gridTemplateRows: rows,
    gap: `var(--spacing-${gap})`,
    alignItems,
    justifyItems,
    alignContent,
    justifyContent,
    // Responsive styles will be handled by CSS classes
  };

  const classes = [
    'grid',
    `grid--columns-${typeof columns === 'number' ? columns : 'custom'}`,
    `grid--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  // Generate responsive CSS if needed
  const responsiveStyles = responsive && Object.keys(responsive).length > 0 ? {
    ...gridStyles,
    // This would typically be handled by CSS classes in a real implementation
  } : gridStyles;

  return (
    <Component 
      className={classes}
      style={responsiveStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

// Grid Item component for more control
const GridItem = ({ 
  children,
  colSpan = 1,
  rowSpan = 1,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  alignSelf = 'auto',
  justifySelf = 'auto',
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const itemStyles = {
    gridColumn: colStart && colEnd 
      ? `${colStart} / ${colEnd}`
      : colSpan > 1 
        ? `span ${colSpan}`
        : undefined,
    gridRow: rowStart && rowEnd
      ? `${rowStart} / ${rowEnd}`
      : rowSpan > 1
        ? `span ${rowSpan}`
        : undefined,
    alignSelf,
    justifySelf,
  };

  const classes = [
    'grid-item',
    colSpan > 1 && `grid-item--col-span-${colSpan}`,
    rowSpan > 1 && `grid-item--row-span-${rowSpan}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classes}
      style={itemStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
  rows: PropTypes.string,
  gap: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  alignItems: PropTypes.oneOf(['start', 'end', 'center', 'stretch']),
  justifyItems: PropTypes.oneOf(['start', 'end', 'center', 'stretch']),
  alignContent: PropTypes.oneOf(['start', 'end', 'center', 'stretch', 'space-around', 'space-between', 'space-evenly']),
  justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'stretch', 'space-around', 'space-between', 'space-evenly']),
  className: PropTypes.string,
  as: PropTypes.elementType,
  responsive: PropTypes.object
};

GridItem.propTypes = {
  children: PropTypes.node.isRequired,
  colSpan: PropTypes.number,
  rowSpan: PropTypes.number,
  colStart: PropTypes.number,
  colEnd: PropTypes.number,
  rowStart: PropTypes.number,
  rowEnd: PropTypes.number,
  alignSelf: PropTypes.oneOf(['auto', 'start', 'end', 'center', 'stretch']),
  justifySelf: PropTypes.oneOf(['auto', 'start', 'end', 'center', 'stretch']),
  className: PropTypes.string,
  as: PropTypes.elementType
};

Grid.Item = GridItem;

export default Grid;
