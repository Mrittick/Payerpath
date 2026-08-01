import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Load the full design token cascade */
import './tokens/index.css';

import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
