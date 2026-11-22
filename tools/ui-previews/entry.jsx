/* eslint-env browser */
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../../App';

// The fixture renders production components, not a separate mockup layout.
createRoot(document.getElementById('root')).render(<App />);
