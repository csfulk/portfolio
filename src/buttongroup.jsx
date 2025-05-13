import React from 'react';
import ReactDOM from 'react-dom/client';
import Button from './components/button'; // Use the Button component directly
import './styles/button.css';

console.log('ButtonGroup page is rendering');

const buttons = [
  { text: 'Primary', variant: 'primary' },
  { text: 'Secondary', variant: 'secondary' },
  { text: 'Outline', variant: 'outline' },
  { text: 'Text', variant: 'text-only' },
  { text: 'Destructive', variant: 'destructive' },
];

const ButtonGroup = ({ buttons, direction = 'horizontal' }) => {
  return (
    <div className={`button-group button-group-${direction}`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          text={button.text}
          variant={button.variant}
          size={button.size || 'md'} // Default size to 'md' if not provided
          icon={button.icon || null} // Default to no icon
          iconPosition={button.iconPosition || 'leading'} // Default icon position
          onClick={button.onClick || (() => {})} // Default to no-op
          disabled={button.disabled || false} // Default to enabled
        />
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ButtonGroup buttons={buttons} direction="horizontal" />
  </React.StrictMode>
);