import React from 'react';
import ReactDOM from 'react-dom/client';
import ButtonGroup from '../components/ButtonGroup';
import '../styles/button.css';
import './ButtonShowcase.css';
import '../styles/icon-font.css'; // Import icon font styles
import '../styles/primitives.css'; // Import primitive styles
import '../styles/index.css'; // Import global styles

console.log('ButtonGroup page is rendering');

const variants = ['primary', 'secondary', 'outline', 'text-only', 'destructive'];
const sizes = ['xs', 'sm', 'md', 'lg'];

const buttons = variants.flatMap((variant) =>
  sizes.map((size) => ({
    text: `${variant} ${size}`,
    variant,
    size,
  }))
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="button-showcase">
      <h1>Button Variants and Sizes</h1>
      <div className="button-table">
        {variants.map((variant) => (
          <div key={variant} className="button-row">
            <h2 className="button-row-header">{variant}</h2>
            <ButtonGroup
              buttons={sizes.map((size) => ({
                text: `${variant} ${size}`,
                variant,
                size,
              }))}
              direction="horizontal"
            />
          </div>
        ))}
      </div>
    </div>
  </React.StrictMode>
);