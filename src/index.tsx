import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MemoryGame from './MemoryGame'; // Update the import to match the file name
import reportWebVitals from './reportWebVitals';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MemoryGame />
  </React.StrictMode>
);

// If you want to measure performance, pass a function to log results
reportWebVitals(console.log);