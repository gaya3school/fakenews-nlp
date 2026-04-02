import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '14px',
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
          },
          duration: 2800,
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
