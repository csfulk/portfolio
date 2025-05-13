import React from 'react';
import './ButtonShowcase.css'; // Assuming you have a CSS file for styling the showcase
import Button from '../components/button';

const ButtonShowcase = () => {
  const sizes = ['xs', 'sm', 'md', 'lg'];
  const variants = ['primary', 'secondary', 'outline', 'text-only', 'destructive'];
  const icons = ['icon-View', 'icon-Lock', 'icon-Unlock', 'icon-Key_alt', 'icon-File_dock_add'];

  return (
    <div className="button-showcase">
      <h1>Button Showcase</h1>
      {sizes.map((size) => (
        <div key={size} className="button-group">
          <h2>{size.toUpperCase()} Buttons</h2>
          {variants.map((variant, index) => (
            <Button
              key={`${size}-${variant}`}
              size={size}
              variant={variant}
              text={`${variant.charAt(0).toUpperCase() + variant.slice(1)} ${size}`}
              icon={icons[index % icons.length]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ButtonShowcase;